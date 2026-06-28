import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../auth/middleware.js';
import { toPublicUser } from '../util/dto.js';
import { EVENT_IDS, effectiveTime, trimmedAverage, type GoalDTO } from '@scc/shared';

const router = Router();

// Compute per-event session stats for a user.
async function computeStats(userId: string) {
  const sessions = await prisma.session.findMany({
    where: { userId },
    include: { solves: { orderBy: { createdAt: 'desc' } } },
  });
  const byEvent: Record<string, { bestSingle: number | null; bestAo5: number | null; solveCount: number }> = {};
  for (const s of sessions) {
    const ev = (byEvent[s.eventId] ??= { bestSingle: null, bestAo5: null, solveCount: 0 });
    ev.solveCount += s.solves.length;
    for (const solve of s.solves) {
      const t = effectiveTime(solve.time, solve.penalty);
      if (isFinite(t) && (ev.bestSingle === null || t < ev.bestSingle)) ev.bestSingle = t;
    }
    // best Ao5 across rolling windows
    const arr = s.solves.map((x) => ({ time: x.time, penalty: x.penalty }));
    for (let i = 0; i + 5 <= arr.length; i++) {
      const a = trimmedAverage(arr.slice(i, i + 5));
      if (a.value !== null && (ev.bestAo5 === null || a.value < ev.bestAo5)) ev.bestAo5 = a.value;
    }
  }
  return byEvent;
}

// GET /api/profile/me — authenticated user's profile + stats + goals
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const stats = await computeStats(user.id);
    const goals = await prisma.userGoal.findMany({ where: { userId: user.id } });
    res.json({
      user: toPublicUser(user),
      stats,
      goals: goals.map((g) => ({ eventId: g.eventId, targetTime: g.targetTime })),
    });
  } catch (e) {
    next(e);
  }
});

const nameSchema = z.object({ displayName: z.string().min(1).max(40) });

// PUT /api/profile/me — update display name
router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const { displayName } = nameSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { displayName },
    });
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    next(e);
  }
});

// GET /api/profile/me/goals
router.get('/me/goals', requireAuth, async (req, res, next) => {
  try {
    const goals = await prisma.userGoal.findMany({ where: { userId: req.user!.sub } });
    const out: GoalDTO[] = goals.map((g) => ({ eventId: g.eventId, targetTime: g.targetTime }));
    res.json(out);
  } catch (e) {
    next(e);
  }
});

const goalSchema = z.object({ targetTime: z.number().int().positive() });

// PUT /api/profile/me/goals/:eventId
router.put('/me/goals/:eventId', requireAuth, async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    if (!EVENT_IDS.includes(eventId)) {
      res.status(400).json({ error: 'Invalid event' });
      return;
    }
    const { targetTime } = goalSchema.parse(req.body);
    const goal = await prisma.userGoal.upsert({
      where: { userId_eventId: { userId: req.user!.sub, eventId } },
      update: { targetTime },
      create: { userId: req.user!.sub, eventId, targetTime },
    });
    res.json({ eventId: goal.eventId, targetTime: goal.targetTime });
  } catch (e) {
    next(e);
  }
});

// GET /api/profile/:wcaId — public profile
router.get('/:wcaId', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { wcaId: req.params.wcaId.toUpperCase() } });
    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const stats = await computeStats(user.id);
    res.json({ user: toPublicUser(user), stats });
  } catch (e) {
    next(e);
  }
});

export default router;
