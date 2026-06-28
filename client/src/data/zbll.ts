import { ollPattern, type AlgCase, type AlgSet } from './algTypes';

const fullCross = '010111010';
const z = (id: string, name: string, group: string, moves: string): AlgCase => ({
  id,
  name,
  group,
  moves,
  probability: '1/493',
  oll: ollPattern(fullCross, '101', '101', '101', '101'),
});

// A practical subset of the most common ZBLL cases (1-look LL with edges oriented).
const zbllCases: AlgCase[] = [
  z('ZBLL-T1', 'T · Adjacent swap 1', 'T', "R U R' U' R' F R2 U' R' U' R U R' F'"),
  z('ZBLL-T2', 'T · Diagonal swap', 'T', "F R U' R' U' R U R' F' R U R' U' R' F R F'"),
  z('ZBLL-U1', 'U · H perm', 'U', "R U R' U R U2 R2 U' R U' R' U2 R"),
  z('ZBLL-U2', 'U · Ua', 'U', "M2 U M U2 M' U M2"),
  z('ZBLL-L1', 'L · Jb', 'L', "R U R' F' R U R' U' R' F R2 U' R'"),
  z('ZBLL-L2', 'L · diag', 'L', "R' U' R U' R' U2 R2 U R' U R U2 R'"),
  z('ZBLL-Pi1', 'Pi · Y perm', 'Pi', "F R U' R' U' R U R' F' R U R' U' R' F R F'"),
  z('ZBLL-Pi2', 'Pi · V perm', 'Pi', "R' U R' U' y R' F' R2 U' R' U R' F R F"),
  z('ZBLL-S1', 'Sune · cycle', 'Sune', "R U R' U R U2 R2 U' R U' R' U2 R"),
  z('ZBLL-AS1', 'Antisune · cycle', 'Antisune', "R U2 R' U' R U' R2 U2 R U R' U R"),
  z('ZBLL-H1', 'H · Z perm', 'H', "M' U' M2 U' M2 U' M' U2 M2"),
  z('ZBLL-H2', 'H · double', 'H', "R U R' U R U' R' U R U2 R2 U' R U' R' U2 R"),
];

export const ZBLL_SET: AlgSet = {
  id: 'ZBLL',
  name: 'ZBLL (subset)',
  kind: 'zbll',
  description: 'A curated subset of the most common ZBLL cases — full last layer in one algorithm.',
  cases: zbllCases,
};
