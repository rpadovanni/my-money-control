import { atom } from 'jotai';
import { checklistStatesAtom } from './atoms';
import { CHECKLIST_MENSAL, CHECKLIST_SEMANAL } from './types';
import type { ChecklistItem, ChecklistItemState } from './types';

/**
 * Get current period keys
 */
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

/**
 * Get monthly checklist items with completion state
 */
export const monthlyChecklistAtom = atom((get) => {
  const states = get(checklistStatesAtom);
  const currentMonthKey = getCurrentMonthKey();
  const monthStates = states.filter(
    (s) => s.period === 'monthly' && s.periodKey === currentMonthKey
  );

  return CHECKLIST_MENSAL.map((item) => {
    const state = monthStates.find((s) => s.itemId === item.id);
    return {
      ...item,
      completed: state?.completed || false,
      completedAt: state?.completedAt,
    };
  });
});

/**
 * Get weekly checklist items with completion state
 */
export const weeklyChecklistAtom = atom((get) => {
  const states = get(checklistStatesAtom);
  const currentWeekKey = getCurrentWeekKey();
  const weekStates = states.filter(
    (s) => s.period === 'weekly' && s.periodKey === currentWeekKey
  );

  return CHECKLIST_SEMANAL.map((item) => {
    const state = weekStates.find((s) => s.itemId === item.id);
    return {
      ...item,
      completed: state?.completed || false,
      completedAt: state?.completedAt,
    };
  });
});

/**
 * Get monthly checklist progress
 */
export const monthlyChecklistProgressAtom = atom((get) => {
  const items = get(monthlyChecklistAtom);
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
});

/**
 * Get weekly checklist progress
 */
export const weeklyChecklistProgressAtom = atom((get) => {
  const items = get(weeklyChecklistAtom);
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
});
