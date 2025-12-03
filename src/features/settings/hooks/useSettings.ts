import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  settingsAtom,
  themeAtom,
  viewPreferencesAtom,
  customCategoriesAtom,
  expenseCustomCategoriesAtom,
  incomeCustomCategoriesAtom,
} from '../atoms';
import type { Theme, ViewPreferences, CustomCategory, CustomCategoryFormData } from '../types';
import { applyTheme, initializeTheme } from '../utils';

export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [viewPreferences, setViewPreferences] = useAtom(viewPreferencesAtom);
  const [customCategories, setCustomCategories] = useAtom(customCategoriesAtom);
  const expenseCustomCategories = useAtomValue(expenseCustomCategoriesAtom);
  const incomeCustomCategories = useAtomValue(incomeCustomCategoriesAtom);

  // Apply theme when it changes and on mount
  useEffect(() => {
    initializeTheme(theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const updateViewPreferences = (newPreferences: Partial<ViewPreferences>) => {
    setViewPreferences(newPreferences);
  };

  const addCustomCategory = (data: CustomCategoryFormData) => {
    const newCategory: CustomCategory = {
      id: crypto.randomUUID(),
      ...data,
    };
    setCustomCategories([...customCategories, newCategory]);
    return newCategory;
  };

  const updateCustomCategory = (id: string, data: Partial<CustomCategoryFormData>) => {
    setCustomCategories(
      customCategories.map((cat) => (cat.id === id ? { ...cat, ...data } : cat))
    );
  };

  const deleteCustomCategory = (id: string) => {
    setCustomCategories(customCategories.filter((cat) => cat.id !== id));
  };

  return {
    settings,
    theme,
    viewPreferences,
    customCategories,
    expenseCustomCategories,
    incomeCustomCategories,
    updateTheme,
    updateViewPreferences,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
  };
}

