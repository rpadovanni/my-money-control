import type { StateCreator } from 'zustand';
import type { User } from '../types/user';

export interface UserSlice {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
});
