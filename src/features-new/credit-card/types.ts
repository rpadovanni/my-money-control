// Types for credit-card feature

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  closingDay: number; // 1-31
  dueDay: number; // 1-31
  limit: number;
  active: boolean;
}

// Purchase category matches TransactionCategory for expenses
export type PurchaseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'bills'
  | 'travel'
  | 'personal'
  | 'other';

export interface Purchase {
  id: string;
  transactionId: string; // Reference to Transaction.id
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: string; // ISO string format (same as Transaction)
  installments?: number; // Total number of installments
  currentInstallment?: number; // Current installment (1-based)
  parentPurchaseId?: string; // For installment purchases, reference to first purchase
}

export interface Invoice {
  cardId: string;
  cardName: string;
  month: number; // 1-12
  year: number;
  total: number;
  paid: boolean;
  purchases: Purchase[];
}

export interface MonthlyBudget {
  cardId: string;
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
  active: boolean;
}

export interface PurchaseFormData {
  cardId: string;
  description: string;
  amount: number;
  category: PurchaseCategory;
  date: string; // ISO string
  installments?: number;
}

export interface CardBudgetProgress {
  cardId: string;
  cardName: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
  isWarning: boolean; // > 80%
}

// Category labels (matching Transaction categories)
export const PURCHASE_CATEGORIES: Record<PurchaseCategory, string> = {
  food: 'Alimentação',
  transport: 'Transporte',
  entertainment: 'Lazer',
  health: 'Saúde',
  education: 'Educação',
  shopping: 'Compras',
  bills: 'Contas',
  travel: 'Viagem',
  personal: 'Pessoal',
  other: 'Outros',
};
