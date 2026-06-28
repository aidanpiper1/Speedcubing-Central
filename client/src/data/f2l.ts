import type { AlgCase, AlgSet } from './algTypes';

const f = (id: string, name: string, group: string, moves: string): AlgCase => ({
  id,
  name,
  group,
  moves,
  probability: '1/41',
});

// Standard 41 F2L cases (corner+edge insertions), grouped by situation.
const f2lCases: AlgCase[] = [
  // Basic inserts — corner and edge in top
  f('F2L1', 'F2L 1 — Basic (right)', 'Basic Cases', "U R U' R'"),
  f('F2L2', 'F2L 2 — Basic (left)', 'Basic Cases', "U' L' U L"),
  f('F2L3', 'F2L 3 — Basic (back-right)', 'Basic Cases', "U' R U R'"),
  f('F2L4', 'F2L 4 — Basic (back-left)', 'Basic Cases', "U L' U' L"),
  // Corner pointing up
  f('F2L5', 'F2L 5 — Corner up', 'Corner Pointing Up', "U' R U2 R' U2 R U' R'"),
  f('F2L6', 'F2L 6 — Corner up', 'Corner Pointing Up', "U L' U2 L U2 L' U L"),
  f('F2L7', 'F2L 7 — Corner up', 'Corner Pointing Up', "U' R U' R' U R U R'"),
  f('F2L8', 'F2L 8 — Corner up', 'Corner Pointing Up', "U L' U L U' L' U' L"),
  f('F2L9', 'F2L 9 — Corner up', 'Corner Pointing Up', "U' R U R' U R U R'"),
  f('F2L10', 'F2L 10 — Corner up', 'Corner Pointing Up', "U L' U' L U' L' U' L"),
  f('F2L11', 'F2L 11 — Corner up', 'Corner Pointing Up', "R U' R' U R U' R' U2 R U' R'"),
  f('F2L12', 'F2L 12 — Corner up', 'Corner Pointing Up', "U2 R U R' U R U' R'"),
  f('F2L13', 'F2L 13 — Corner up', 'Corner Pointing Up', "U2 R U' R' U' R U R'"),
  // White facing up (corner solved orientation up)
  f('F2L14', 'F2L 14 — White up', 'White on Top', "U R U2 R' U R U' R'"),
  f('F2L15', 'F2L 15 — White up', 'White on Top', "U' L' U2 L U' L' U L"),
  f('F2L16', 'F2L 16 — White up', 'White on Top', "U' R U2 R' U' R U R'"),
  f('F2L17', 'F2L 17 — White up', 'White on Top', "U L' U2 L U L' U' L"),
  // Corner in slot, edge in top
  f('F2L18', 'F2L 18 — Corner in slot', 'Corner in Slot', "U' R U' R' U R U' R'"),
  f('F2L19', 'F2L 19 — Corner in slot', 'Corner in Slot', "U L' U L U' L' U L"),
  f('F2L20', 'F2L 20 — Corner in slot', 'Corner in Slot', "R U R' U' R U R' U' R U R'"),
  f('F2L21', 'F2L 21 — Corner in slot', 'Corner in Slot', "R U' R' U R U' R'"),
  f('F2L22', 'F2L 22 — Corner in slot', 'Corner in Slot', "R U R' U' R U R'"),
  f('F2L23', 'F2L 23 — Corner in slot', 'Corner in Slot', "U R U' R' U' R U R' U R U' R'"),
  f('F2L24', 'F2L 24 — Corner in slot', 'Corner in Slot', "U' R U R' U R U R' U' R U R'"),
  // Edge in slot, corner in top
  f('F2L25', 'F2L 25 — Edge in slot', 'Edge in Slot', "U' R U' R' U y' R' U' R"),
  f('F2L26', 'F2L 26 — Edge in slot', 'Edge in Slot', "U R U' R' U' F' U' F"),
  f('F2L27', 'F2L 27 — Edge in slot', 'Edge in Slot', "R U' R' U R U' R'"),
  f('F2L28', 'F2L 28 — Edge in slot', 'Edge in Slot', "R U R' U' R U R'"),
  f('F2L29', 'F2L 29 — Edge in slot', 'Edge in Slot', "R U' R' U' R U R' U R U' R'"),
  f('F2L30', 'F2L 30 — Edge in slot', 'Edge in Slot', "R U R' U R U' R' U' R U R'"),
  // Both pieces in slot (need extraction)
  f('F2L31', 'F2L 31 — Both in slot', 'Pieces in Slot', "R U' R' U R U2 R' U R U' R'"),
  f('F2L32', 'F2L 32 — Both in slot', 'Pieces in Slot', "R U R' U' R U' R' U2 R U' R'"),
  f('F2L33', 'F2L 33 — Both in slot', 'Pieces in Slot', "R U' R' U' R U R' U R U' R'"),
  f('F2L34', 'F2L 34 — Both in slot', 'Pieces in Slot', "R U R' U' R U R' U' R U R'"),
  f('F2L35', 'F2L 35 — Both in slot', 'Pieces in Slot', "R U' R' U R U' R' U2 y' R' U' R"),
  f('F2L36', 'F2L 36 — Both in slot', 'Pieces in Slot', "R U' R' U2 y' R' U' R"),
  f('F2L37', 'F2L 37 — Both in slot', 'Pieces in Slot', "R U2 R' U' R U R'"),
  f('F2L38', 'F2L 38 — Both in slot', 'Pieces in Slot', "R U' R' U2 R U' R'"),
  f('F2L39', 'F2L 39 — Both in slot', 'Pieces in Slot', "y' R' U R U2' R' U R"),
  f('F2L40', 'F2L 40 — Both in slot', 'Pieces in Slot', "R U R' U2 R U R'"),
  f('F2L41', 'F2L 41 — Solved pair misaligned', 'Pieces in Slot', "R U' R' U' R U R' U2 R U' R'"),
];

export const F2L_SET: AlgSet = {
  id: 'F2L',
  name: 'F2L',
  kind: 'f2l',
  description: 'First Two Layers — all 41 standard pair-insertion cases.',
  cases: f2lCases,
};
