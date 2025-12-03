// Public API - only hooks and components are exposed
export { default } from './Transactions';
export { useTransactions } from './hooks';
export * from './types';
export * from './components/TransactionForm';
export * from './components/TransactionTable';
export * from './components/TransactionFilters';

// Selectors for other features to consume
export {
  filteredTransactionsAtom,
  expensesAtom,
  incomesAtom,
  totalExpensesAtom,
  totalIncomesAtom,
  expensesByCategoryAtom,
  currentMonthExpensesAtom,
  currentMonthIncomesAtom,
} from './selectors';

