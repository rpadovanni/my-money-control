// Types for income feature

export type IncomeType = 'fixed' | 'variable';

export interface Income {
  id: string;
  description: string;
  amount: number;
  type: IncomeType;
  date: Date;
  month: number; // 1-12
  year: number;
  received: boolean;
}

export interface IncomeFormData {
  description: string;
  amount: number;
  type: IncomeType;
  date: Date;
  received: boolean;
}

export interface IncomeForecast {
  month: number; // 1-12
  year: number;
  fixedIncome: number; // Soma de receitas fixas
  variableIncome: number; // Soma de receitas variáveis
  totalIncome: number; // Total previsto
  receivedIncome: number; // Total já recebido
  pendingIncome: number; // Total pendente
}

export const INCOME_TYPES: Record<IncomeType, string> = {
  fixed: 'Fixa',
  variable: 'Variável',
};

