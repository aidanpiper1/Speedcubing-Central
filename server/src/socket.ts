import { Server as IOServer } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import { prisma } from './prisma.js';
import { env } from './env.js';
import { getScramble } from './scramble.js';
import {
  effectiveTime,
  type ClientToServerEvents,
  type ServerToClientEvents,
  type BattleRoomDTO,
} from '@scc/shared';

async function buildRoomDTO(code: string): Promise<BattleRoomDTO | null> {
  const room = await prisma.battleRoom.findUnique({
    where: { code },
    include: { participants: { orderBy: { id: 'asc' } } },
  });
  if (!room) return null;
  return {
    id: room.id,
    code: room.code,
    scramble: room.scramble,
    eventId: room.eventId,
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
  };
}

export function attachSocket(server: HttpServer): IOServer {
  const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  io.on('connection', (socket) => {
    // Track which participant row this socket owns, per room.
    let myParticipantId: string | null = null;
    let myCode: string | null = null;

    async function emitRoomState(code: string) {
      const dto = await buildRoomDTO(code);
      if (dto) io.to(code).emit('room_state', dto);
    }

    // Wrap async socket handlers so a DB error can never crash the server.
    const safe =
      <A extends unknown[]>(fn: (...args: A) => Promise<void>) =>
      (...args: A) => {
        fn(...args).catch((e) => {
          console.error('[socket] handler error:', e instanceof Error ? e.message : e);
          socket.emit('error_msg', { message: 'A server error occurred' });
        });
      };

    socket.on('join_room', safe(async ({ code, userId, name }) => {
      code = code.toUpperCase();
      const room = await prisma.battleRoom.findUnique({
        where: { code },
        include: { participants: true },
      });
      if (!room) {
        socket.emit('error_msg', { message: 'Room not found' });
        return;
      }
      // Only treat userId as a real FK if that user actually exists; otherwise
      // join as a guest (prevents foreign-key violations from stale ids).
      let safeUserId: string | null = null;
      if (userId) {
        const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
        safeUserId = exists ? userId : null;
      }
      if (room.participants.length >= 2 && !room.participants.some((p) => p.userId === safeUserId && safeUserId)) {
        socket.emit('error_msg', { message: 'Room is full' });
        return;
      }
      // Reuse an existing participant row for this user, else create one.
      let participant = safeUserId ? room.participants.find((p) => p.userId === safeUserId) : undefined;
      if (!participant) {
        participant = await prisma.battleParticipant.create({
          data: { roomId: room.id, userId: safeUserId, guestName: name },
        });
      }
      myParticipantId = participant.id;
      myCode = code;
      socket.join(code);
      socket.emit('scramble', { scramble: room.scramble });
      await emitRoomState(code);
    }));

    socket.on('ready', safe(async ({ code }) => {
      code = code.toUpperCase();
      if (!myParticipantId) return;
      await prisma.battleParticipant.update({
        where: { id: myParticipantId },
        data: { ready: true },
      });
      const room = await prisma.battleRoom.findUnique({
        where: { code },
        include: { participants: true },
      });
      if (!room) return;
      const allReady = room.participants.length >= 2 && room.participants.every((p) => p.ready);
      if (allReady) {
        await prisma.battleRoom.update({ where: { id: room.id }, data: { status: 'ACTIVE' } });
        io.to(code).emit('both_ready', { scramble: room.scramble });
      }
      await emitRoomState(code);
    }));

    socket.on('solve_complete', safe(async ({ code, time, penalty }) => {
      code = code.toUpperCase();
      if (!myParticipantId) return;
      await prisma.battleParticipant.update({
        where: { id: myParticipantId },
        data: { time, penalty, finishedAt: new Date() },
      });
      socket.to(code).emit('opponent_finished', { participantId: myParticipantId, time, penalty });

      const room = await prisma.battleRoom.findUnique({
        where: { code },
        include: { participants: true },
      });
      if (!room) return;
      const finished = room.participants.filter((p) => p.finishedAt !== null);
      if (room.participants.length >= 2 && finished.length >= 2) {
        // Determine winner.
        const ranked = [...room.participants].sort(
          (a, b) =>
            effectiveTime(a.time ?? Infinity, a.penalty ?? 'NONE') -
            effectiveTime(b.time ?? Infinity, b.penalty ?? 'NONE'),
        );
        const t0 = effectiveTime(ranked[0].time ?? Infinity, ranked[0].penalty ?? 'NONE');
        const t1 = effectiveTime(ranked[1].time ?? Infinity, ranked[1].penalty ?? 'NONE');
        const winnerId = t0 === t1 ? null : ranked[0].id;
        await prisma.battleRoom.update({ where: { id: room.id }, data: { status: 'FINISHED' } });
        io.to(code).emit('room_result', {
          roomId: room.id,
          winnerParticipantId: winnerId,
          results: room.participants.map((p) => ({
            id: p.id,
            userId: p.userId,
            name: p.guestName ?? 'Player',
            ready: p.ready,
            time: p.time,
            penalty: p.penalty,
            finishedAt: p.finishedAt?.toISOString() ?? null,
          })),
        });
      }
      await emitRoomState(code);
    }));

    socket.on('rematch', safe(async ({ code }) => {
      code = code.toUpperCase();
      const room = await prisma.battleRoom.findUnique({ where: { code } });
      if (!room) return;
      await prisma.battleParticipant.updateMany({
        where: { roomId: room.id },
        data: { ready: false, time: null, penalty: null, finishedAt: null },
      });
      await prisma.battleRoom.update({
        where: { id: room.id },
        data: { status: 'WAITING', scramble: await getScramble(room.eventId) },
      });
      const updated = await prisma.battleRoom.findUnique({ where: { id: room.id } });
      if (updated) io.to(code).emit('scramble', { scramble: updated.scramble });
      await emitRoomState(code);
    }));

    socket.on('leave_room', safe(async ({ code }) => {
      code = code.toUpperCase();
      if (myParticipantId) {
        await prisma.battleParticipant.deleteMany({ where: { id: myParticipantId } });
        myParticipantId = null;
      }
      socket.leave(code);
      await emitRoomState(code);
    }));

    socket.on('disconnect', async () => {
      if (myParticipantId && myCode) {
        try {
          await prisma.battleParticipant.update({
            where: { id: myParticipantId },
            data: { ready: false },
          });
          await emitRoomState(myCode);
        } catch {
          /* room may be gone */
        }
      }
    });
  });

  return io;
}
