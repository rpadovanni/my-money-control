import type { StateCreator } from 'zustand';
import type { Settings } from '../types/settings';

export interface SettingsSlice {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: { theme: 'system', currency: 'BRL' },
  updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
});
