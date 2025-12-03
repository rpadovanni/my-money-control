import { atom } from 'jotai';
import type { ChecklistItemState } from './types';

// Internal atoms - NOT exported from index.ts
// Stores completion state for checklist items by period
export const checklistStatesAtom = atom<ChecklistItemState[]>([]);
