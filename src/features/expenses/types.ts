// Types for expenses feature

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: Date;
}

export type ExpenseCategory =
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

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, string> = {
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

export type PaymentMethod = 'debit' | 'cash' | 'pix';

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  debit: 'Débito',
  cash: 'Dinheiro',
  pix: 'PIX',
};

export interface ExpenseFormData {
  description: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: Date;
}

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
}

