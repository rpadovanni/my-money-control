import { atom } from 'jotai';
import type { RecurringExpense } from '../types';

// Base atoms for recurring expenses
export const recurringExpensesAtom = atom<RecurringExpense[]>([]);

// Derived atoms for recurring expenses
export const activeRecurringExpensesAtom = atom((get) => {
  const expenses = get(recurringExpensesAtom);
  return expenses.filter((expense) => expense.active);
});

export const totalRecurringExpensesAtom = atom((get) => {
  const expenses = get(activeRecurringExpensesAtom);
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
});

