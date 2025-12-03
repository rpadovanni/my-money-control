import { atom } from 'jotai';
import type { CategoryBudget } from '../types';

// Base atoms for budgets
export const categoryBudgetsAtom = atom<CategoryBudget[]>([]);

// Derived atoms for budgets
export const currentMonthBudgetsAtom = atom((get) => {
  const budgets = get(categoryBudgetsAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  return budgets.filter(
    (budget) => budget.month === month && budget.year === year
  );
});

export const totalBudgetLimitAtom = atom((get) => {
  const budgets = get(currentMonthBudgetsAtom);
  return budgets.reduce((sum, budget) => sum + budget.limit, 0);
});

