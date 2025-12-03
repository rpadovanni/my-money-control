import type { Transaction, TransactionFilters } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms - NOT exported from index.ts
export const transactionsAtom = persistentAtom<Transaction[]>('transactions', []);
export const transactionFiltersAtom = persistentAtom<TransactionFilters>('transaction-filters', {});
