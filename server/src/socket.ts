import { Server as IOServer } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';
import { env } from './env.js';
import { getScramble } from './scramble.js';
import {
  effectiveTime,
  type ClientToServerEvents,
  type ServerToClientEvents,
  type BattleRoomDTO,
  type BattleRoundResultEntry,
} from '@scc/shared';

// Points awarded by finish rank (index 0 = 1st place).
const POINTS_BY_RANK = [5, 3, 2];
const POINTS_DEFAULT = 1; // 4th place and beyond

function rankPoints(rank: number): number {
  return POINTS_BY_RANK[rank - 1] ?? POINTS_DEFAULT;
}

async function buildRoomDTO(code: string): Promise<BattleRoomDTO | null> {
  const room = await prisma.battleRoom.findUnique({
    where: { code },
    include: { participants: { orderBy: { id: 'asc' } } },
  });
  if (!room) return null;
  return {
    id: room.id,
    code: room.code,
    name: room.name,
    eventId: room.eventId,
    isPublic: room.isPublic,
    scramble: room.scramble,
    roundNumber: room.roundNumber,
    status: room.status,
    participants: room.participants.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.guestName ?? 'Player',
      points: p.points,
      ready: p.ready,
      time: p.time,
      penalty: p.penalty,
      finishedAt: p.finishedAt?.toISOString() ?? null,
    })),
  };
}

async function deleteRoomIfEmpty(code: string): Promise<void> {
  const room = await prisma.battleRoom.findUnique({
    where: { code },
    include: { participants: { select: { id: true } } },
  });
  if (room && room.participants.length === 0) {
    await prisma.battleRoom.delete({ where: { id: room.id } });
  }
}

