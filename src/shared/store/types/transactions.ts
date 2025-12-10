// Types for transactions feature (unified expenses + income)

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  // Income categories
  | 'salary'
  | 'freelance'
  | 'investment-return'
  | 'other-income'
  // Expense categories
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

export type PaymentMethod = 'pix' | 'debit' | 'credit-card';

export interface Transaction {
  id: string;
  date: string; // ISO string format
  category: TransactionCategory;
  value: number;
  type: TransactionType;
  paymentMethod?: PaymentMethod;
  creditCardId?: string;
  notes?: string;
}

export interface TransactionFormData {
  date: string;
  category: TransactionCategory;
  value: number;
  type: TransactionType;
  paymentMethod?: PaymentMethod;
  creditCardId?: string;
  notes?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  category?: TransactionCategory;
  paymentMethod?: PaymentMethod;
}

// Category labels
export const TRANSACTION_CATEGORIES: Record<TransactionCategory, string> = {
  // Income
  salary: 'Salário',
  freelance: 'Freelance',
  'investment-return': 'Retorno de Investimento',
  'other-income': 'Outra Receita',
  // Expenses
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

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  debit: 'Débito',
  'credit-card': 'Cartão de Crédito',
};

// Helper to get income categories
export const INCOME_CATEGORIES: TransactionCategory[] = [
  'salary',
  'freelance',
  'investment-return',
  'other-income',
];

// Helper to get expense categories
export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'entertainment',
  'health',
  'education',
  'shopping',
  'bills',
  'travel',
  'personal',
  'other',
];
