import type { MonthlySpending, WeeklySpending, CategorySummary, MonthForecast } from './types';

// Utility functions for dashboard feature

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatMonth(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatWeekLabel(startDate: Date, endDate: Date): string {
  const start = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(startDate);
  const end = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(endDate);
  return `${start} - ${end}`;
}

/**
 * Get weeks of current month
 */
export function getWeeksOfMonth(year: number, month: number): WeeklySpending[] {
  const weeks: WeeklySpending[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  let currentWeek = 1;
  let currentDate = new Date(firstDay);
  
  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    // Find Sunday of the week (or start of month if it's the first week)
    if (currentWeek === 1) {
      weekStart.setDate(1);
    } else {
      const dayOfWeek = currentDate.getDay();
      weekStart.setDate(currentDate.getDate() - dayOfWeek);
    }
    
    // Find Saturday of the week (or end of month if it's the last week)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    if (weekEnd > lastDay) {
      weekEnd.setTime(lastDay.getTime());
    }
    
    weeks.push({
      week: currentWeek,
      startDate: new Date(weekStart),
      endDate: new Date(weekEnd),
      total: 0,
      expenses: 0,
      creditCard: 0,
    });
    
    // Move to next week
    currentDate.setDate(weekEnd.getDate() + 1);
    currentWeek++;
    
    if (currentDate > lastDay) break;
  }
  
  return weeks;
}

/**
 * Calculate month forecast based on current spending
 */
export function calculateMonthForecast(
  currentSpent: number,
  currentDay: number,
  totalDays: number
): MonthForecast {
  const daysRemaining = totalDays - currentDay;
  const dailyAverage = currentDay > 0 ? currentSpent / currentDay : 0;
  const projectedTotal = dailyAverage * totalDays;
  const projectedDailyAverage = daysRemaining > 0 ? (projectedTotal - currentSpent) / daysRemaining : 0;

  return {
    currentSpent,
    projectedTotal,
    daysRemaining,
    dailyAverage,
    projectedDailyAverage,
  };
}

/**
 * Get last N months data
 */
export function getLastMonths(count: number): Array<{ month: number; year: number }> {
  const months: Array<{ month: number; year: number }> = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }
  
  return months;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

