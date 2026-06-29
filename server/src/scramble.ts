import pkg from 'scrambow';
import { getEvent, normalizeScramble } from '@scc/shared';

// scrambow is CommonJS; grab the Scrambow class via interop default.
const { Scrambow } = pkg as unknown as { Scrambow: typeof import('scrambow').Scrambow };

// Fast synchronous fallback (random-move) used if random-state generation fails.
export function generateScramble(eventId: string): string {
  const ev = getEvent(eventId);
  const type = ev?.scrambowType;
  if (!type) return ''; // no scrambow support for this event
  try {
    const scrambles = new Scrambow().setType(type).get(1);
    return normalizeScramble(scrambles[0]?.scramble_string ?? '');
  } catch (e) {
    console.warn('[scramble] generation failed for', eventId, e);
    return '';
  }
}

// Events where cubing.js is essential: BLD scrambles need the Rw/Uw orientation
// moves that TNoodle appends and scrambow omits.
const CUBING_JS_EVENTS = new Set(['333bf', '444bf', '555bf']);

// WCA-quality random-state scramble via cubing.js for BLD events; synchronous
// scrambow for everything else (avoids Node.js worker_thread instability in
// some hosting environments).
export async function getScramble(eventId: string): Promise<string> {
  if (CUBING_JS_EVENTS.has(eventId)) {
    try {
      const timeoutMs = 15_000;
      const { randomScrambleForEvent } = await import('cubing/scramble');
      const alg = await Promise.race([
        randomScrambleForEvent(eventId),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('cubing.js timeout')), timeoutMs),
        ),
      ]);
      return normalizeScramble(alg.toString());
    } catch (e) {
      console.warn('[scramble] cubing.js failed, falling back:', e instanceof Error ? e.message : e);
    }
  }
  return generateScramble(eventId);
}
