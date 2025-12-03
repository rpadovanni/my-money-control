import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { monthlyChecklistAtom, weeklyChecklistAtom } from '../atoms';
import {
  getCurrentMonthKey,
  getCurrentWeekKey,
  createMonthlyChecklist,
  createWeeklyChecklist,
  shouldResetMonthly,
  shouldResetWeekly,
} from '../utils';

export function useChecklist() {
  const [monthlyChecklist, setMonthlyChecklist] = useAtom(monthlyChecklistAtom);
  const [weeklyChecklist, setWeeklyChecklist] = useAtom(weeklyChecklistAtom);

  // Auto-reset monthly checklist if needed
  useEffect(() => {
    const currentMonthKey = getCurrentMonthKey();
    if (monthlyChecklist.month !== currentMonthKey || shouldResetMonthly(monthlyChecklist.lastResetDate)) {
      setMonthlyChecklist(createMonthlyChecklist(currentMonthKey));
    }
  }, [monthlyChecklist.month, monthlyChecklist.lastResetDate, setMonthlyChecklist]);

  // Auto-reset weekly checklist if needed
  useEffect(() => {
    const currentWeekKey = getCurrentWeekKey();
    if (weeklyChecklist.week !== currentWeekKey || shouldResetWeekly(weeklyChecklist.lastResetDate)) {
      setWeeklyChecklist(createWeeklyChecklist(currentWeekKey));
    }
  }, [weeklyChecklist.week, weeklyChecklist.lastResetDate, setWeeklyChecklist]);

  const toggleMonthlyItem = (itemId: string) => {
    setMonthlyChecklist((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const toggleWeeklyItem = (itemId: string) => {
    setWeeklyChecklist((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const resetMonthlyChecklist = () => {
    const monthKey = getCurrentMonthKey();
    setMonthlyChecklist(createMonthlyChecklist(monthKey));
  };

  const resetWeeklyChecklist = () => {
    const weekKey = getCurrentWeekKey();
    setWeeklyChecklist(createWeeklyChecklist(weekKey));
  };

  const getMonthlyProgress = () => {
    const checked = monthlyChecklist.items.filter((item) => item.checked).length;
    const total = monthlyChecklist.items.length;
    return total > 0 ? (checked / total) * 100 : 0;
  };

  const getWeeklyProgress = () => {
    const checked = weeklyChecklist.items.filter((item) => item.checked).length;
    const total = weeklyChecklist.items.length;
    return total > 0 ? (checked / total) * 100 : 0;
  };

  return {
    monthlyChecklist,
    weeklyChecklist,
    toggleMonthlyItem,
    toggleWeeklyItem,
    resetMonthlyChecklist,
    resetWeeklyChecklist,
    monthlyProgress: getMonthlyProgress(),
    weeklyProgress: getWeeklyProgress(),
  };
}

