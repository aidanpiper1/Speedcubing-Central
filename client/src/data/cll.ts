import type { AlgSet } from './algTypes';

export const CLL_SET: AlgSet = {
  id: 'CLL',
  name: 'CLL',
  kind: 'cll',
  description: 'Corners of the Last Layer (2×2)',
  cases: [
    // Anti-Sune
    { id: 'CLL-AS-1', name: 'CLL AS 1', group: 'Anti-Sune', moves: "y R U2 R' U' R U' R'", alts: ["y2 L' U' L U' L' U2 L", "R' U' R U' R' U2 R", "U2 L' U' L U' L' U2 L"] },
    { id: 'CLL-AS-2', name: 'CLL AS 2', group: 'Anti-Sune', moves: "R U2 R' F R' F' R U' R U' R'", alts: ["y2 R' U R U' R2 F R F' R U R' U' R", "L' U' L U' L F' L' F L' U2 L", "y' R' U' R U' R' U R' F R F' U R"] },
    { id: 'CLL-AS-3', name: 'CLL AS 3', group: 'Anti-Sune', moves: "y2 F' L F L' U2 L' U2 L", alts: ["R' U L U' R U L'", "y2 F' R U R' U2 R' F2 R", "y R' F R F' R U2 R' U' R' F R F'"] },
    { id: 'CLL-AS-4', name: 'CLL AS 4', group: 'Anti-Sune', moves: "y2 R' F R F' R U R'", alts: ["U2 L' U R U' L U R'", "y2 L' U L F' R U R'", "x' R' F R U' R U R'"] },
    { id: 'CLL-AS-5', name: 'CLL AS 5', group: 'Anti-Sune', moves: "y2 R U2 R' U2 R' F R F'", alts: ["L U2 L' U2 x' L' U L U'", "x' R U2 R' F2 R' F R U'", "y' z F R2 F' R' U' R' U z' y' R U' R'"] },
    { id: 'CLL-AS-6', name: 'CLL AS 6', group: 'Anti-Sune', moves: "y' R U2 R' U' R U' R' F R' F' R U R U' R' U'", alts: ["R2 F R U2 R U' R' U2 F' R", "y R U R2 F' R F R U' R2 F R", "R2 F' U' R2 F' R2 U F R2"] },
    // H
    { id: 'CLL-H-1', name: 'CLL H 1', group: 'H', moves: "F R2 U' R2 U' R2 U R2 F'", alts: ["F R U' R' U R U2 R' U' R U R' U' F'", "y' R' U2 R y R' U R' U' R U' R", "y2 F R U R' U' R F' R U R' U' R'"] },
    { id: 'CLL-H-2', name: 'CLL H 2', group: 'H', moves: "R U R' U R U R' F R' F' R", alts: ["y2 R' F' R U' R' F' R F' R U R'", "R U R' U R U L' U R' U' L", "y R U' R' F U2 R2 F R U' R"] },
    { id: 'CLL-H-3', name: 'CLL H 3', group: 'H', moves: "y F R U R' U' R U R' U' R U R' U' F'", alts: ["y x' U2 R U2 R2 F2 R U2 x", "R U' R' F R' F' R2 U' R' F R' F' R", "R2 F' U2 F2 R2 F' R2"] },
    { id: 'CLL-H-4', name: 'CLL H 4', group: 'H', moves: "y R2 U2 R' U2 R2", alts: ["y R2 U2 R U2 R2", "R U R' U R U' R' U R U2 R'", "y' R U2 R' U' R U R' U' R U' R'"] },
    // L
    { id: 'CLL-L-1', name: 'CLL L 1', group: 'L', moves: "y R U2 R' F' R U2 R' U R' F2 R", alts: ["y R' U' R U2 R' F R' F' R U' R", "R' F' R U R' U' R' F R2 U' R' U2 R", "U' R U R' U R' F R F' U2 R' F R F'"] },
    { id: 'CLL-L-2', name: 'CLL L 2', group: 'L', moves: "y2 R U2 R2 F2 R U R' F2 R F'", alts: ["R U' R' U R U' R' F R' F' R2 U R'", "R' U2 R' U' F R2 F' U R2", "y2 R' F2 R2 U2 R' U R' F2 R F'"] },
    { id: 'CLL-L-3', name: 'CLL L 3', group: 'L', moves: "y2 R' U R' U2 R U' R' U R U' R2", alts: ["y2 R2 U' R U2 R' U2 R U' R2", "y' R U R' U R U' R' U R U' R' U R U2 R'", "y R U' R U' R U2 R' U R' U R'"] },
    { id: 'CLL-L-4', name: 'CLL L 4', group: 'L', moves: "y R U2 R2 F R F' R U2 R'", alts: ["R U2 R' F R' F' R2 U2 R'", "y2 R U R' L' U2 R U R' U2 L", "y' R' U' R U R' F' R U R' U' R' F R2"] },
    { id: 'CLL-L-5', name: 'CLL L 5', group: 'L', moves: "y F R' F' R U R U' R'", alts: ["y F R' F' U' R' U R", "y F' U R U' R' F2 R U' R'", "y' R' F' L' F R F' L F"] },
    { id: 'CLL-L-6', name: 'CLL L 6', group: 'L', moves: "y2 F' R U R' U' R' F R", alts: ["y F R U' R' U' R U R' F'", "R U R U' R' F R' F'", "y R' F R U F U' F'"] },
    // Pi
    { id: 'CLL-Pi-1', name: 'CLL Pi 1', group: 'Pi', moves: "y F R' F' R U2 R U' R' U R U2 R'", alts: ["R' F2 R F' U2 R U' R' U' F", "U F U R U' R' U R U' R2 F' R U R U' R'", "y2 L' U2 L U L' U' L U2 L F' L' F"] },
    { id: 'CLL-Pi-2', name: 'CLL Pi 2', group: 'Pi', moves: "R U2 R' U' R U R' U2 R' F R F'", alts: ["y F' R U R' U2 R' F R U' R' F2 R", "R U R' U' R' F R2 U R' U' R U R' U' F'", "R2 U' R' U' F R2 U2 F' R2 F"] },
    { id: 'CLL-Pi-3', name: 'CLL Pi 3', group: 'Pi', moves: "y F R2 U' R2 U R2 U R2 F'", alts: ["y' R U' R U' R' U R' F R2 F'", "y2 F R' F' R U2 F R' F' R2 U2 R'", "U' R' F R U F U' R U R' U' F'"] },
    { id: 'CLL-Pi-4', name: 'CLL Pi 4', group: 'Pi', moves: "y2 R' F R F' R U' R' U' R U' R'", alts: ["R U' R' F R' F R U R' F R", "R U' R' F L' U L U L' U L", "y' R U' R2 D' R U R' D R2 U R'"] },
    { id: 'CLL-Pi-5', name: 'CLL Pi 5', group: 'Pi', moves: "y' R' U' R' F R F' R U' R' U2 R", alts: ["R2 U R' U' F R F' R U' R2", "U' R' U' R' F R F' R U' R' U2 R", "y' R U R' U R' F R F' R U' R' U R U2 R'"] },
    { id: 'CLL-Pi-6', name: 'CLL Pi 6', group: 'Pi', moves: "F R U R' U' R U R' U' F'", alts: ["R U' R2 U R2 U R2 U' R", "R' U R2 U' R2 U' R2 U R'", "R U2 R2 U' R2 U' R2 U2 R"] },
    // Sune
    { id: 'CLL-Sune-1', name: 'CLL Sune 1', group: 'Sune', moves: "L' U2 L U2 L F' L' F", alts: ["y2 R' U2 R U2 R B' R' B", "R' F2 R U2 R U' R' F", "R' F2 R U2 L F' L' F"] },
    { id: 'CLL-Sune-2', name: 'CLL Sune 2', group: 'Sune', moves: "R U R' U' R' F R F' R U R' U R U2 R'", alts: ["R U2 R' F R U2 R' U R U' R' F", "y2 R U' R U' R' U R' U' y R U' R'", "R2 F' U' R2 F R2 U F R2"] },
    { id: 'CLL-Sune-3', name: 'CLL Sune 3', group: 'Sune', moves: "R U' R' F R' F' R", alts: ["R U' R' F L' U' L", "L F' L' F L' U' L", "R U' L' U R' U' L"] },
    { id: 'CLL-Sune-4', name: 'CLL Sune 4', group: 'Sune', moves: "F R' F' R U2 R U2 R'", alts: ["y2 x' U R' F' R F2 R U2 R'", "y R U' R' F R' F2 R U R U' R' F", "y' x' R U' R' U R' F2 R F R U' R' U x"] },
    { id: 'CLL-Sune-5', name: 'CLL Sune 5', group: 'Sune', moves: "y2 R U R' U R' F R F' R U2 R'", alts: ["U2 R U R' U R' F R F' R U2 R'", "R U R' U' R' F R F' R U' R' F R' F' R", "y' R' F R2 F' U' R' U' R2 U R'"] },
    { id: 'CLL-Sune-6', name: 'CLL Sune 6', group: 'Sune', moves: "R U R' U R U2 R'", alts: ["R U R2 U' R2 U R", "y' R' U2 R U R' U R", "y L' U2 L U L' U L"] },
    // T
    { id: 'CLL-T-1', name: 'CLL T 1', group: 'T', moves: "y' R U R' U' R' F R F'", alts: ["y2 R' U' R U F R F'", "U' x L U R' U' L' U R U' x'", "y R B R' U' R' U R F' z"] },
    { id: 'CLL-T-2', name: 'CLL T 2', group: 'T', moves: "y L' U' L U L F' L' F", alts: ["y R' F' R U R U' R' F", "R U R' U' y L' U' L", "y' F R U' R' U R U R' F'"] },
    { id: 'CLL-T-3', name: 'CLL T 3', group: 'T', moves: "F U' R U2 R' U' F2 R U R'", alts: ["y R U2 R2 F R F' R U' R' U R U2 R'", "y2 R U F R' F' R U2 R U2 R2", "y' R U' B U2 B' U' R2 F R F'"] },
    { id: 'CLL-T-4', name: 'CLL T 4', group: 'T', moves: "R' U R U2 R2 F' R U' R' F2 R2", alts: ["y R' U R' F U' R U F2 R2", "y2 R' U R' U2 R U2 R' U R2 U' R'", "u' R U R' U R U2 R' L' U' L U' L' U2 L U"] },
    { id: 'CLL-T-5', name: 'CLL T 5', group: 'T', moves: "y2 F R U R' U' R U' R' U' R U R' F'", alts: ["y' R U R' U' R U' R' F' U' F R U R'", "y R U R' U2 R U R' U R' F R F'", "y R2 F' R U' R' F2 R F R' F' R2"] },
    { id: 'CLL-T-6', name: 'CLL T 6', group: 'T', moves: "R' U R U2 R2 F R F' R", alts: ["U2 y z R U R' U' R' F R2 U' R' U' R U R' F'", "y2 R U' R' U2 L2 F' L' U L'", "y2 R' F R U2 R2 F R U' R"] },
    // U
    { id: 'CLL-U-1', name: 'CLL U 1', group: 'U', moves: "y' F R U R' U' F'", alts: ["y F U R U' R' F'", "R' F' U' F U R", "y' R' U' F R' F' R U R"] },
    { id: 'CLL-U-2', name: 'CLL U 2', group: 'U', moves: "R' U' R2 U R' U2 R U2 R' U R'", alts: ["y' R2 F2 R U R' F R2 U2 R' U' R", "R' F U' R U' R' U2 F2 R", "y2 R2 F2 R U R' F U' R U R2"] },
    { id: 'CLL-U-3', name: 'CLL U 3', group: 'U', moves: "y2 F R U R' U2 F' R U' R' F", alts: ["R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", "y' R U2 R U' R' F R' F2 U' F", "y' z' U2 R' U' R2 U' R' U' R U' R' U' x2"] },
    { id: 'CLL-U-4', name: 'CLL U 4', group: 'U', moves: "y' F R' F' R U' R U' R' U2 R U' R'", alts: ["F R U' R' U R U R' U R U' R' F'", "R2 F R F' R' F2 R U R' F R2", "F' L' U' L U' L' U' L U L' U L F U'"] },
    { id: 'CLL-U-5', name: 'CLL U 5', group: 'U', moves: "R U' R2 F R F' R U R' U' R U R'", alts: ["y2 R U2 R' U R' F2 R F' R' F2 R", "R2 D' R U2 R' D R U2 R", "y2 R2 U R2 F' R U R U' R' F R U' R2"] },
    { id: 'CLL-U-6', name: 'CLL U 6', group: 'U', moves: "R' U R' F R F' R U2 R' U R", alts: ["L' U L2 F' L' F L' U' L U L' U' L", "R' F R2 U' R' F R' F' R U R' F' R", "y' R' U' R2 U' R' U2 R B' R2 F z'"] },
  ],
};
