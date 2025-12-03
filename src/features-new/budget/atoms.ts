import { atom } from 'jotai';
import type { CategoryBudget } from './types';

// Internal atoms - NOT exported from index.ts
export const categoryBudgetsAtom = atom<CategoryBudget[]>([]);

