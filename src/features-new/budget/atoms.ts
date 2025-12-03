import type { CategoryBudget } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms - NOT exported from index.ts
export const categoryBudgetsAtom = persistentAtom<CategoryBudget[]>('budgets', []);

