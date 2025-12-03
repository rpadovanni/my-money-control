// Types for settings feature

export type Theme = 'light' | 'dark' | 'system';

export interface ViewPreferences {
  currencyFormat: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  numberFormat: 'pt-BR' | 'en-US';
  showDecimals: boolean;
  compactMode: boolean;
}

export interface CustomCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'expense' | 'income';
}

export interface Settings {
  theme: Theme;
  viewPreferences: ViewPreferences;
  customCategories: CustomCategory[];
}

export interface CustomCategoryFormData {
  name: string;
  icon?: string;
  color?: string;
  type: 'expense' | 'income';
}

export const THEMES: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

export const CURRENCY_FORMATS = {
  BRL: 'Real (R$)',
  USD: 'Dólar (US$)',
  EUR: 'Euro (€)',
} as const;

export const DATE_FORMATS = {
  'DD/MM/YYYY': 'DD/MM/AAAA',
  'MM/DD/YYYY': 'MM/DD/AAAA',
  'YYYY-MM-DD': 'AAAA-MM-DD',
} as const;

