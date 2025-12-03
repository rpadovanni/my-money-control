import { atom } from 'jotai';
import type { ChecklistItem } from './types';

// Internal atoms
export const checklistItemsAtom = atom<ChecklistItem[]>([]);

