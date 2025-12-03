import { atom } from 'jotai';
import type { MonthlyChecklist, WeeklyChecklist } from '../types';
import { getCurrentMonthKey, getCurrentWeekKey, createMonthlyChecklist, createWeeklyChecklist } from '../utils';

// Base atoms
export const monthlyChecklistAtom = atom<MonthlyChecklist>(() => {
  const monthKey = getCurrentMonthKey();
  return createMonthlyChecklist(monthKey);
});

export const weeklyChecklistAtom = atom<WeeklyChecklist>(() => {
  const weekKey = getCurrentWeekKey();
  return createWeeklyChecklist(weekKey);
});

