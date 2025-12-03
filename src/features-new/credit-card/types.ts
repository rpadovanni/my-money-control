// Types for credit-card feature

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  closingDay: number;
  dueDay: number;
  limit: number;
  active: boolean;
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

export interface Purchase {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: Date;
  installments?: number;
  currentInstallment?: number;
}

export interface Invoice {
  cardId: string;
  month: number;
  year: number;
  total: number;
  paid: boolean;
}

export interface MonthlyBudget {
  month: number;
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
  active: boolean;
}

export interface PurchaseFormData {
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: Date;
  installments?: number;
  currentInstallment?: number;
}

