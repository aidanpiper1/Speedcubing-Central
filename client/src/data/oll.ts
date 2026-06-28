import { ollPattern, type AlgCase, type AlgSet } from './algTypes';

// pattern args: u (9, L->R T->B), top(3), right(3), bottom(3), left(3) — 1=yellow.
// Center u[4] is always yellow for OLL. Patterns are schematic recognition aids.
const c = (
  id: string,
  name: string,
  group: string,
  moves: string,
  probability: string,
  u: string,
  top: string,
  right: string,
  bottom: string,
  left: string,
): AlgCase => ({ id, name, group, moves, probability, oll: ollPattern(u, top, right, bottom, left) });

const ollCases: AlgCase[] = [
  // Dot cases (no edges oriented)
  c('OLL1', 'OLL 1 — Dot', 'Dot', "R U2 R2 F R F' U2 R' F R F'", '1/108', '000010000', '010', '010', '010', '010'),
  c('OLL2', 'OLL 2 — Dot', 'Dot', "F R U R' U' F' f R U R' U' f'", '1/54', '000010000', '101', '000', '101', '000'),
  c('OLL3', 'OLL 3 — Dot', 'Dot', "f R U R' U' f' U' F R U R' U' F'", '1/54', '000010001', '110', '010', '001', '000'),
  c('OLL4', 'OLL 4 — Dot', 'Dot', "f R U R' U' f' U F R U R' U' F'", '1/54', '100010000', '011', '000', '100', '010'),
  c('OLL5', 'OLL 5 — Square', 'Square', "r' U2 R U R' U r", '1/54', '000011011', '000', '000', '101', '110'),
  c('OLL6', 'OLL 6 — Square', 'Square', "r U2 R' U' R U' r'", '1/54', '000110110', '000', '110', '101', '000'),
  c('OLL7', 'OLL 7 — Lightning', 'Lightning', "r U R' U R U2 r'", '1/54', '100110000', '010', '110', '000', '000'),
  c('OLL8', 'OLL 8 — Lightning', 'Lightning', "r' U' R U' R' U2 r", '1/54', '001011000', '010', '000', '000', '011'),
  c('OLL9', 'OLL 9 — Lightning', 'Lightning', "R U R' U' R' F R2 U R' U' F'", '1/54', '001010110', '100', '100', '001', '010'),
  c('OLL10', 'OLL 10 — Lightning', 'Lightning', "R U R' U R' F R F' R U2 R'", '1/54', '100010011', '001', '010', '100', '001'),
  c('OLL11', 'OLL 11 — Lightning', 'Lightning', "r U R' U R' F R F' R U2 r'", '1/54', '000110011', '010', '100', '001', '010'),
  c('OLL12', 'OLL 12 — Lightning', 'Lightning', "F R U R' U' F' U F R U R' U' F'", '1/54', '000011110', '010', '010', '100', '001'),
  c('OLL13', 'OLL 13 — Knight', 'Knight Move', "F U R U' R2 F' R U R U' R'", '1/54', '001110010', '100', '010', '001', '000'),
  c('OLL14', 'OLL 14 — Knight', 'Knight Move', "R' F R U R' F' R F U' F'", '1/54', '100011010', '001', '000', '100', '010'),
  c('OLL15', 'OLL 15 — Knight', 'Knight Move', "r' U' r R' U' R U r' U r", '1/54', '000011010', '001', '000', '101', '010'),
  c('OLL16', 'OLL 16 — Knight', 'Knight Move', "r U r' R U R' U' r U' r'", '1/54', '000110010', '100', '010', '101', '000'),
  c('OLL17', 'OLL 17 — Dot', 'Dot', "F R' F' R2 r' U R U' R' U' M'", '1/54', '001010100', '010', '001', '010', '100'),
  c('OLL18', 'OLL 18 — Dot', 'Dot', "r U R' U R U2 r2 U' R U' R' U2 r", '1/54', '000111000', '010', '010', '010', '010'),
  c('OLL19', 'OLL 19 — Dot', 'Dot', "r' R U R U R' U' M' R' F R F'", '1/54', '000111000', '010', '001', '010', '100'),
  c('OLL20', 'OLL 20 — Dot', 'Dot', "r U R' U' M2 U R U' R' U' M'", '1/108', '000111000', '101', '101', '101', '101'),

  // Cross (all edges oriented) — OCLL
  c('OLL21', 'OLL 21 — Cross (H)', 'Cross', "R U2 R' U' R U R' U' R U' R'", '1/108', '010111010', '101', '000', '101', '000'),
  c('OLL22', 'OLL 22 — Cross (Pi)', 'Cross', "R U2 R2 U' R2 U' R2 U2 R", '1/54', '010111010', '101', '000', '000', '101'),
  c('OLL23', 'OLL 23 — Cross (U)', 'Cross', "R2 D R' U2 R D' R' U2 R'", '1/54', '010111110', '000', '000', '000', '101'),
  c('OLL24', 'OLL 24 — Cross (T)', 'Cross', "r U R' U' r' F R F'", '1/54', '010111011', '000', '100', '001', '000'),
  c('OLL25', 'OLL 25 — Cross (L)', 'Cross', "F' r U R' U' r' F R", '1/54', '010111010', '001', '100', '000', '100'),
  c('OLL26', 'OLL 26 — Cross (Antisune)', 'Cross', "R U2 R' U' R U' R'", '1/54', '010111000', '001', '000', '100', '100'),
  c('OLL27', 'OLL 27 — Cross (Sune)', 'Cross', "R U R' U R U2 R'", '1/54', '010111000', '100', '100', '000', '001'),

  // T, C, W, P, L, Z shapes
  c('OLL28', 'OLL 28 — Square (Daisy)', 'Square', "r U R' U' r' R U R U' R'", '1/54', '010110010', '100', '010', '001', '000'),
  c('OLL29', 'OLL 29 — Awkward', 'Awkward', "R U R' U' R U' R' F' U' F R U R'", '1/54', '001110010', '100', '010', '001', '010'),
  c('OLL30', 'OLL 30 — Awkward', 'Awkward', "F R' F R2 U' R' U' R U R' F2", '1/54', '100011010', '010', '010', '100', '001'),
  c('OLL31', 'OLL 31 — P', 'P', "R' U' F U R U' R' F' R", '1/54', '000110011', '010', '010', '100', '010'),
  c('OLL32', 'OLL 32 — P', 'P', "L U F' U' L' U L F L'", '1/54', '000011110', '010', '010', '001', '010'),
  c('OLL33', 'OLL 33 — T', 'T', "R U R' U' R' F R F'", '1/54', '010110010', '000', '010', '001', '000'),
  c('OLL34', 'OLL 34 — C', 'C', "R U R2 U' R' F R U R U' F'", '1/54', '010110010', '101', '000', '000', '010'),
  c('OLL35', 'OLL 35 — Fish', 'Fish', "R U2 R2 F R F' R U2 R'", '1/54', '000110011', '100', '010', '001', '000'),
  c('OLL36', 'OLL 36 — W', 'W', "L' U' L U' L' U L U L F' L' F", '1/54', '010011010', '001', '000', '100', '011'),
  c('OLL37', 'OLL 37 — Fish', 'Fish', "F R' F' R U R U' R'", '1/54', '001011010', '100', '000', '001', '010'),
  c('OLL38', 'OLL 38 — W', 'W', "R U R' U R U' R' U' R' F R F'", '1/54', '010110010', '100', '011', '000', '000'),
  c('OLL39', 'OLL 39 — Big Lightning', 'Lightning', "L F' L' U' L U F U' L'", '1/54', '010011000', '001', '000', '100', '011'),
  c('OLL40', 'OLL 40 — Big Lightning', 'Lightning', "R' F R U R' U' F' U R", '1/54', '010110000', '100', '011', '000', '001'),
  c('OLL41', 'OLL 41 — Awkward', 'Awkward', "R U R' U R U2 R' F R U R' U' F'", '1/54', '000010110', '110', '010', '001', '000'),
  c('OLL42', 'OLL 42 — Awkward', 'Awkward', "R' U' R U' R' U2 R F R U R' U' F'", '1/54', '000010011', '011', '000', '100', '010'),
  c('OLL43', 'OLL 43 — P', 'P', "F' U' L' U L F", '1/54', '000010011', '110', '000', '001', '010'),
  c('OLL44', 'OLL 44 — P', 'P', "F U R U' R' F'", '1/54', '000010110', '011', '010', '100', '000'),
  c('OLL45', 'OLL 45 — T', 'T', "F R U R' U' F'", '1/54', '000010010', '010', '010', '100', '001'),
  c('OLL46', 'OLL 46 — C', 'C', "R' U' R' F R F' U R", '1/54', '000010010', '101', '000', '010', '000'),
  c('OLL47', 'OLL 47 — Small L', 'Small L', "F' L' U' L U L' U' L U F", '1/54', '001011000', '011', '000', '000', '011'),
  c('OLL48', 'OLL 48 — Small L', 'Small L', "F R U R' U' R U R' U' F'", '1/54', '100110000', '110', '110', '000', '000'),
  c('OLL49', 'OLL 49 — Small L', 'Small L', "r U' r2 U r2 U r2 U' r", '1/54', '000110110', '000', '110', '000', '011'),
  c('OLL50', 'OLL 50 — Small L', 'Small L', "r' U r2 U' r2 U' r2 U r'", '1/54', '000011011', '000', '011', '000', '110'),
  c('OLL51', 'OLL 51 — Line/I', 'Line', "F U R U' R' U R U' R' F'", '1/54', '000010000', '011', '010', '110', '000'),
  c('OLL52', 'OLL 52 — Line/I', 'Line', "R U R' U R U' B U' B' R'", '1/54', '010010000', '100', '000', '100', '001'),
  c('OLL53', 'OLL 53 — Small L', 'Small L', "r' U' R U' R' U R U' R' U2 r", '1/54', '000011010', '000', '000', '101', '011'),
  c('OLL54', 'OLL 54 — Small L', 'Small L', "r U R' U R U' R' U R U2 r'", '1/54', '000110010', '000', '110', '101', '000'),
  c('OLL55', 'OLL 55 — Line/I', 'Line', "R U2 R2 U' R U' R' U2 F R F'", '1/54', '010010010', '000', '000', '101', '000'),
  c('OLL56', 'OLL 56 — Line/I', 'Line', "r U r' U R U' R' U R U' R' r U' r'", '1/54', '000010000', '101', '010', '101', '010'),
  c('OLL57', 'OLL 57 — Line/H', 'Line', "R U R' U' M' U R U' r'", '1/54', '010010010', '000', '101', '000', '101'),

];

export const OLL_SET: AlgSet = {
  id: 'OLL',
  name: 'OLL',
  kind: 'oll',
  description: 'Orientation of the Last Layer — all 57 cases, grouped by shape.',
  cases: ollCases,
};
