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

// WCA-quality random-state scramble via cubing.js (same generator family as
// TNoodle). Async; imported lazily so server startup isn't blocked by the WASM.
export async function getScramble(eventId: string): Promise<string> {
  try {
    const { randomScrambleForEvent } = await import('cubing/scramble');
    const alg = await randomScrambleForEvent(eventId);
    return normalizeScramble(alg.toString());
  } catch (e) {
    console.warn('[scramble] random-state failed, falling back:', e instanceof Error ? e.message : e);
    return generateScramble(eventId);
  }
}
