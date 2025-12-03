import type { FixedCost } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms - NOT exported from index.ts
export const fixedCostsAtom = persistentAtom<FixedCost[]>('fixed-costs', []);
