// Types for budget feature

export type BudgetCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'bills'
  | 'travel'
  | 'other';

export interface CategoryBudget {
  id: string;
  category: BudgetCategory;
  limit: number;
  month: number;
  year: number;
}

export interface CategoryBudgetFormData {
  category: BudgetCategory;
  limit: number;
  month: number;
  year: number;
}

