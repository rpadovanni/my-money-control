import type { StateCreator } from 'zustand';
import type {
  Transaction,
  TransactionFormData,
  TransactionFilters,
} from '../types/transactions';

export interface TransactionsSlice {
  // State
  transactions: Transaction[];
  filters: TransactionFilters;

  // Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: TransactionFormData) => Transaction;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  clearFilters: () => void;

  // Selectors (computed values)
  getFilteredTransactions: () => Transaction[];
  getExpenses: () => Transaction[];
  getIncomes: () => Transaction[];
  getTotalExpenses: () => number;
  getTotalIncomes: () => number;
  getCurrentMonthExpenses: () => Transaction[];
  getCurrentMonthIncomes: () => Transaction[];
  getCurrentMonthExpensesTotal: () => number;
  getCurrentMonthIncomesTotal: () => number;
  getExpensesByCategory: () => Record<string, number>;
  getExpensesByPaymentMethod: () => Record<string, number>;
  getExpensesByMonth: () => Record<string, number>;
  getIncomesByCategory: () => Record<string, number>;
}

export const createTransactionsSlice: StateCreator<TransactionsSlice> = (set, get) => ({
  transactions: [],
  filters: {},

  fetchTransactions: async () => {
    // TODO: implement API call
    // For now, load from localStorage if needed
    const stored = localStorage.getItem('my-money-control-transactions');
    if (stored) {
      try {
        const transactions = JSON.parse(stored);
        set({ transactions });
      } catch (error) {
        console.error('Failed to load transactions from storage', error);
      }
    }
  },

  addTransaction: (data) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    set((s) => ({ transactions: [...s.transactions, newTransaction] }));
    
    // Persist to localStorage
    const updated = [...get().transactions, newTransaction];
    localStorage.setItem('my-money-control-transactions', JSON.stringify(updated));
    
    return newTransaction;
  },

  updateTransaction: (id, data) => {
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    }));
    
    // Persist to localStorage
    const updated = get().transactions.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    localStorage.setItem('my-money-control-transactions', JSON.stringify(updated));
  },

  deleteTransaction: (id) => {
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    }));
    
    // Persist to localStorage
    const updated = get().transactions.filter((t) => t.id !== id);
    localStorage.setItem('my-money-control-transactions', JSON.stringify(updated));
  },

  setFilters: (newFilters) => {
    set((s) => ({
      filters: { ...s.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // Selectors
  getFilteredTransactions: () => {
    const { transactions, filters } = get();
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
      if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod)
        return false;

      return true;
    });
  },

  getExpenses: () => {
    return get().transactions.filter((t) => t.type === 'expense');
  },

  getIncomes: () => {
    return get().transactions.filter((t) => t.type === 'income');
  },

  getTotalExpenses: () => {
    return get()
      .getExpenses()
      .reduce((acc, exp) => acc + exp.value, 0);
  },

  getTotalIncomes: () => {
    return get()
      .getIncomes()
      .reduce((acc, inc) => acc + inc.value, 0);
  },

  getCurrentMonthExpenses: () => {
    const expenses = get().getExpenses();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });
  },

  getCurrentMonthIncomes: () => {
    const incomes = get().getIncomes();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return incomes.filter((inc) => {
      const incDate = new Date(inc.date);
      return incDate >= monthStart && incDate <= monthEnd;
    });
  },

  getCurrentMonthExpensesTotal: () => {
    return get()
      .getCurrentMonthExpenses()
      .reduce((acc, exp) => acc + exp.value, 0);
  },

  getCurrentMonthIncomesTotal: () => {
    return get()
      .getCurrentMonthIncomes()
      .reduce((acc, inc) => acc + inc.value, 0);
  },

  getExpensesByCategory: () => {
    const expenses = get().getExpenses();
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
  },

  getExpensesByPaymentMethod: () => {
    const expenses = get().getExpenses();
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
  },

  getExpensesByMonth: () => {
    const expenses = get().getExpenses();
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
  },

  getIncomesByCategory: () => {
    const incomes = get().getIncomes();
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
  },
});
