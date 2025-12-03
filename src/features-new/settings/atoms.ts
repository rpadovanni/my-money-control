import { atom } from 'jotai';
import type { Settings, Theme } from './types';

// Internal atoms
export const settingsAtom = atom<Settings>({
  theme: 'system',
  customCategories: [],
});

// Theme atom moved to selectors.ts