export function attachSocket(server: HttpServer): IOServer {
  const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  // Pending auto-start timers keyed by room code.
  const autoStartTimers = new Map<string, ReturnType<typeof setTimeout>>();

  async function broadcastRoomState(code: string) {
    const dto = await buildRoomDTO(code);
    if (dto) io.to(code).emit('room_state', dto);
  }

  // Start a round automatically once enough players are present.
  async function autoStartRound(code: string): Promise<void> {
    const room = await prisma.battleRoom.findUnique({
      where: { code },
      include: { participants: true },
    });
    if (!room || room.status !== 'WAITING' || room.participants.length < 2) return;

    const scramble = await getScramble(room.eventId);
    const roundNumber = room.roundNumber + 1;

    await prisma.battleParticipant.updateMany({
      where: { roomId: room.id },
      data: { ready: true },
    });
    await prisma.battleRoom.update({
      where: { id: room.id },
      data: { status: 'ACTIVE', scramble, roundNumber },
    });

    io.to(code).emit('round_start', { scramble, roundNumber });
    await broadcastRoomState(code);
  }

  function scheduleAutoStart(code: string, delayMs: number) {
    const existing = autoStartTimers.get(code);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      autoStartTimers.delete(code);
      autoStartRound(code).catch((e) =>
        console.error('[socket] autoStartRound error:', e instanceof Error ? e.message : e),
      );
    }, delayMs);
    autoStartTimers.set(code, timer);
  }

  // Check round completion and emit results + schedule next round.
  async function checkRoundCompletion(code: string): Promise<void> {
    const room = await prisma.battleRoom.findUnique({
      where: { code },
      include: { participants: { orderBy: { id: 'asc' } } },
    });
    if (!room || room.status !== 'ACTIVE') return;

    const inRound = room.participants.filter((p) => p.ready);
    if (inRound.length < 2) return;
    if (!inRound.every((p) => p.finishedAt !== null)) return;

    // Rank by effective time (DNF → Infinity, sorts last).
    const ranked = [...inRound].sort(
      (a, b) =>
        effectiveTime(a.time ?? Infinity, a.penalty ?? 'NONE') -
        effectiveTime(b.time ?? Infinity, b.penalty ?? 'NONE'),
    );

    const results: BattleRoundResultEntry[] = [];
    for (let i = 0; i < ranked.length; i++) {
      const p = ranked[i];
      const et = effectiveTime(p.time ?? Infinity, p.penalty ?? 'NONE');
      const isDNF = !isFinite(et);
      const pointsEarned = isDNF ? 0 : rankPoints(i + 1);

      await prisma.battleParticipant.update({
        where: { id: p.id },
        data: { points: { increment: pointsEarned } },
      });

      results.push({
        participantId: p.id,
        name: p.guestName ?? 'Player',
        time: p.time,
        penalty: p.penalty,
        rank: i + 1,
        pointsEarned,
        totalPoints: p.points + pointsEarned,
      });
    }

    // Reset all participants for the next round.
    await prisma.battleParticipant.updateMany({
      where: { roomId: room.id },
      data: { ready: false, time: null, penalty: null, finishedAt: null },
    });
    await prisma.battleRoom.update({
      where: { id: room.id },
      data: { status: 'WAITING' },
    });

    io.to(code).emit('round_result', { results, roundNumber: room.roundNumber });

    // Auto-start the next round after 5 seconds so players can see results.
    scheduleAutoStart(code, 5000);
  }

  io.on('connection', (socket) => {
    let myParticipantId: string | null = null;
    let myCode: string | null = null;

    const safe =
      <A extends unknown[]>(fn: (...args: A) => Promise<void>) =>
      (...args: A) => {
        fn(...args).catch((e) => {
          console.error('[socket] handler error:', e instanceof Error ? e.message : e);
          socket.emit('error_msg', { message: 'A server error occurred' });
        });
      };

    socket.on(
      'join_room',
      safe(async ({ code, userId, name, password }) => {
        code = code.toUpperCase();
        const room = await prisma.battleRoom.findUnique({
          where: { code },
          include: { participants: true },
        });
        if (!room) {
          socket.emit('error_msg', { message: 'Room not found' });
          return;
        }

        // Password check for private rooms.
        if (room.password) {
          if (!password) {
            socket.emit('error_msg', { message: 'This room requires a password' });
            return;
          }
          const valid = await bcrypt.compare(password, room.password);
          if (!valid) {
            socket.emit('error_msg', { message: 'Incorrect password' });
            return;
          }
        }

        // Validate userId against DB to prevent FK violations from stale IDs.
        let safeUserId: string | null = null;
        if (userId) {
          const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
          safeUserId = exists ? userId : null;
        }

        // Reuse existing slot if same authenticated user is rejoining.
        const existing = safeUserId ? room.participants.find((p) => p.userId === safeUserId) : undefined;
        if (!existing && room.participants.length >= 10) {
          socket.emit('error_msg', { message: 'Room is full (max 10 players)' });
          return;
        }

        let participant = existing;
        if (!participant) {
          participant = await prisma.battleParticipant.create({
            data: { roomId: room.id, userId: safeUserId, guestName: name },
          });
        }
        myParticipantId = participant.id;
        myCode = code;
        socket.join(code);
        await broadcastRoomState(code);

        // If room is WAITING and now has 2+ players, schedule auto-start.
        if (room.status === 'WAITING') {
          const count = existing ? room.participants.length : room.participants.length + 1;
          if (count >= 2) scheduleAutoStart(code, 3000);
        }
      }),
    );

    socket.on(
      'solve_complete',
      safe(async ({ code, time, penalty }) => {
        code = code.toUpperCase();
        if (!myParticipantId) return;
        const room = await prisma.battleRoom.findUnique({
          where: { code },
          include: { participants: true },
        });
        if (!room || room.status !== 'ACTIVE') return;

        const me = room.participants.find((p) => p.id === myParticipantId);
        if (!me || !me.ready || me.finishedAt) return; // not in this round or already submitted

        await prisma.battleParticipant.update({
          where: { id: myParticipantId },
          data: { time, penalty, finishedAt: new Date() },
        });

        socket.to(code).emit('participant_finished', {
          participantId: myParticipantId,
          name: me.guestName ?? 'Player',
          time,
          penalty,
        });

        await checkRoundCompletion(code);
        await broadcastRoomState(code);
      }),
    );

    socket.on(
      'leave_room',
      safe(async ({ code }) => {
        code = code.toUpperCase();
        if (!myParticipantId) return;

        const room = await prisma.battleRoom.findUnique({
          where: { code },
          include: { participants: true },
        });

        // If round is active and this participant hasn't finished, mark as DNF.
        if (room?.status === 'ACTIVE') {
          const me = room.participants.find((p) => p.id === myParticipantId);
          if (me && !me.finishedAt) {
            await prisma.battleParticipant.update({
              where: { id: myParticipantId },
              data: { finishedAt: new Date(), penalty: 'DNF', time: null },
            });
          }
        }

        await prisma.battleParticipant.deleteMany({ where: { id: myParticipantId } });
        socket.leave(code);
        myParticipantId = null;

        if (room?.status === 'ACTIVE') {
          await checkRoundCompletion(code);
        }
        await deleteRoomIfEmpty(code);
        await broadcastRoomState(code);
        myCode = null;
      }),
    );

    socket.on('disconnect', async () => {
      if (!myParticipantId || !myCode) return;
      const code = myCode;
      try {
        const room = await prisma.battleRoom.findUnique({
          where: { code },
          include: { participants: true },
        });
        if (room?.status === 'ACTIVE') {
          const me = room.participants.find((p) => p.id === myParticipantId);
          if (me && !me.finishedAt) {
            await prisma.battleParticipant.update({
              where: { id: myParticipantId },
              data: { finishedAt: new Date(), penalty: 'DNF', time: null },
            });
            await checkRoundCompletion(code);
          }
        }
        await prisma.battleParticipant.deleteMany({ where: { id: myParticipantId } });
        await deleteRoomIfEmpty(code);
        await broadcastRoomState(code);
      } catch {
        /* room may be gone */
      }
    });
  });

  return io;
}
