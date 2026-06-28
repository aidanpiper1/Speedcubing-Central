import { ollPattern, type AlgCase, type AlgSet } from './algTypes';

// COLL = orient + permute last-layer corners with edges already oriented.
// 40 cases grouped by their OLL corner shape. Cross is fully oriented (yellow).
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
  // Sune
  co('COLL-S1', 'Sune 1', 'Sune', "R U R' U R U2 R'"),
  co('COLL-S2', 'Sune 2', 'Sune', "R U2 R2 U' R2 U' R2 U2 R"),
  co('COLL-S3', 'Sune 3', 'Sune', "R U R' U R' F R F' R U2 R'"),
  co('COLL-S4', 'Sune 4', 'Sune', "F R' F' r U R U' r'"),
  co('COLL-S5', 'Sune 5', 'Sune', "R' U' R U' R' U2 R2 U R' U R U2 R'"),
  co('COLL-S6', 'Sune 6', 'Sune', "R U2 R' U' R U' R' U2 F R U R' U' F'"),
  // Antisune
  co('COLL-A1', 'Antisune 1', 'Antisune', "R U2 R' U' R U' R'"),
  co('COLL-A2', 'Antisune 2', 'Antisune', "R' U' R U' R' U2 R"),
  co('COLL-A3', 'Antisune 3', 'Antisune', "R U R' U R U2 R' F R U R' U' F'"),
  co('COLL-A4', 'Antisune 4', 'Antisune', "L' U R U' L U R'"),
  co('COLL-A5', 'Antisune 5', 'Antisune', "R U R D R' U' R D' R2"),
  co('COLL-A6', 'Antisune 6', 'Antisune', "R' U' R U' R' U R' F R F' U R"),
  // Pi
  co('COLL-P1', 'Pi 1', 'Pi', "R U2 R2 U' R2 U' R2 U2 R"),
  co('COLL-P2', 'Pi 2', 'Pi', "F R U R' U' R U R' U' R U R' U' F'"),
  co('COLL-P3', 'Pi 3', 'Pi', "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R"),
  co('COLL-P4', 'Pi 4', 'Pi', "R U R' U R U' R' U R U2 R'"),
  co('COLL-P5', 'Pi 5', 'Pi', "R' U' R U' R' U2 R F R U R' U' F'"),
  co('COLL-P6', 'Pi 6', 'Pi', "R U2 R' U' R U R' U' R U' R'"),
  // H
  co('COLL-H1', 'H 1', 'H', "R U R' U R U' R' U R U2 R'"),
  co('COLL-H2', 'H 2', 'H', "F R U R' U' R U R' U' R U R' U' F'"),
  co('COLL-H3', 'H 3', 'H', "R U2 R' U' R U R' U' R U R' U' R U' R'"),
  co('COLL-H4', 'H 4', 'H', "R U R' U R U L' U R' U' L"),
  // T
  co('COLL-T1', 'T 1', 'T', "R U R' U' R' F R F'"),
  co('COLL-T2', 'T 2', 'T', "R U2 R' U' R U' R' U F R U R' U' F'"),
  co('COLL-T3', 'T 3', 'T', "r U R' U' r' F R F'"),
  co('COLL-T4', 'T 4', 'T', "R' U R U2 R' U' R U R' U2 R"),
  co('COLL-T5', 'T 5', 'T', "L' U' L U' L' U L U L F' L' F"),
  co('COLL-T6', 'T 6', 'T', "F R U' R' U R U R' U R U' R' F'"),
  // U
  co('COLL-U1', 'U 1', 'U', "R2 D R' U2 R D' R' U2 R'"),
  co('COLL-U2', 'U 2', 'U', "R' U' R U' R' U2 R2 U R' U R U2 R'"),
  co('COLL-U3', 'U 3', 'U', "R2 D' R U2 R' D R U2 R"),
  co('COLL-U4', 'U 4', 'U', "R U R' U R U' R' U R U' R' U R U2 R'"),
  co('COLL-U5', 'U 5', 'U', "F R2 D R' U R D' R2 U' F'"),
  co('COLL-U6', 'U 6', 'U', "R' U2 R' D' R U2 R' D R2"),
  // L
  co('COLL-L1', 'L 1', 'L', "R U2 R' U' R U' R' U2 F R U R' U' F'"),
  co('COLL-L2', 'L 2', 'L', "F R' F' r U R U' r'"),
  co('COLL-L3', 'L 3', 'L', "R U2 R D R' U2 R D' R2"),
  co('COLL-L4', 'L 4', 'L', "R U2 R' U' R U' R' F R U R' U' F'"),
  co('COLL-L5', 'L 5', 'L', "R' U' R U' R' U R U R B' R' B"),
  co('COLL-L6', 'L 6', 'L', "R U R' U' R U' R' F' U' F R U R'"),
];

export const COLL_SET: AlgSet = {
  id: 'COLL',
  name: 'COLL',
  kind: 'coll',
  description: 'Corners of the Last Layer — orient and permute corners in one step (edges oriented).',
  cases: collCases,
};
