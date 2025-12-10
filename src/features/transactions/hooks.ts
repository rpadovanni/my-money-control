import { useStore } from '@/shared/store';
import { useMemo } from 'react';

export function useTransactions() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = useStore((state) => state.clearFilters);
  const fetchTransactions = useStore((state) => state.fetchTransactions);

  // Computed values - recalculate when transactions or filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredTransactions = useMemo(() => useStore.getState().getFilteredTransactions(), [transactions, filters]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expenses = useMemo(() => useStore.getState().getExpenses(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const incomes = useMemo(() => useStore.getState().getIncomes(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalExpenses = useMemo(() => useStore.getState().getTotalExpenses(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalIncomes = useMemo(() => useStore.getState().getTotalIncomes(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMonthExpenses = useMemo(() => useStore.getState().getCurrentMonthExpenses(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMonthIncomes = useMemo(() => useStore.getState().getCurrentMonthIncomes(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMonthExpensesTotal = useMemo(() => useStore.getState().getCurrentMonthExpensesTotal(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMonthIncomesTotal = useMemo(() => useStore.getState().getCurrentMonthIncomesTotal(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expensesByCategory = useMemo(() => useStore.getState().getExpensesByCategory(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expensesByPaymentMethod = useMemo(() => useStore.getState().getExpensesByPaymentMethod(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expensesByMonth = useMemo(() => useStore.getState().getExpensesByMonth(), [transactions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const incomesByCategory = useMemo(() => useStore.getState().getIncomesByCategory(), [transactions]);

  return {
    transactions,
    filteredTransactions,
    expenses,
    incomes,
    totalExpenses,
    totalIncomes,
    currentMonthExpenses,
    currentMonthIncomes,
    currentMonthExpensesTotal,
    currentMonthIncomesTotal,
    expensesByCategory,
    expensesByPaymentMethod,
    expensesByMonth,
    incomesByCategory,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    clearFilters,
    fetchTransactions,
  };
}
