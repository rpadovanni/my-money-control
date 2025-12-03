import { atom } from 'jotai';
import type { Settings, ViewPreferences, CustomCategory } from '../types';

// Base atoms for settings
export const settingsAtom = atom<Settings>({
  theme: 'system',
  viewPreferences: {
    currencyFormat: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-BR',
    showDecimals: true,
    compactMode: false,
  },
  customCategories: [],
});

// Derived atoms for settings
export const themeAtom = atom(
  (get) => get(settingsAtom).theme,
  (get, set, newTheme: Settings['theme']) => {
    const settings = get(settingsAtom);
    set(settingsAtom, { ...settings, theme: newTheme });
  }
);

export const viewPreferencesAtom = atom(
  (get) => get(settingsAtom).viewPreferences,
  (get, set, newPreferences: Partial<ViewPreferences>) => {
    const settings = get(settingsAtom);
    set(settingsAtom, {
      ...settings,
      viewPreferences: { ...settings.viewPreferences, ...newPreferences },
    });
  }
);

export const customCategoriesAtom = atom(
  (get) => get(settingsAtom).customCategories,
  (get, set, newCategories: CustomCategory[]) => {
    const settings = get(settingsAtom);
    set(settingsAtom, { ...settings, customCategories: newCategories });
  }
);

export const expenseCustomCategoriesAtom = atom((get) => {
  const categories = get(customCategoriesAtom);
  return categories.filter((cat) => cat.type === 'expense');
});

export const incomeCustomCategoriesAtom = atom((get) => {
  const categories = get(customCategoriesAtom);
  return categories.filter((cat) => cat.type === 'income');
});

