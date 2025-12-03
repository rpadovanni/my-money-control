// Types for transactions feature (unified expenses + income)

export type TransactionType = 'expense' | 'income';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investment-return'
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

export type PaymentMethod = 'debit' | 'cash' | 'pix' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: TransactionCategory;
  paymentMethod?: PaymentMethod; // Only for expenses
  date: Date;
  notes?: string;
}

export interface TransactionFormData {
  type: TransactionType;
  description: string;
  amount: number;
  category: TransactionCategory;
  paymentMethod?: PaymentMethod;
  date: Date;
  notes?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  category?: TransactionCategory;
  paymentMethod?: PaymentMethod;
}

