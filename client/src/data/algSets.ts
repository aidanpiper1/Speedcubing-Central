import { OLL_SET } from './oll';
import { PLL_SET } from './pll';
import { F2L_SET } from './f2l';
import { COLL_SET } from './coll';
import type { AlgSet } from './algTypes';

export const ALG_SETS: AlgSet[] = [OLL_SET, PLL_SET, F2L_SET, COLL_SET];

export function getSet(id: string): AlgSet | undefined {
  return ALG_SETS.find((s) => s.id === id);
}

// Normalize a WCA-notation algorithm string for comparison in drill mode.
export function normalizeAlg(alg: string): string {
  return alg
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/’/g, "'")
    .trim();
}

export type { AlgSet, AlgCase } from './algTypes';
