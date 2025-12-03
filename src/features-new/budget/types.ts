// Types for budget feature
import type { TransactionCategory } from '../transactions/types';

// Use expense categories from transactions
export type BudgetCategory = Extract<
  TransactionCategory,
  'food' | 'transport' | 'entertainment' | 'health' | 'education' | 'shopping' | 'bills' | 'travel' | 'personal' | 'other'
>;

export interface CategoryBudget {
  id: string;
  category: BudgetCategory;
  limit: number;
  month: number; // 1-12
  year: number;
}

export interface CategoryBudgetFormData {
  category: BudgetCategory;
  limit: number;
  month: number;
  year: number;
}

export interface BudgetStatus {
  category: BudgetCategory;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
  isWarning: boolean; // > 80% do limite
}

export interface BudgetSummary {
  totalLimit: number;
  totalSpent: number;
  totalRemaining: number;
  categories: BudgetStatus[];
  exceededCount: number;
  warningCount: number;
}

export interface BudgetWarning {
  category: BudgetCategory;
  type: 'exceeded' | 'warning';
  message: string;
  limit: number;
  spent: number;
  percentage: number;
}
