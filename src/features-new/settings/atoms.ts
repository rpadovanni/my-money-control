import { atom } from 'jotai';
import type { Settings, Theme } from './types';

// Internal atoms
export const settingsAtom = atom<Settings>({
  theme: 'system',
  customCategories: [],
});

// Theme atom for easier access
export const themeAtom = atom(
  (get) => get(settingsAtom).theme,
  (get, set, newTheme: Theme) => {
    set(settingsAtom, { ...get(settingsAtom), theme: newTheme });
  }
);
