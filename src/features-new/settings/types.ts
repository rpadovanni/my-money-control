// Types for settings feature
export type Theme = 'light' | 'dark' | 'system';

export interface Settings {
  theme: Theme;
  customCategories: string[];
}

