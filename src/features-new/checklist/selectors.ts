import { atom } from 'jotai';
import { checklistItemsAtom } from './atoms';

// Weekly items
export const weeklyItemsAtom = atom((get) => {
  const items = get(checklistItemsAtom);
  return items.filter((item) => item.period === 'weekly');
});

// Monthly items
export const monthlyItemsAtom = atom((get) => {
  const items = get(checklistItemsAtom);
  return items.filter((item) => item.period === 'monthly');
});

