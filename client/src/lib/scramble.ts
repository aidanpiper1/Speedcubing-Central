import { Scrambow } from 'scrambow';
import { getEvent, normalizeScramble } from '@scc/shared';
import { api } from './api';

// Move sets for unofficial events as an emergency client-side fallback.
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

// Synchronous client-side fallback — used only if the server API is unreachable.
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

// Fetch a WCA-quality random-state scramble from the server (cubing.js runs
// server-side via Node.js worker_threads, avoiding browser Web Worker issues).
export async function getScramble(eventId: string): Promise<{ scramble: string; randomState: boolean }> {
  try {
    const { data } = await api.get<{ scramble: string; randomState: boolean }>(`/scramble/${eventId}`);
    if (data.scramble) return { scramble: data.scramble, randomState: data.randomState ?? true };
  } catch (e) {
    console.warn('Server scramble failed, falling back:', e);
  }
  return { scramble: generateScramble(eventId), randomState: false };
}
