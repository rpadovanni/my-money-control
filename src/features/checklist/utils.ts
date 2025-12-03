import { format, startOfMonth, startOfWeek } from 'date-fns';
import type { ChecklistItem, MonthlyChecklist, WeeklyChecklist } from './types';
import { DEFAULT_MONTHLY_ITEMS, DEFAULT_WEEKLY_ITEMS } from './types';

export function getCurrentMonthKey(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getCurrentWeekKey(): string {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  return format(weekStart, 'yyyy-ww');
}

export function createMonthlyChecklist(monthKey: string): MonthlyChecklist {
  const items: ChecklistItem[] = DEFAULT_MONTHLY_ITEMS.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    checked: false,
  }));

  return {
    month: monthKey,
    items,
    lastResetDate: new Date(),
  };
}

export function createWeeklyChecklist(weekKey: string): WeeklyChecklist {
  const items: ChecklistItem[] = DEFAULT_WEEKLY_ITEMS.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    checked: false,
  }));

  return {
    week: weekKey,
    items,
    lastResetDate: new Date(),
  };
}

export function shouldResetMonthly(lastResetDate: Date): boolean {
  const now = new Date();
  const lastMonth = format(lastResetDate, 'yyyy-MM');
  const currentMonth = format(now, 'yyyy-MM');
  return lastMonth !== currentMonth;
}

export function shouldResetWeekly(lastResetDate: Date): boolean {
  const now = new Date();
  const lastWeek = format(startOfWeek(lastResetDate, { weekStartsOn: 1 }), 'yyyy-ww');
  const currentWeek = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-ww');
  return lastWeek !== currentWeek;
}

