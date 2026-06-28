import { create } from 'zustand';

// Ephemeral UI state (not persisted). Focus mode hides the app chrome so a
// single page (e.g. the Timer) can use the full viewport.
interface UiState {
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
  toggleFocusMode: () => void;
}

export const useUi = create<UiState>((set) => ({
  focusMode: false,
  setFocusMode: (focusMode) => set({ focusMode }),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
}));
