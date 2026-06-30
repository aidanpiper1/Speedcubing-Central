import type { OllPattern, PllArrow } from '../components/CubeDiagram';

export interface AlgCase {
  id: string;
  name: string;
  group: string;
  moves: string;
  probability: string; // e.g. "1/54"
  alts?: string[];     // alternate algorithms for the same case
  slotAlts?: Record<string, string[]>; // F2L: algs per slot position (Front Right, Front Left, etc.)
  diagramSuffix?: string; // extra moves appended to experimentalSetupAlg (hidden from UI)
  oll?: OllPattern;
  pll?: PllArrow[];
}

export type AlgSetKind = 'oll' | 'pll' | 'f2l' | 'coll' | 'zbll' | '2x2-oll' | '2x2-pbl' | 'cll' | 'eg1' | 'eg2';

export interface AlgSet {
  id: string;
  name: string;
  kind: AlgSetKind;
  description: string;
  cases: AlgCase[];
}

// Helper to build an OLL pattern from compact 0/1 strings.
export function ollPattern(u: string, top: string, right: string, bottom: string, left: string): OllPattern {
  const b = (s: string) => s.split('').map((c) => c === '1');
  return { u: b(u), top: b(top), right: b(right), bottom: b(bottom), left: b(left) };
}
