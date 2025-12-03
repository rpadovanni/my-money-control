import type { Settings } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms
export const settingsAtom = persistentAtom<Settings>('settings', {
  theme: 'system',
  customCategories: [],
});
