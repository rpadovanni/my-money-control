import type { ChecklistItemState } from './types';
import { persistentAtom } from '../../shared/lib/persistentAtom';

// Internal atoms - NOT exported from index.ts
// Stores completion state for checklist items by period
export const checklistStatesAtom = persistentAtom<ChecklistItemState[]>('checklist-states', []);
