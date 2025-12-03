import { atom } from 'jotai';
import { settingsAtom } from './atoms';

// Theme selector
export const themeAtom = atom(
  (get) => get(settingsAtom).theme,
  (get, set, newTheme: string) => {
    const settings = get(settingsAtom);
    set(settingsAtom, { ...settings, theme: newTheme as any });
  }
);

