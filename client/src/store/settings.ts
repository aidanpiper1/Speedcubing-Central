import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type InspectionDirection = 'down' | 'up';
export type EntryMode = 'keyboard' | 'typing';
export type TimerUpdate = 'centiseconds' | 'deciseconds' | 'seconds' | 'hidden';

interface SettingsState {
  theme: Theme;
  defaultEvent: string;
  currentEvent: string;
  letteringScheme: 'speffz' | 'custom';

  // Timer settings
  inspection: boolean;
  inspectionDirection: InspectionDirection;
  inspectionVoice: boolean;
  entryMode: EntryMode;
  timerUpdate: TimerUpdate; // precision shown while running
  solvePrecision: 2 | 3; // decimals shown in the solves list & stats
  holdToStart: boolean;
  holdDuration: number; // ms the spacebar must be held before the timer is armed
  startSound: boolean;

  // Stats table column toggles
  showBPA: boolean;
  showWPA: boolean;
  showTarget: boolean;

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setDefaultEvent: (e: string) => void;
  setCurrentEvent: (e: string) => void;
  setLetteringScheme: (s: 'speffz' | 'custom') => void;
  set: (patch: Partial<SettingsState>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      defaultEvent: '333',
      currentEvent: '333',
      letteringScheme: 'speffz',

      inspection: false,
      inspectionDirection: 'down',
      inspectionVoice: false,
      entryMode: 'keyboard',
      timerUpdate: 'centiseconds',
      solvePrecision: 2,
      holdToStart: true,
      holdDuration: 550,
      startSound: false,

      showBPA: true,
      showWPA: true,
      showTarget: true,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setDefaultEvent: (defaultEvent) => set({ defaultEvent }),
      setCurrentEvent: (currentEvent) => set({ currentEvent }),
      setLetteringScheme: (letteringScheme) => set({ letteringScheme }),
      set: (patch) => set(patch),
    }),
    { name: 'scc-settings' },
  ),
);

// Apply the theme class to <html> whenever it changes.
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}
