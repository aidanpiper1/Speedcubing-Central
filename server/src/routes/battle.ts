import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { optionalAuth } from '../auth/middleware.js';
import { getScramble } from '../scramble.js';
import { EVENT_IDS } from '@scc/shared';

const router = Router();

function makeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const createSchema = z.object({
  eventId: z.string().refine((id) => EVENT_IDS.includes(id), 'Invalid event').default('333'),
});

// POST /api/battle — create a room
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { eventId } = createSchema.parse(req.body ?? {});
    let code = makeCode();
    // ensure uniqueness
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.battleRoom.findUnique({ where: { code } });
      if (!exists) break;
      code = makeCode();
    }
    const room = await prisma.battleRoom.create({
      data: { code, eventId, scramble: await getScramble(eventId), status: 'WAITING' },
    });
    res.status(201).json({ code: room.code, id: room.id, eventId: room.eventId });
  } catch (e) {
    next(e);
  }
});

// GET /api/battle/:code — room info
router.get('/:code', async (req, res, next) => {
  try {
    const room = await prisma.battleRoom.findUnique({
      where: { code: req.params.code.toUpperCase() },
      include: { participants: true },
    });
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.json({
      id: room.id,
      code: room.code,
      eventId: room.eventId,
      scramble: room.scramble,
      status: room.status,
      participants: room.participants.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.guestName ?? 'Player',
        ready: p.ready,
        time: p.time,
        penalty: p.penalty,
        finishedAt: p.finishedAt?.toISOString() ?? null,
      })),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
