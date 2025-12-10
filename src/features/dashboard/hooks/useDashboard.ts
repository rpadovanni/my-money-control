import { useAtomValue, useSetAtom } from 'jotai';
import {
  monthlySpendingAtom,
  categorySummaryAtom,
  weeklySpendingAtom,
  monthForecastAtom,
  dashboardSummaryAtom,
  currentMonthSpendingAtom,
  topCategoriesAtom,
  currentWeekSpendingAtom,
} from '../atoms';
import { useTransactions } from '@/features/transactions';
import { usePurchases, useInvoices, useBudget } from '../../../features-new/credit-card/hooks';
import { getWeeksOfMonth, calculateMonthForecast, getLastMonths, calculatePercentage } from '../utils';
import { useMemo } from 'react';
import type { MonthlySpending, CategorySummary, WeeklySpending, MonthForecast, DashboardSummary } from '../types';
import { TRANSACTION_CATEGORIES } from '@/shared/store/types/transactions';
import { PURCHASE_CATEGORIES } from '../../../features-new/credit-card/types';

export function useDashboard() {
  const { expenses: allExpenses } = useTransactions();
  const { purchases } = usePurchases();
  const { currentInvoices } = useInvoices();
  const { currentBudget } = useBudget();
  
  const setMonthlySpending = useSetAtom(monthlySpendingAtom);
  const setCategorySummary = useSetAtom(categorySummaryAtom);
  const setWeeklySpending = useSetAtom(weeklySpendingAtom);
  const setMonthForecast = useSetAtom(monthForecastAtom);
  const setDashboardSummary = useSetAtom(dashboardSummaryAtom);

  const currentMonthSpending = useAtomValue(currentMonthSpendingAtom);
  const topCategories = useAtomValue(topCategoriesAtom);
  const currentWeekSpending = useAtomValue(currentWeekSpendingAtom);

  // Calculate monthly spending
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = getLastMonths(6); // Last 6 months
    const monthly: MonthlySpending[] = months.map(({ month, year }) => {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      // Expenses in this month
      const monthExpenses = allExpenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });
      const expensesTotal = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

      // Credit card purchases in this month
      const monthPurchases = purchases.filter((p) => {
        const purchaseDate = new Date(p.date);
        return purchaseDate >= monthStart && purchaseDate <= monthEnd;
      });
      const creditCardTotal = monthPurchases.reduce((acc, p) => acc + p.amount, 0);

      return {
        month,
        year,
        total: expensesTotal + creditCardTotal,
        expenses: expensesTotal,
        creditCard: creditCardTotal,
      };
    });

    setMonthlySpending(monthly);
    return monthly;
  }, [allExpenses, purchases, setMonthlySpending]);

  // Calculate category summary
  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const categoryMap = new Map<string, number>();

    // Add expenses
    allExpenses
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      })
      .forEach((exp) => {
        const categoryName = TRANSACTION_CATEGORIES[exp.category as keyof typeof TRANSACTION_CATEGORIES] || exp.category;
        const current = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, current + exp.value);
      });

    // Add credit card purchases
    purchases
      .filter((p) => {
        const purchaseDate = new Date(p.date);
        return purchaseDate >= monthStart && purchaseDate <= monthEnd;
      })
      .forEach((p) => {
        const categoryName = PURCHASE_CATEGORIES[p.category] || p.category;
        const current = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, current + p.amount);
      });

    const total = Array.from(categoryMap.values()).reduce((acc, val) => acc + val, 0);
    const categories: CategorySummary[] = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: calculatePercentage(amount, total),
    }));

    setCategorySummary(categories);
    return categories;
  }, [allExpenses, purchases, setCategorySummary]);

  // Calculate weekly spending
  const weeklyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const weeks = getWeeksOfMonth(currentYear, currentMonth);

    const weekly: WeeklySpending[] = weeks.map((week) => {
      const weekExpenses = allExpenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= week.startDate && expDate <= week.endDate;
      });
      const expensesTotal = weekExpenses.reduce((acc, exp) => acc + exp.value, 0);

      const weekPurchases = purchases.filter((p) => {
        const purchaseDate = new Date(p.date);
        return purchaseDate >= week.startDate && purchaseDate <= week.endDate;
      });
      const creditCardTotal = weekPurchases.reduce((acc, p) => acc + p.amount, 0);

      return {
        ...week,
        total: expensesTotal + creditCardTotal,
        expenses: expensesTotal,
        creditCard: creditCardTotal,
      };
    });

    setWeeklySpending(weekly);
    return weekly;
  }, [allExpenses, purchases, setWeeklySpending]);

  // Calculate month forecast
  const forecast = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();

    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const monthExpenses = allExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });
    const expensesTotal = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

    const monthPurchases = purchases.filter((p) => {
      const purchaseDate = new Date(p.date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });
    const creditCardTotal = monthPurchases.reduce((acc, p) => acc + p.amount, 0);

    const currentSpent = expensesTotal + creditCardTotal;
    const forecastData = calculateMonthForecast(currentSpent, currentDay, totalDays);

    setMonthForecast(forecastData);
    return forecastData;
  }, [allExpenses, purchases, setMonthForecast]);

  // Calculate dashboard summary
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const monthExpenses = allExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });
    const expensesTotal = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

    const monthPurchases = purchases.filter((p) => {
      const purchaseDate = new Date(p.date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });
    const creditCardTotal = monthPurchases.reduce((acc, p) => acc + p.amount, 0);

    const totalSpent = expensesTotal + creditCardTotal;
    const budgetLimit = currentBudget?.limit || 0;
    const budgetRemaining = budgetLimit - totalSpent;
    const budgetPercentage = calculatePercentage(totalSpent, budgetLimit);

    const summaryData: DashboardSummary = {
      totalSpent,
      totalExpenses: expensesTotal,
      totalCreditCard: creditCardTotal,
      budgetLimit,
      budgetRemaining,
      budgetPercentage,
    };

    setDashboardSummary(summaryData);
    return summaryData;
  }, [allExpenses, purchases, currentBudget, setDashboardSummary]);

  return {
    monthlyData,
    categoryData,
    weeklyData,
    forecast,
    summary,
    currentMonthSpending,
    topCategories,
    currentWeekSpending,
  };
}

