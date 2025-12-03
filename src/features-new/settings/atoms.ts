import { atom } from 'jotai';
import type { Settings } from './types';

// Internal atoms
export const settingsAtom = atom<Settings>({
  theme: 'system',
  customCategories: [],
});

