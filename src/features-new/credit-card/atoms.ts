import type { CreditCard, Purchase, MonthlyBudget } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms - NOT exported from index.ts
export const cardsAtom = persistentAtom<CreditCard[]>('credit-cards', []);
export const purchasesAtom = persistentAtom<Purchase[]>('credit-card-purchases', []);
export const monthlyBudgetsAtom = persistentAtom<MonthlyBudget[]>('credit-card-monthly-budgets', []);

