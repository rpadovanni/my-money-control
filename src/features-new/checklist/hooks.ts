import { useAtom, useAtomValue } from 'jotai';
import { checklistItemsAtom } from './atoms';
import { weeklyItemsAtom, monthlyItemsAtom } from './selectors';
import type { ChecklistItem } from './types';

export function useChecklist() {
  const [items, setItems] = useAtom(checklistItemsAtom);
  const weeklyItems = useAtomValue(weeklyItemsAtom);
  const monthlyItems = useAtomValue(monthlyItemsAtom);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return {
    items,
    weeklyItems,
    monthlyItems,
    toggleItem,
  };
}

