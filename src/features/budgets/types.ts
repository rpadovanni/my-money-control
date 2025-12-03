// Types for budgets feature

import type { TransactionCategory } from '../../features-new/transactions/types';
import { EXPENSE_CATEGORIES } from '../../features-new/transactions/types';

// Use expense categories only for budgets
export type ExpenseCategory = TransactionCategory;

export interface CategoryBudget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  month: number; // 1-12
  year: number;
}

export interface CategoryBudgetFormData {
  category: ExpenseCategory;
  limit: number;
  month: number;
  year: number;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
  isWarning: boolean; // > 80% do limite
}

export interface BudgetSimulation {
  month: number;
  year: number;
  totalLimit: number;
  projectedSpending: number;
  remaining: number;
  categories: BudgetStatus[];
  isExceeded: boolean;
  warnings: BudgetStatus[];
}

export interface BudgetAlert {
  category: ExpenseCategory;
  type: 'exceeded' | 'warning';
  message: string;
  amount: number;
  limit: number;
}

