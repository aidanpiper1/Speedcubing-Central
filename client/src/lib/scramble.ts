import { randomScrambleForEvent } from 'cubing/scramble';
import { Scrambow } from 'scrambow';
import { getEvent, normalizeScramble } from '@scc/shared';

// Move sets for unofficial events that cubing.js and scrambow don't support.
const UNOFFICIAL_MOVES: Record<string, string[]> = {
  kilominx: ["U", "U'", "R", "R'", "D", "D'", "L", "L'", "F", "F'", "BR", "BR'", "BL", "BL'"],
  fto: ["U", "U'", "F", "F'", "R", "R'", "L", "L'", "BL", "BL'", "BR", "BR'", "D", "D'"],
  redi_cube: ["U", "U'", "R", "R'", "F", "F'", "L", "L'", "B", "B'", "D", "D'"],
};

function randomMoveScramble(moves: string[], length: number): string {
  const out: string[] = [];
  for (let i = 0; i < length; i++) out.push(moves[Math.floor(Math.random() * moves.length)]);
  return out.join(' ');
}

// Fast synchronous fallback (random-move) used if random-state generation fails.
export function generateScramble(eventId: string): string {
  const unofficial = UNOFFICIAL_MOVES[eventId];
  if (unofficial) return randomMoveScramble(unofficial, 20);
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
// Unofficial events skip cubing.js and go straight to the random-move generator.
export async function getScramble(eventId: string): Promise<string> {
  if (UNOFFICIAL_MOVES[eventId]) return generateScramble(eventId);
  try {
    const alg = await randomScrambleForEvent(eventId);
    return normalizeScramble(alg.toString());
  } catch (e) {
    console.warn('random-state scramble failed, falling back:', e);
    return generateScramble(eventId);
  }
}
