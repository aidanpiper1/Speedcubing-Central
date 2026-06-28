import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();
router.use(requireAuth);

// GET /api/bld/pairs — user's letter-pair associations
router.get('/pairs', async (req, res, next) => {
  try {
    const pairs = await prisma.letterPair.findMany({ where: { userId: req.user!.sub } });
    res.json(pairs.map((p) => ({ pair: p.pair, image: p.image })));
  } catch (e) {
    next(e);
  }
});

const pairSchema = z.object({
  pair: z.string().length(2).toUpperCase(),
  image: z.string().max(120),
});

// PUT /api/bld/pairs — upsert one association
router.put('/pairs', async (req, res, next) => {
  try {
    const { pair, image } = pairSchema.parse(req.body);
    const saved = await prisma.letterPair.upsert({
      where: { userId_pair: { userId: req.user!.sub, pair } },
      update: { image },
      create: { userId: req.user!.sub, pair, image },
    });
    res.json({ pair: saved.pair, image: saved.image });
  } catch (e) {
    next(e);
  }
});

export default router;
