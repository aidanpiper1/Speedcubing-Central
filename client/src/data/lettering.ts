// Speffz lettering scheme. 24 corner stickers + 24 edge stickers, A–X each.
export const SPEFFZ_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');

// Sticker -> face position labels for reference display (Speffz standard).
export const SPEFFZ_CORNERS: Record<string, string> = {
  A: 'U back-left',
  B: 'U back-right',
  C: 'U front-right',
  D: 'U front-left',
  E: 'L top-back',
  F: 'L top-front',
  G: 'L bottom-front',
  H: 'L bottom-back',
  I: 'F top-left',
  J: 'F top-right',
  K: 'F bottom-right',
  L: 'F bottom-left',
  M: 'R top-front',
  N: 'R top-back',
  O: 'R bottom-back',
  P: 'R bottom-front',
  Q: 'B top-right',
  R: 'B top-left',
  S: 'B bottom-left',
  T: 'B bottom-right',
  U: 'D front-left',
  V: 'D front-right',
  W: 'D back-right',
  X: 'D back-left',
};

export const SPEFFZ_EDGES: Record<string, string> = { ...SPEFFZ_CORNERS };

export const DEFAULT_LETTER_PAIRS: Record<string, string> = {
  AB: 'Abba',
  AC: 'AC unit',
  BD: 'Bird',
  CT: 'Cat',
  DG: 'Dog',
  HT: 'Hat',
  RN: 'Run',
  SN: 'Sun',
};
