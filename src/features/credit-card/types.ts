// Types for credit-card feature

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  closingDay: number; // Day of month (1-31)
  dueDay: number; // Day of month (1-31)
  limit: number;
  active: boolean;
}

export interface Purchase {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: Date;
  installments?: number; // Number of installments (1 = single payment)
  currentInstallment?: number; // Current installment number
}

export type PurchaseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'bills'
  | 'travel'
  | 'other';

export const PURCHASE_CATEGORIES: Record<PurchaseCategory, string> = {
  food: 'Alimentação',
  transport: 'Transporte',
  entertainment: 'Lazer',
  health: 'Saúde',
  education: 'Educação',
  shopping: 'Compras',
  bills: 'Contas',
  travel: 'Viagem',
  other: 'Outros',
};

export interface Invoice {
  cardId: string;
  month: number; // 1-12
  year: number;
  total: number;
  purchases: Purchase[];
  closingDate: Date;
  dueDate: Date;
  paid: boolean;
}

export interface MonthlyBudget {
  month: number; // 1-12
  year: number;
  limit: number;
  spent: number;
}

export interface CreditCardFormData {
  name: string;
  lastFourDigits: string;
  closingDay: number;
  dueDay: number;
  limit: number;
}

export interface PurchaseFormData {
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: Date;
  installments?: number;
}

