import type { AlgSet } from './algTypes';

export const ORTEGA_PBL_SET: AlgSet = {
  id: 'OrtegaPBL',
  name: 'Ortega PBL',
  kind: '2x2-pbl',
  description: 'Permute Both Layers (2×2 Ortega)',
  cases: [
    {
      id: '2x2-pbl-adj',
      name: 'Adj',
      group: '',
      moves: "y R U R' F' R U R' U' R' F R2 U' R'",
      probability: '—',
      alts: ["y R' F R F' R U2 R' U R U2 R'", "y R U R' U' R' F R2 U' R' U' R U R' F'", "y2 R' F R' F2 R U' R' F2 R2"],
    },
    {
      id: '2x2-pbl-opp',
      name: 'Opp',
      group: '',
      moves: "R U' R' U' F2 U' R U R' U F2",
      probability: '—',
      alts: ["F R U' R' U' R U R' F' R U R' U' R' F R F'", "R U' R' U' F2 U' R U R' D R2", "z2 R U' R' U' F2 U' R U R' U R2 B2"],
    },
    {
      id: '2x2-pbl-opp-opp',
      name: 'Opp Opp',
      group: '',
      moves: "R2 F2 R2",
      probability: '—',
      alts: ["R2 B2 R2", "x R2 U2 R2", "x' R2 U2 R2"],
    },
    {
      id: '2x2-pbl-adj-adj',
      name: 'Adj Adj',
      group: '',
      moves: "R2 U' B2 U2 R2 U' R2",
      probability: '—',
      alts: ["y2 R2 U' R2 U2 F2 U' R2", "R2 U R2 U2 F2 U F2", "R2 U' F2 U2 R2 U' B2"],
    },
    {
      id: '2x2-pbl-adj-opp',
      name: 'Adj Opp',
      group: '',
      moves: "R U' R F2 R' U R'",
      probability: '—',
      alts: ["R' F R' F2 R U' R", "y2 R' U R' F2 R F' R", "y2 R' U L' U2 R U' L"],
    },
    {
      id: '2x2-pbl-opp-adj',
      name: 'Opp Adj',
      group: '',
      moves: "y R2 U R2 U' R2 U R2 U' R2",
      probability: '—',
      alts: ["R' D R' F2 R D' R", "z2 R U' R F2 R' U R'", "y R2 U' R2 U R2 U' R2 U R2"],
    },
  ],
};
