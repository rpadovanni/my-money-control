import { useMemo } from 'react';
import { useTransactions } from '@/features/transactions';
import { usePurchases } from '../../../features-new/credit-card/hooks';
import type { BurnRate, SavingRate, ExpenseDistribution, DistributionItem } from '../types';

// Helper to get current month data
const getCurrentMonthData = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { monthStart, monthEnd, now };
};

export function useMetrics() {
  const { currentMonthExpenses, currentMonthIncomes, expensesByCategory, expensesByPaymentMethod } = useTransactions();
  const { purchases } = usePurchases();

  // Calculate totals
  const totalExpenses = useMemo(() => {
    const expensesTotal = currentMonthExpenses.reduce((acc, exp) => acc + exp.value, 0);
    const purchasesTotal = purchases.reduce((acc, p) => acc + p.amount, 0);
    return expensesTotal + purchasesTotal;
  }, [currentMonthExpenses, purchases]);

  const totalIncome = useMemo(() => {
    return currentMonthIncomes.reduce((acc, inc) => acc + inc.value, 0);
  }, [currentMonthIncomes]);

  // Burn Rate calculation
  const burnRate = useMemo((): BurnRate => {
    const { now } = getCurrentMonthData();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const netExpenses = totalExpenses - totalIncome;
    const monthly = netExpenses;
    const daily = monthly / daysInMonth;
    const yearly = monthly * 12;

    return {
      monthly,
      daily,
      yearly,
      monthsUntilZero: null, // Would require savings balance
    };
  }, [totalExpenses, totalIncome]);

  // Saving Rate calculation
  const savingRate = useMemo((): SavingRate => {
    const savings = totalIncome - totalExpenses;
    const rate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return {
      rate,
      amount: savings,
      income: totalIncome,
      expenses: totalExpenses,
    };
  }, [totalExpenses, totalIncome]);

  // Expense distribution by category
  const expenseDistributionByCategory = useMemo((): DistributionItem[] => {
    const categoryMap = new Map<string, number>();

    // Add expenses
    currentMonthExpenses.forEach((exp) => {
      const current = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, current + exp.value);
    });

    // Add credit card purchases to shopping category
    const purchasesTotal = purchases.reduce((acc, p) => acc + p.amount, 0);
    if (purchasesTotal > 0) {
      const current = categoryMap.get('shopping') || 0;
      categoryMap.set('shopping', current + purchasesTotal);
    }

    const total = Array.from(categoryMap.values()).reduce((acc, val) => acc + val, 0);

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthExpenses, purchases]);

  // Expense distribution by payment method
  const expenseDistributionByPaymentMethod = useMemo((): DistributionItem[] => {
    const methodMap = new Map<string, number>();

    // Add expenses (direct payments)
    currentMonthExpenses.forEach((exp) => {
      if (exp.paymentMethod) {
        const current = methodMap.get(exp.paymentMethod) || 0;
        methodMap.set(exp.paymentMethod, current + exp.value);
      }
    });

    // Add credit card purchases
    const purchasesTotal = purchases.reduce((acc, p) => acc + p.amount, 0);
    if (purchasesTotal > 0) {
      methodMap.set('credit-card', purchasesTotal);
    }

    const total = Array.from(methodMap.values()).reduce((acc, val) => acc + val, 0);

    return Array.from(methodMap.entries())
      .map(([method, amount]) => ({
        category: method,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthExpenses, purchases]);

  // Complete expense distribution
  const expenseDistribution: ExpenseDistribution = useMemo(() => ({
    byCategory: expenseDistributionByCategory,
    byPaymentMethod: expenseDistributionByPaymentMethod,
    total: totalExpenses,
  }), [expenseDistributionByCategory, expenseDistributionByPaymentMethod, totalExpenses]);

  return {
    burnRate,
    savingRate,
    expenseDistribution,
    totalExpenses,
    totalIncome,
  };
}

