import { atom } from 'jotai';
import type { CreditCard, Purchase, MonthlyBudget } from './types';

// Internal atoms - NOT exported from index.ts
export const cardsAtom = atom<CreditCard[]>([]);
export const purchasesAtom = atom<Purchase[]>([]);
export const monthlyBudgetsAtom = atom<MonthlyBudget[]>([]);

