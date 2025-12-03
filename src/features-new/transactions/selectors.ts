import { atom } from 'jotai';
import { transactionsAtom, transactionFiltersAtom } from './atoms';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './types';

// Filtered transactions
export const filteredTransactionsAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  const filters = get(transactionFiltersAtom);

  return transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    
    if (filters.startDate) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.startDate);
      if (transactionDate < startDate) return false;
    }
    
    if (filters.endDate) {
      const transactionDate = new Date(transaction.date);
      const endDate = new Date(filters.endDate);
      if (transactionDate > endDate) return false;
    }
    
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) return false;
    
    return true;
  });
});

// Separate by type
export const expensesAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  return transactions.filter((t) => t.type === 'expense');
});

export const incomesAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  return transactions.filter((t) => t.type === 'income');
});

// Totals
export const totalExpensesAtom = atom((get) => {
  const expenses = get(expensesAtom);
  return expenses.reduce((acc, exp) => acc + exp.value, 0);
});

export const totalIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.reduce((acc, inc) => acc + inc.value, 0);
});

// Current month transactions
export const currentMonthExpensesAtom = atom((get) => {
  const expenses = get(expensesAtom);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate >= monthStart && expDate <= monthEnd;
  });
});

export const currentMonthIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return incomes.filter((inc) => {
    const incDate = new Date(inc.date);
    return incDate >= monthStart && incDate <= monthEnd;
  });
});

// Current month totals
export const currentMonthExpensesTotalAtom = atom((get) => {
  const expenses = get(currentMonthExpensesAtom);
  return expenses.reduce((acc, exp) => acc + exp.value, 0);
});

export const currentMonthIncomesTotalAtom = atom((get) => {
  const incomes = get(currentMonthIncomesAtom);
  return incomes.reduce((acc, inc) => acc + inc.value, 0);
});

// Expenses by category
export const expensesByCategoryAtom = atom((get) => {
  const expenses = get(expensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.value;
      return acc;
    },
    {} as Record<string, number>
  );
});

// Expenses by payment method
export const expensesByPaymentMethodAtom = atom((get) => {
  const expenses = get(expensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      if (expense.paymentMethod) {
        if (!acc[expense.paymentMethod]) {
          acc[expense.paymentMethod] = 0;
        }
        acc[expense.paymentMethod] += expense.value;
      }
      return acc;
    },
    {} as Record<string, number>
  );
});

// Expenses by month
export const expensesByMonthAtom = atom((get) => {
  const expenses = get(expensesAtom);
  return expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += expense.value;
      return acc;
    },
    {} as Record<string, number>
  );
});

// Incomes by category
export const incomesByCategoryAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.reduce(
    (acc, income) => {
      if (!acc[income.category]) {
        acc[income.category] = 0;
      }
      acc[income.category] += income.value;
      return acc;
    },
    {} as Record<string, number>
  );
});
