import { atom } from 'jotai';
import { transactionsAtom, transactionFiltersAtom } from './atoms';

// Derived atoms / selectors
export const filteredTransactionsAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  const filters = get(transactionFiltersAtom);

  return transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.startDate && transaction.date < filters.startDate) return false;
    if (filters.endDate && transaction.date > filters.endDate) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });
});

export const expensesAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  return transactions.filter((t) => t.type === 'expense');
});

export const incomesAtom = atom((get) => {
  const transactions = get(transactionsAtom);
  return transactions.filter((t) => t.type === 'income');
});

export const totalExpensesAtom = atom((get) => {
  const expenses = get(expensesAtom);
  return expenses.reduce((acc, exp) => acc + exp.amount, 0);
});

export const totalIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.reduce((acc, inc) => acc + inc.amount, 0);
});

export const expensesByCategoryAtom = atom((get) => {
  const expenses = get(expensesAtom);
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

