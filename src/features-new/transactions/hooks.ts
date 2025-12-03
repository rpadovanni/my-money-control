import { useAtom, useAtomValue } from 'jotai';
import { transactionsAtom, transactionFiltersAtom } from './atoms';
import {
  filteredTransactionsAtom,
  expensesAtom,
  incomesAtom,
  totalExpensesAtom,
  totalIncomesAtom,
  expensesByCategoryAtom,
  currentMonthExpensesAtom,
  currentMonthIncomesAtom,
} from './selectors';
import type { Transaction, TransactionFormData, TransactionFilters } from './types';

export function useTransactions() {
  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const [filters, setFilters] = useAtom(transactionFiltersAtom);
  const filteredTransactions = useAtomValue(filteredTransactionsAtom);
  const expenses = useAtomValue(expensesAtom);
  const incomes = useAtomValue(incomesAtom);
  const totalExpenses = useAtomValue(totalExpensesAtom);
  const totalIncomes = useAtomValue(totalIncomesAtom);
  const expensesByCategory = useAtomValue(expensesByCategoryAtom);
  const currentMonthExpenses = useAtomValue(currentMonthExpensesAtom);
  const currentMonthIncomes = useAtomValue(currentMonthIncomesAtom);

  const addTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, ...data } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const setFiltersState = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    expenses,
    incomes,
    totalExpenses,
    totalIncomes,
    expensesByCategory,
    currentMonthExpenses,
    currentMonthIncomes,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters: setFiltersState,
    clearFilters,
  };
}

