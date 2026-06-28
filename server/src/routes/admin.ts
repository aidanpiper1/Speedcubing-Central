import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireAdmin } from '../auth/middleware.js';
import { EVENT_IDS } from '@scc/shared';

const router = Router();
router.use(requireAuth, requireAdmin);

const dailySchema = z.object({
  eventId: z.string().refine((id) => EVENT_IDS.includes(id), 'Invalid event'),
  scramble: z.string().min(1),
  date: z.string().optional(), // YYYY-MM-DD, defaults to today
});

// POST /api/admin/daily — manually set daily scramble
router.post('/daily', async (req, res, next) => {
  try {
    const { eventId, scramble, date } = dailySchema.parse(req.body);
    const dateKey = date ?? new Date().toISOString().slice(0, 10);
    const dateObj = new Date(`${dateKey}T00:00:00.000Z`);
    const daily = await prisma.dailyScramble.upsert({
      where: { date_eventId: { date: dateObj, eventId } },
      update: { scramble },
      create: { date: dateObj, eventId, scramble },
    });
    res.status(201).json({
      id: daily.id,
      date: daily.date.toISOString().slice(0, 10),
      eventId: daily.eventId,
      scramble: daily.scramble,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/stats — basic counts for the admin dashboard
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, solves, sessions, rooms] = await Promise.all([
      prisma.user.count(),
      prisma.solve.count(),
      prisma.session.count(),
      prisma.battleRoom.count(),
    ]);
    res.json({ users, solves, sessions, rooms });
  } catch (e) {
    next(e);
  }
});

export default router;
