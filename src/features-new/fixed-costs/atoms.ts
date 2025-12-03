import { atom } from 'jotai';
import type { FixedCost } from './types';

// Internal atoms - NOT exported from index.ts
export const fixedCostsAtom = atom<FixedCost[]>([]);
