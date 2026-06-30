import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';
import { getScramble } from '../scramble.js';
import { EVENT_IDS, effectiveTime, type DailyLeaderboardEntry } from '@scc/shared';

const router = Router();

// Today's date as a UTC date-only key, e.g. "2026-06-25"
function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function todayDate(): Date {
  return new Date(`${todayKey()}T00:00:00.000Z`);
}

// Get or create today's daily scramble for an event.
async function getOrCreateDaily(eventId: string) {
  const date = todayDate();
  const existing = await prisma.dailyScramble.findUnique({
    where: { date_eventId: { date, eventId } },
  });
  if (existing) return existing;
  // Determinism comes from persistence: the first request generates and stores
  // the scramble; everyone that day reads the stored one.
  const scramble = await getScramble(eventId);
  // Use upsert to avoid race conditions creating duplicates.
  return prisma.dailyScramble.upsert({
    where: { date_eventId: { date, eventId } },
    update: {},
    create: { date, eventId, scramble },
  });
}

const eventParam = z.string().refine((id) => EVENT_IDS.includes(id), 'Invalid event');

// GET /api/daily/:eventId — get today's scramble for event
router.get('/:eventId', optionalAuth, async (req, res, next) => {
  try {
    const eventId = eventParam.parse(req.params.eventId);
    const daily = await getOrCreateDaily(eventId);
    let myResult = null;
    if (req.user) {
      const r = await prisma.dailyResult.findUnique({
        where: { userId_dailyScrambleId: { userId: req.user.sub, dailyScrambleId: daily.id } },
      });
      if (r) myResult = { time: r.time, penalty: r.penalty };
    }
    res.json({
      id: daily.id,
      date: daily.date.toISOString().slice(0, 10),
      eventId: daily.eventId,
      scramble: daily.scramble,
      myResult,
    });
  } catch (e) {
    next(e);
  }
});

const resultSchema = z.object({
  time: z.number().int().nonnegative(),
  penalty: z.enum(['NONE', 'PLUS2', 'DNF']).default('NONE'),
});

// POST /api/daily/:eventId/result — submit daily result (one per user per day)
router.post('/:eventId/result', requireAuth, async (req, res, next) => {
  try {
    const eventId = eventParam.parse(req.params.eventId);
    const { time, penalty } = resultSchema.parse(req.body);
    const daily = await getOrCreateDaily(eventId);
    const result = await prisma.dailyResult.upsert({
      where: { userId_dailyScrambleId: { userId: req.user!.sub, dailyScrambleId: daily.id } },
      update: { time, penalty },
      create: { userId: req.user!.sub, dailyScrambleId: daily.id, time, penalty },
    });
    res.status(201).json({ time: result.time, penalty: result.penalty });
  } catch (e) {
    next(e);
  }
});

// GET /api/daily/:eventId/leaderboard — today's leaderboard
router.get('/:eventId/leaderboard', async (req, res, next) => {
  try {
    const eventId = eventParam.parse(req.params.eventId);
    const daily = await getOrCreateDaily(eventId);
    const results = await prisma.dailyResult.findMany({
      where: { dailyScrambleId: daily.id },
      include: { user: true },
    });
    const sorted = results
      .map((r) => ({
        userId: r.userId,
        displayName: r.user.displayName,
        wcaId: r.user.wcaId,
        time: r.time,
        penalty: r.penalty,
        eff: effectiveTime(r.time, r.penalty),
      }))
      .sort((a, b) => a.eff - b.eff);

    const leaderboard: DailyLeaderboardEntry[] = sorted.map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      displayName: r.displayName,
      wcaId: r.wcaId,
      time: r.time,
      penalty: r.penalty,
    }));
    res.json(leaderboard);
  } catch (e) {
    next(e);
  }
});

export default router;
