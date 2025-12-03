import { atom } from 'jotai';
import type { Transaction, TransactionFilters } from './types';

// Internal atoms - NOT exported from index.ts
export const transactionsAtom = atom<Transaction[]>([]);
export const transactionFiltersAtom = atom<TransactionFilters>({});
