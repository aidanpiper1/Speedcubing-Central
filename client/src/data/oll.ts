import { ollPattern, type AlgCase, type AlgSet } from './algTypes';

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
  // Dot Cases
  c('OLL1',  'OLL 1',  'Dot Cases', "R U2 R2 F R F' U2 R' F R F'",              '1/108', '000010000', '010', '010', '010', '010'),
  c('OLL2',  'OLL 2',  'Dot Cases', "y' R U' R2 D' r U r' D R2 U R'",           '1/54',  '000010000', '101', '000', '101', '000'),
  c('OLL3',  'OLL 3',  'Dot Cases', "y' f R U R' U' f' U' F R U R' U' F'",      '1/54',  '000010001', '110', '010', '001', '000'),
  c('OLL4',  'OLL 4',  'Dot Cases', "y' R' F2 R2 U2 R' F' R U2 R2 F2 R",        '1/54',  '100010000', '011', '000', '100', '010'),
  c('OLL17', 'OLL 17', 'Dot Cases', "R U R' U R' F R F' U2 R' F R F'",          '1/54',  '001010100', '010', '001', '010', '100'),
  c('OLL18', 'OLL 18', 'Dot Cases', "y R U2 R2 F R F' U2 M' U R U' r'",         '1/54',  '000111000', '010', '010', '010', '010'),
  c('OLL19', 'OLL 19', 'Dot Cases', "y S' R U R' S U' R' F R F'",               '1/54',  '000111000', '010', '001', '010', '100'),
  c('OLL20', 'OLL 20', 'Dot Cases', "r U R' U' M2 U R U' R' U' M'",             '1/108', '000111000', '101', '101', '101', '101'),

  // Square Shapes
  c('OLL5',  'OLL 5',  'Square Shapes', "r' U2 R U R' U r",                     '1/54',  '000011011', '000', '000', '101', '110'),
  c('OLL6',  'OLL 6',  'Square Shapes', "r U2 R' U' R U' r'",                   '1/54',  '000110110', '000', '110', '101', '000'),

  // Lightning Shapes
  c('OLL7',  'OLL 7',  'Lightning Shapes', "r U R' U R U2 r'",                  '1/54',  '100110000', '010', '110', '000', '000'),
  c('OLL8',  'OLL 8',  'Lightning Shapes', "y2 r' U' R U' R' U2 r",             '1/54',  '001011000', '010', '000', '000', '011'),
  c('OLL11', 'OLL 11', 'Lightning Shapes', "r' R2 U R' U R U2 R' U M'",         '1/54',  '000110011', '010', '100', '001', '010'),
  c('OLL12', 'OLL 12', 'Lightning Shapes', "y' M' R' U' R U' R' U2 R U' M",     '1/54',  '000011110', '010', '010', '100', '001'),
  c('OLL39', 'OLL 39', 'Lightning Shapes', "y' f' r U r' U' r' F r S",           '1/54',  '010011000', '001', '000', '100', '011'),
  c('OLL40', 'OLL 40', 'Lightning Shapes', "y R' F R U R' U' F' U R",           '1/54',  '010110000', '100', '011', '000', '001'),

  // Fish Shapes
  c('OLL9',  'OLL 9',  'Fish Shapes', "y R U R' U' R' F R2 U R' U' F'",         '1/54',  '001010110', '100', '100', '001', '010'),
  c('OLL10', 'OLL 10', 'Fish Shapes', "R U R' U R' F R F' R U2 R'",             '1/54',  '100010011', '001', '010', '100', '001'),
  c('OLL35', 'OLL 35', 'Fish Shapes', "R U2 R2 F R F' R U2 R'",                 '1/54',  '000110011', '100', '010', '001', '000'),
  c('OLL37', 'OLL 37', 'Fish Shapes', "F R' F' R U R U' R'",                    '1/54',  '001011010', '100', '000', '001', '010'),

  // Knight Move Shapes
  c('OLL13', 'OLL 13', 'Knight Move Shapes', "F U R U2 R' U' R U R' F'",        '1/54',  '001110010', '100', '010', '001', '000'),
  c('OLL14', 'OLL 14', 'Knight Move Shapes', "R' F R U R' F' R F U' F'",        '1/54',  '100011010', '001', '000', '100', '010'),
  c('OLL15', 'OLL 15', 'Knight Move Shapes', "r' U' r R' U' R U r' U r",        '1/54',  '000011010', '001', '000', '101', '010'),
  c('OLL16', 'OLL 16', 'Knight Move Shapes', "r U r' R U R' U' r U' r'",        '1/54',  '000110010', '100', '010', '101', '000'),

  // OCLL (cross on top)
  c('OLL21', 'OLL 21', 'OCLL', "R U R' U R U' R' U R U2 R'",                   '1/108', '010111010', '101', '000', '101', '000'),
  c('OLL22', 'OLL 22', 'OCLL', "R U2 R2 U' R2 U' R2 U2 R",                     '1/54',  '010111010', '101', '000', '000', '101'),
  c('OLL23', 'OLL 23', 'OCLL', "R2 D R' U2 R D' R' U2 R'",                     '1/54',  '010111110', '000', '000', '000', '101'),
  c('OLL24', 'OLL 24', 'OCLL', "r U R' U' r' F R F'",                           '1/54',  '010111011', '000', '100', '001', '000'),
  c('OLL25', 'OLL 25', 'OCLL', "R U2 R D R' U2 R D' R2",                        '1/54',  '010111010', '001', '100', '000', '100'),
  c('OLL26', 'OLL 26', 'OCLL', "y R U2 R' U' R U' R'",                          '1/54',  '010111000', '001', '000', '100', '100'),
  c('OLL27', 'OLL 27', 'OCLL', "R U R' U R U2 R'",                              '1/54',  '010111000', '100', '100', '000', '001'),

  // All Corners Oriented
  c('OLL28', 'OLL 28', 'All Corners Oriented', "r U R' U' M U R U' R'",         '1/54',  '010110010', '100', '010', '001', '000'),
  c('OLL57', 'OLL 57', 'All Corners Oriented', "R U R' U' M' U R U' r'",        '1/54',  '010010010', '000', '101', '000', '101'),

  // Awkward Shapes
  c('OLL29', 'OLL 29', 'Awkward Shapes', "r2 D' r U r' D r2 U' r' U' r",        '1/54',  '001110010', '100', '010', '001', '010'),
  c('OLL30', 'OLL 30', 'Awkward Shapes', "y' r' D' r U' r' D r2 U' r' U r U r'", '1/54',  '100011010', '010', '010', '100', '001'),
  c('OLL41', 'OLL 41', 'Awkward Shapes', "y2 R U R' U R U2 R' F R U R' U' F'",  '1/54',  '000010110', '110', '010', '001', '000'),
  c('OLL42', 'OLL 42', 'Awkward Shapes', "R' U' R U' R' U2 R F R U R' U' F'",   '1/54',  '000010011', '011', '000', '100', '010'),

  // P Shapes
  c('OLL31', 'OLL 31', 'P Shapes', "R' U' F U R U' R' F' R",                    '1/54',  '000110011', '010', '010', '100', '010'),
  c('OLL32', 'OLL 32', 'P Shapes', "S R U R' U' R' F R f'",                     '1/54',  '000011110', '010', '010', '001', '010'),
  c('OLL43', 'OLL 43', 'P Shapes', "y R' U' F' U F R",                          '1/54',  '000010011', '110', '000', '001', '010'),
  c('OLL44', 'OLL 44', 'P Shapes', "f R U R' U' f'",                            '1/54',  '000010110', '011', '010', '100', '000'),

  // T Shapes
  c('OLL33', 'OLL 33', 'T Shapes', "R U R' U' R' F R F'",                       '1/54',  '010110010', '000', '010', '001', '000'),
  c('OLL45', 'OLL 45', 'T Shapes', "F R U R' U' F'",                            '1/54',  '000010010', '010', '010', '100', '001'),

  // C Shapes
  c('OLL34', 'OLL 34', 'C Shapes', "y f R f' U' r' U' R U M'",                  '1/54',  '010110010', '101', '000', '000', '010'),
  c('OLL46', 'OLL 46', 'C Shapes', "R' U' R' F R F' U R",                       '1/54',  '000010010', '101', '000', '010', '000'),

  // W Shapes
  c('OLL36', 'OLL 36', 'W Shapes', "y R U R2 F' U' F U R2 U2 R'",              '1/54',  '010011010', '001', '000', '100', '011'),
  c('OLL38', 'OLL 38', 'W Shapes', "R U R' U R U' R' U' R' F R F'",            '1/54',  '010110010', '100', '011', '000', '000'),

  // L Shapes
  c('OLL47', 'OLL 47', 'L Shapes', "y' F R' F' R U2 R U' R' U R U2 R'",        '1/54',  '001011000', '011', '000', '000', '011'),
  c('OLL48', 'OLL 48', 'L Shapes', "F R U R' U' R U R' U' F'",                 '1/54',  '100110000', '110', '110', '000', '000'),
  c('OLL49', 'OLL 49', 'L Shapes', "y2 r U' r2 U r2 U r2 U' r",                '1/54',  '000110110', '000', '110', '000', '011'),
  c('OLL50', 'OLL 50', 'L Shapes', "r' U r2 U' r2 U' r2 U r'",                 '1/54',  '000011011', '000', '011', '000', '110'),
  c('OLL53', 'OLL 53', 'L Shapes', "r' U' R U' R' U R U' R' U2 r",             '1/54',  '000011010', '000', '000', '101', '011'),
  c('OLL54', 'OLL 54', 'L Shapes', "r U R' U R U' R' U R U2 r'",               '1/54',  '000110010', '000', '110', '101', '000'),

  // Line Shapes
  c('OLL51', 'OLL 51', 'Line Shapes', "y2 F U R U' R' U R U' R' F'",           '1/54',  '000010000', '011', '010', '110', '000'),
  c('OLL52', 'OLL 52', 'Line Shapes', "y2 R' F' U' F U' R U R' U R",           '1/54',  '010010000', '100', '000', '100', '001'),
  c('OLL55', 'OLL 55', 'Line Shapes', "y R' F U R U' R2 F' R2 U R' U' R",      '1/54',  '010010010', '000', '000', '101', '000'),
  c('OLL56', 'OLL 56', 'Line Shapes', "r U r' U R U' R' U R U' R' r U' r'",   '1/54',  '000010000', '101', '010', '101', '010'),
];

export const OLL_SET: AlgSet = {
  id: 'OLL',
  name: 'OLL',
  kind: 'oll',
  description: 'Orientation of the Last Layer — all 57 cases, grouped by shape.',
  cases: ollCases,
};
