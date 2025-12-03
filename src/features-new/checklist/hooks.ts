import { useAtom, useAtomValue } from 'jotai';
import { checklistStatesAtom } from './atoms';
import {
  monthlyChecklistAtom,
  weeklyChecklistAtom,
  monthlyChecklistProgressAtom,
  weeklyChecklistProgressAtom,
} from './selectors';
import type { ChecklistItemState } from './types';

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getCurrentWeekKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export function useChecklist() {
  const [states, setStates] = useAtom(checklistStatesAtom);
  const monthlyChecklist = useAtomValue(monthlyChecklistAtom);
  const weeklyChecklist = useAtomValue(weeklyChecklistAtom);
  const monthlyProgress = useAtomValue(monthlyChecklistProgressAtom);
  const weeklyProgress = useAtomValue(weeklyChecklistProgressAtom);

  const toggleItem = (itemId: string, period: 'weekly' | 'monthly') => {
    const periodKey = period === 'monthly' ? getCurrentMonthKey() : getCurrentWeekKey();
    
    setStates((prev) => {
      const existingState = prev.find(
        (s) => s.itemId === itemId && s.periodKey === periodKey
      );

      if (existingState) {
        // Toggle existing state
        return prev.map((s) =>
          s.itemId === itemId && s.periodKey === periodKey
            ? {
                ...s,
                completed: !s.completed,
                completedAt: !s.completed ? new Date().toISOString() : undefined,
              }
            : s
        );
      } else {
        // Create new state
        const newState: ChecklistItemState = {
          itemId,
          completed: true,
          completedAt: new Date().toISOString(),
          period,
          periodKey,
        };
        return [...prev, newState];
      }
    });
  };

  return {
    monthlyChecklist,
    weeklyChecklist,
    monthlyProgress,
    weeklyProgress,
    toggleItem,
  };
}
