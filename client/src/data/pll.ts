import type { AlgCase, AlgSet } from './algTypes';

const pllCases: AlgCase[] = [
  // EPLL — edges only
  { id: 'Ua', name: 'Ua Perm', group: 'EPLL', probability: '1/18', moves: "y2 M2 U M U2 M' U M2", alts: ["R U' R U R U R U' R' U' R2", "y2 R2 U' R2 U' R2 U y2 R2 U R2 U R2"], pll: [{ from: 1, to: 7 }, { from: 7, to: 5 }, { from: 5, to: 1 }] },
  { id: 'Ub', name: 'Ub Perm', group: 'EPLL', probability: '1/18', moves: "y2 M2 U' M U2 M' U' M2", alts: ["R2 U R U R' U' R' U' R' U R'", "y2 R2 U R2 U R2 U' y2 R2 U' R2 U' R2"], pll: [{ from: 1, to: 5 }, { from: 5, to: 7 }, { from: 7, to: 1 }] },
  { id: 'Z',  name: 'Z Perm',  group: 'EPLL', probability: '1/36', moves: "M' U' M2 U' M2 U' M' U2 M2", alts: ["M2 U' M2 U' M' U2 M2 U2 M'"], pll: [{ from: 1, to: 3 }, { from: 3, to: 1 }, { from: 5, to: 7 }, { from: 7, to: 5 }] },
  { id: 'H',  name: 'H Perm',  group: 'EPLL', probability: '1/72', moves: "M2 U' M2 U2 M2 U' M2", pll: [{ from: 1, to: 7 }, { from: 7, to: 1 }, { from: 3, to: 5 }, { from: 5, to: 3 }] },

  // Corners only
  { id: 'Aa', name: 'Aa Perm', group: 'Corners', probability: '1/18', moves: "x R' U R' D2 R U' R' D2 R2 x'", alts: ["R' F R' B2 R F' R' B2 R2"], pll: [{ from: 0, to: 2 }, { from: 2, to: 8 }, { from: 8, to: 0 }] },
  { id: 'Ab', name: 'Ab Perm', group: 'Corners', probability: '1/18', moves: "x R2 D2 R U R' D2 R U' R x'", alts: ["R B' R F2 R' B R F2 R2"], pll: [{ from: 2, to: 0 }, { from: 0, to: 8 }, { from: 8, to: 2 }] },
  { id: 'E',  name: 'E Perm',  group: 'Corners', probability: '1/36', moves: "y x' R U' R' D R U R' D' R U R' D R U' R' D' x", pll: [{ from: 0, to: 6 }, { from: 6, to: 0 }, { from: 2, to: 8 }, { from: 8, to: 2 }] },

  // Adjacent corner swaps
  { id: 'T',  name: 'T Perm',  group: 'Adjacent', probability: '1/18', moves: "R U R' U' R' F R2 U' R' U' R U R' F'", pll: [{ from: 2, to: 8 }, { from: 8, to: 2 }, { from: 3, to: 5 }, { from: 5, to: 3 }] },
  { id: 'F',  name: 'F Perm',  group: 'Adjacent', probability: '1/18', moves: "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", pll: [{ from: 0, to: 2 }, { from: 2, to: 0 }, { from: 1, to: 7 }, { from: 7, to: 1 }] },
  { id: 'Ja', name: 'Ja Perm', group: 'Adjacent', probability: '1/18', moves: "y2 x R2 F R F' R U2 r' U r U2 x'", alts: ["R' U L' U2 R U' R' U2 R L"], pll: [{ from: 0, to: 2 }, { from: 2, to: 0 }, { from: 1, to: 3 }, { from: 3, to: 1 }] },
  { id: 'Jb', name: 'Jb Perm', group: 'Adjacent', probability: '1/18', moves: "R U R' F' R U R' U' R' F R2 U' R'", alts: ["B2 R' U' R B2 L' U R' U' L"], pll: [{ from: 2, to: 8 }, { from: 8, to: 2 }, { from: 5, to: 7 }, { from: 7, to: 5 }] },
  { id: 'Ra', name: 'Ra Perm', group: 'Adjacent', probability: '1/18', moves: "y R U' R' U' R U R D R' U' R D' R' U2 R'", alts: ["L U2 L' U2 L F' L' U' L U L F L2"], pll: [{ from: 0, to: 2 }, { from: 2, to: 0 }, { from: 3, to: 1 }, { from: 1, to: 3 }] },
  { id: 'Rb', name: 'Rb Perm', group: 'Adjacent', probability: '1/18', moves: "R' U2 R U2 R' F R U R' U' R' F' R2", alts: ["R' U2 R U2 R' F R U R' U' R' F' R2"], pll: [{ from: 2, to: 8 }, { from: 8, to: 2 }, { from: 1, to: 7 }, { from: 7, to: 1 }] },

  // G Perms
  { id: 'Ga', name: 'Ga Perm', group: 'G Perms', probability: '1/18', moves: "R2 U R' U R' U' R U' R2 D U' R' U R D'", pll: [{ from: 0, to: 2 }, { from: 2, to: 6 }, { from: 6, to: 0 }, { from: 1, to: 5 }, { from: 5, to: 3 }, { from: 3, to: 1 }] },
  { id: 'Gb', name: 'Gb Perm', group: 'G Perms', probability: '1/18', moves: "D R' U' R U D' R2 U R' U R U' R U' R2", pll: [{ from: 2, to: 0 }, { from: 0, to: 6 }, { from: 6, to: 2 }, { from: 1, to: 3 }, { from: 3, to: 5 }, { from: 5, to: 1 }] },
  { id: 'Gc', name: 'Gc Perm', group: 'G Perms', probability: '1/18', moves: "R2 U' R U' R U R' U R2 D' U R U' R' D", pll: [{ from: 0, to: 2 }, { from: 2, to: 6 }, { from: 6, to: 0 }, { from: 3, to: 5 }, { from: 5, to: 7 }, { from: 7, to: 3 }] },
  { id: 'Gd', name: 'Gd Perm', group: 'G Perms', probability: '1/18', moves: "R U R' U' D R2 U' R U' R' U R' U R2 D'", pll: [{ from: 2, to: 0 }, { from: 0, to: 6 }, { from: 6, to: 2 }, { from: 5, to: 3 }, { from: 3, to: 7 }, { from: 7, to: 5 }] },

  // Diagonal corner swaps
  { id: 'V',  name: 'V Perm',  group: 'Diagonal', probability: '1/18', moves: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2", pll: [{ from: 0, to: 8 }, { from: 8, to: 0 }, { from: 5, to: 7 }, { from: 7, to: 5 }] },
  { id: 'Y',  name: 'Y Perm',  group: 'Diagonal', probability: '1/18', moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'", pll: [{ from: 0, to: 8 }, { from: 8, to: 0 }, { from: 1, to: 3 }, { from: 3, to: 1 }] },
  { id: 'Na', name: 'Na Perm', group: 'Diagonal', probability: '1/72', moves: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", alts: ["z U R' D R2 U' R D' U R' D R2 U' R D' z'"], pll: [{ from: 0, to: 8 }, { from: 8, to: 0 }, { from: 1, to: 7 }, { from: 7, to: 1 }] },
  { id: 'Nb', name: 'Nb Perm', group: 'Diagonal', probability: '1/72', moves: "R' U R U' R' F' U' F R U R' F R' F' R U' R", alts: ["z D' R U' R2 D R' U D' R U' R2 D R' U z'"], pll: [{ from: 2, to: 6 }, { from: 6, to: 2 }, { from: 1, to: 7 }, { from: 7, to: 1 }] },
];

export const PLL_SET: AlgSet = {
  id: 'PLL',
  name: 'PLL',
  kind: 'pll',
  description: 'Permutation of the Last Layer — all 21 cases. Arrows show how pieces move.',
  cases: pllCases,
};
