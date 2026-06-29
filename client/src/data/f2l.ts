import type { AlgCase, AlgSet } from './algTypes';

const f = (id: string, name: string, group: string, moves: string): AlgCase => ({
  id,
  name,
  group,
  moves,
  probability: '1/41',
});

const f2lCases: AlgCase[] = [
  // Free Pairs — corner and edge already paired in U layer
  f('F2L1',  'F2L 1',  'Free Pairs', "U R U' R'"),
  f('F2L2',  'F2L 2',  'Free Pairs', "F R' F' R"),
  f('F2L3',  'F2L 3',  'Free Pairs', "F' U' F"),
  f('F2L4',  'F2L 4',  'Free Pairs', "R U R'"),

  // Disconnected Pairs — corner and edge in U layer, not paired
  f('F2L5',  'F2L 5',  'Disconnected Pairs', "U' R U R' U2 R U' R'"),
  f('F2L6',  'F2L 6',  'Disconnected Pairs', "U' r U' R' U R U r'"),
  f('F2L7',  'F2L 7',  'Disconnected Pairs', "U' R U2 R' U' R U2 R'"),
  f('F2L8',  'F2L 8',  'Disconnected Pairs', "d R' U2 R U R' U2 R"),
  f('F2L9',  'F2L 9',  'Disconnected Pairs', "U' R U' R' U F' U' F"),
  f('F2L10', 'F2L 10', 'Disconnected Pairs', "U' R U R' U R U R'"),
  f('F2L19', 'F2L 19', 'Disconnected Pairs', "U R U2 R' U R U' R'"),
  f('F2L20', 'F2L 20', 'Disconnected Pairs', "y' U' R' U2 R U' R' U R"),
  f('F2L21', 'F2L 21', 'Disconnected Pairs', "U2 R U R' U R U' R'"),
  f('F2L22', 'F2L 22', 'Disconnected Pairs', "r U' r' U2 r U r'"),

  // Connected Pairs — corner and edge in U layer, connected but awkward angle
  f('F2L11', 'F2L 11', 'Connected Pairs', "U' R U2 R' U F' U' F"),
  f('F2L12', 'F2L 12', 'Connected Pairs', "R U' R' U R U' R' U2 R U' R'"),
  f('F2L13', 'F2L 13', 'Connected Pairs', "y' U R' U R U' R' U' R"),
  f('F2L14', 'F2L 14', 'Connected Pairs', "U' R U' R' U R U R'"),
  f('F2L15', 'F2L 15', 'Connected Pairs', "R' D' R U' R' D R U R U' R'"),
  f('F2L16', 'F2L 16', 'Connected Pairs', "R U' R' U2 F' U' F"),
  f('F2L17', 'F2L 17', 'Connected Pairs', "R U2 R' U' R U R'"),
  f('F2L18', 'F2L 18', 'Connected Pairs', "y' R' U2 R U R' U' R"),
  f('F2L23', 'F2L 23', 'Connected Pairs', "U R U' R' U' R U' R' U R U' R'"),
  f('F2L24', 'F2L 24', 'Connected Pairs', "F U R U' R' F' R U' R'"),

  // Corner In Slot — corner in slot (wrong orientation), edge in U layer
  f('F2L25', 'F2L 25', 'Corner In Slot', "U' R' F R F' R U R'"),
  f('F2L26', 'F2L 26', 'Corner In Slot', "U R U' R' F R' F' R"),
  f('F2L27', 'F2L 27', 'Corner In Slot', "R U' R' U R U' R'"),
  f('F2L28', 'F2L 28', 'Corner In Slot', "R U R' U' F R' F' R"),
  f('F2L29', 'F2L 29', 'Corner In Slot', "R' F R F' U R U' R'"),
  f('F2L30', 'F2L 30', 'Corner In Slot', "R U R' U' R U R'"),

  // Edge In Slot — edge in slot (wrong orientation), corner in U layer
  f('F2L31', 'F2L 31', 'Edge In Slot', "U' R' F R F' R U' R'"),
  f('F2L32', 'F2L 32', 'Edge In Slot', "U R U' R' U R U' R' U R U' R'"),
  f('F2L33', 'F2L 33', 'Edge In Slot', "U' R U' R' U2 R U' R'"),
  f('F2L34', 'F2L 34', 'Edge In Slot', "U R U R' U2 R U R'"),
  f('F2L35', 'F2L 35', 'Edge In Slot', "U' R U R' U F' U' F"),
  f('F2L36', 'F2L 36', 'Edge In Slot', "U F' U' F U' R U R'"),

  // Pieces In Slot — both pieces in the slot, misplaced or misoriented
  f('F2L37', 'F2L 37', 'Pieces In Slot', "R2 U2 F R2 F' U2 R' U R'"),
  f('F2L38', 'F2L 38', 'Pieces In Slot', "R U' R' U' R U R' U2 R U' R'"),
  f('F2L39', 'F2L 39', 'Pieces In Slot', "R U' R' U R U2 R' U R U' R'"),
  f('F2L40', 'F2L 40', 'Pieces In Slot', "r U' r' U2 r U r' R U R'"),
  f('F2L41', 'F2L 41', 'Pieces In Slot', "R U' R' r U' r' U2 r U r'"),
];

export const F2L_SET: AlgSet = {
  id: 'F2L',
  name: 'F2L',
  kind: 'f2l',
  description: 'First Two Layers — all 41 standard pair-insertion cases.',
  cases: f2lCases,
};
