import { create } from 'zustand';
import type { PublicUser } from '@scc/shared';
import { api } from '../lib/api';

interface AuthState {
  user: PublicUser | null;
  loading: boolean;
  init: () => Promise<void>;
  setUser: (u: PublicUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  setUser: (u) => set({ user: u }),
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.user });
  },
  register: async (email, password, displayName) => {
    const { data } = await api.post('/auth/register', { email, password, displayName });
    set({ user: data.user });
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));
