import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();
router.use(requireAuth);

// SM-2 spaced repetition update given a quality grade 0..5.
function sm2(prev: { easeFactor: number; intervalDays: number; repetitions: number }, quality: number) {
  let { easeFactor, intervalDays, repetitions } = prev;
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return { easeFactor, intervalDays, repetitions };
}

// GET /api/alg/progress/:setId — progress for a set
router.get('/progress/:setId', async (req, res, next) => {
  try {
    const rows = await prisma.algProgress.findMany({
      where: { userId: req.user!.sub, setId: req.params.setId },
    });
    res.json(
      rows.map((r) => ({
        caseId: r.caseId,
        easeFactor: r.easeFactor,
        intervalDays: r.intervalDays,
        repetitions: r.repetitions,
        dueAt: r.dueAt.toISOString(),
      })),
    );
  } catch (e) {
    next(e);
  }
});

const reviewSchema = z.object({
  setId: z.string(),
  caseId: z.string(),
  quality: z.number().int().min(0).max(5),
});

// POST /api/alg/review — record a drill result and update SM-2 schedule
router.post('/review', async (req, res, next) => {
  try {
    const { setId, caseId, quality } = reviewSchema.parse(req.body);
    const existing = await prisma.algProgress.findUnique({
      where: { userId_setId_caseId: { userId: req.user!.sub, setId, caseId } },
    });
    const prev = existing
      ? { easeFactor: existing.easeFactor, intervalDays: existing.intervalDays, repetitions: existing.repetitions }
      : { easeFactor: 2.5, intervalDays: 0, repetitions: 0 };
    const next2 = sm2(prev, quality);
    const dueAt = new Date(Date.now() + next2.intervalDays * 24 * 60 * 60 * 1000);
    const saved = await prisma.algProgress.upsert({
      where: { userId_setId_caseId: { userId: req.user!.sub, setId, caseId } },
      update: { ...next2, dueAt, lastReviewed: new Date() },
      create: { userId: req.user!.sub, setId, caseId, ...next2, dueAt, lastReviewed: new Date() },
    });
    res.json({
      caseId: saved.caseId,
      easeFactor: saved.easeFactor,
      intervalDays: saved.intervalDays,
      repetitions: saved.repetitions,
      dueAt: saved.dueAt.toISOString(),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
