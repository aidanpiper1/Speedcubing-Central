import { randomScrambleForEvent } from 'cubing/scramble';
import { Scrambow } from 'scrambow';
import { getEvent, normalizeScramble } from '@scc/shared';

// Fast synchronous fallback (random-move) used if random-state generation fails.
export function generateScramble(eventId: string): string {
  const type = getEvent(eventId)?.scrambowType;
  if (!type) return '';
  try {
    const s = new Scrambow().setType(type).get(1);
    return normalizeScramble(s[0]?.scramble_string ?? '');
  } catch {
    return '';
  }
}

// WCA-quality random-state scramble via cubing.js (the same generator family as
// TNoodle). Async — random-state for 4x4+ can take up to a couple of seconds.
export async function getScramble(eventId: string): Promise<string> {
  try {
    const alg = await randomScrambleForEvent(eventId);
    return normalizeScramble(alg.toString());
  } catch (e) {
    console.warn('random-state scramble failed, falling back:', e);
    return generateScramble(eventId);
  }
}
