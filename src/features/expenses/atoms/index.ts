import { atom } from 'jotai';
import type { Expense, ExpenseFilters } from '../types';

// Base atoms
export const expensesAtom = atom<Expense[]>([]);
export const expenseFiltersAtom = atom<ExpenseFilters>({});

// Derived atoms
export const filteredExpensesAtom = atom((get) => {
  const expenses = get(expensesAtom);
  const filters = get(expenseFiltersAtom);

  return expenses.filter((expense) => {
    if (filters.startDate) {
      const startDate = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
      if (!isNaN(startDate.getTime()) && expense.date < startDate) return false;
    }
    if (filters.endDate) {
      const endDate = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
      if (!isNaN(endDate.getTime()) && expense.date > endDate) return false;
    }
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });
});

export const totalExpensesAtom = atom((get) => {
  const expenses = get(filteredExpensesAtom);
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
});

export const expensesByCategoryAtom = atom((get) => {
  const expenses = get(filteredExpensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );
});

export const expensesByPaymentMethodAtom = atom((get) => {
  const expenses = get(filteredExpensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.paymentMethod]) {
        acc[expense.paymentMethod] = 0;
      }
      acc[expense.paymentMethod] += expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );
});

export const expensesByMonthAtom = atom((get) => {
  const expenses = get(filteredExpensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      const monthKey = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );
});

