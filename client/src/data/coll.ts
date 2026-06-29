import { ollPattern, type AlgCase, type AlgSet } from './algTypes';

const fullCross = '010111010';
const co = (id: string, name: string, group: string, moves: string): AlgCase => ({
  id,
  name,
  group,
  moves,
  probability: '1/40',
  oll: ollPattern(fullCross, '101', '101', '101', '101'),
});

const collCases: AlgCase[] = [
  // Anti Sune
  co('COLL-A1', 'Anti Sune 1', 'Anti Sune', "y R U2 R' U' R U' R'"),
  co('COLL-A2', 'Anti Sune 2', 'Anti Sune', "y2 R2 D R' U R D' R' U R' U' R U' R'"),
  co('COLL-A3', 'Anti Sune 3', 'Anti Sune', "y2 R2 D R' U2 R D' R2 U' R U' R'"),
  co('COLL-A4', 'Anti Sune 4', 'Anti Sune', "y2 R' U' R U' R2 D' R U2 R' D R2"),
  co('COLL-A5', 'Anti Sune 5', 'Anti Sune', "y2 r' F R F' r U R'"),
  co('COLL-A6', 'Anti Sune 6', 'Anti Sune', "R U' R' U2 R U' R' U2 R' D' R U R' D R"),

  // Sune
  co('COLL-S1', 'Sune 1', 'Sune', "R U R' U R U2 R'"),
  co('COLL-S2', 'Sune 2', 'Sune', "y2 R U R' U R2 D R' U2 R D' R2"),
  co('COLL-S3', 'Sune 3', 'Sune', "L' R U R' U' L U2 R U2 R'"),
  co('COLL-S4', 'Sune 4', 'Sune', "y' R U R' U R U' R D R' U' R D' R2"),
  co('COLL-S5', 'Sune 5', 'Sune', "R U' L' U R' U' L"),
  co('COLL-S6', 'Sune 6', 'Sune', "y2 R U R' F' R U R' U R U2 R' F R U' R'"),

  // L
  co('COLL-L1', 'L 1', 'L', "y' R U R' U R U' R' U R U' R' U R U2 R'"),
  co('COLL-L2', 'L 2', 'L', "R' U2 R' D' R U2 R' D R2"),
  co('COLL-L3', 'L 3', 'L', "y R U2 R D R' U2 R D' R2"),
  co('COLL-L4', 'L 4', 'L', "y F R' F' r U R U' r'"),
  co('COLL-L5', 'L 5', 'L', "y2 F' r U R' U' r' F R"),
  co('COLL-L6', 'L 6', 'L', "y r U2 R2 F R F' R U2 r'"),

  // U
  co('COLL-U1', 'U 1', 'U', "R' U' R U' R' U2 R2 U R' U R U2 R'"),
  co('COLL-U2', 'U 2', 'U', "R' U R U2 R' L' U R U' L"),
  co('COLL-U3', 'U 3', 'U', "y2 R2 D R' U2 R D' R' U2 R'"),
  co('COLL-U4', 'U 4', 'U', "F R U' R' U R U R' U R U' R' F'"),
  co('COLL-U5', 'U 5', 'U', "R2 D' R U2 R' D R U2 R"),
  co('COLL-U6', 'U 6', 'U', "R2 D' R U R' D R U R U' R' U' R"),

  // T
  co('COLL-T1', 'T 1', 'T', "R U2 R' U' R U' R2 U2 R U R' U R"),
  co('COLL-T2', 'T 2', 'T', "R' U R U2 R' L' U R U' L"),
  co('COLL-T3', 'T 3', 'T', "y R' F' r U R U' r' F"),
  co('COLL-T4', 'T 4', 'T', "y2 F R U R' U' R U' R' U' R U R' F'"),
  co('COLL-T5', 'T 5', 'T', "y' r U R' U' r' F R F'"),
  co('COLL-T6', 'T 6', 'T', "R' U R2 D r' U2 r D' R2 U' R"),

  // Pi
  co('COLL-P1', 'Pi 1', 'Pi', "R U2 R2 U' R2 U' R2 U2 R"),
  co('COLL-P2', 'Pi 2', 'Pi', "y F U R U' R' U R U' R2 F' R U R U' R'"),
  co('COLL-P3', 'Pi 3', 'Pi', "R' U' F' R U R' U' R' F R2 U2 R' U2 R"),
  co('COLL-P4', 'Pi 4', 'Pi', "R U R' U' R' F R2 U R' U' R U R' U' F'"),
  co('COLL-P5', 'Pi 5', 'Pi', "R U' L' U R' U L U L' U L"),
  co('COLL-P6', 'Pi 6', 'Pi', "R' F' U' F U' R U S' R' U R S"),

  // H
  co('COLL-H1', 'H 1', 'H', "R U R' U R U' R' U R U2 R'"),
  co('COLL-H2', 'H 2', 'H', "F R U R' U' R U R' U' R U R' U' F'"),
  co('COLL-H3', 'H 3', 'H', "R U R' U R U L' U R' U' L"),
  co('COLL-H4', 'H 4', 'H', "y F R U R' U' R U R' U' R U R' U' F'"),
];

export const COLL_SET: AlgSet = {
  id: 'COLL',
  name: 'COLL',
  kind: 'coll',
  description: 'Corners of the Last Layer — orient and permute corners in one step (edges oriented).',
  cases: collCases,
};
