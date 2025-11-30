import { atom } from 'jotai';
import type { MonthlyBudget } from '../types';

// Base atoms for budget
export const monthlyBudgetsAtom = atom<MonthlyBudget[]>([]);

// Derived atoms for budget
export const currentBudgetAtom = atom((get) => {
  const budgets = get(monthlyBudgetsAtom);
  const now = new Date();
  return budgets.find(
    (budget) => budget.month === now.getMonth() + 1 && budget.year === now.getFullYear()
  );
});

export const budgetRemainingAtom = atom((get) => {
  const budget = get(currentBudgetAtom);
  if (!budget) return 0;
  return budget.limit - budget.spent;
});

