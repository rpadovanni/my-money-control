import { atom } from 'jotai';
import type { MonthlySpending, CategorySummary, WeeklySpending, MonthForecast, DashboardSummary } from '../types';

// Base atoms - will be populated by hooks
export const monthlySpendingAtom = atom<MonthlySpending[]>([]);
export const categorySummaryAtom = atom<CategorySummary[]>([]);
export const weeklySpendingAtom = atom<WeeklySpending[]>([]);
export const monthForecastAtom = atom<MonthForecast | null>(null);
export const dashboardSummaryAtom = atom<DashboardSummary | null>(null);

// Derived atoms
export const currentMonthSpendingAtom = atom((get) => {
  const monthly = get(monthlySpendingAtom);
  const now = new Date();
  return monthly.find(
    (m) => m.month === now.getMonth() + 1 && m.year === now.getFullYear()
  );
});

export const totalMonthlySpendingAtom = atom((get) => {
  const monthly = get(monthlySpendingAtom);
  return monthly.reduce((acc, m) => acc + m.total, 0);
});

export const topCategoriesAtom = atom((get) => {
  const categories = get(categorySummaryAtom);
  return [...categories]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
});

export const currentWeekSpendingAtom = atom((get) => {
  const weekly = get(weeklySpendingAtom);
  const now = new Date();
  return weekly.find(
    (w) => now >= w.startDate && now <= w.endDate
  );
});

