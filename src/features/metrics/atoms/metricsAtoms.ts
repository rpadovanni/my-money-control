import { atom } from 'jotai';
import type { BurnRate, SavingRate, ExpenseDistribution, DistributionItem } from '../types';
import { useStore } from '@/shared/store';
// Note: These atoms now need to be computed from the Zustand store
// For now, keeping the structure but we'll need to refactor useMetrics to use the store directly

// Helper to get current month data
const getCurrentMonthData = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { monthStart, monthEnd, now };
};

// Total expenses for current month (including credit card and fixed costs)
export const currentMonthTotalExpensesAtom = atom((get) => {
  const expenses = get(expensesAtom);
  const purchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom);
  const { monthStart, monthEnd } = getCurrentMonthData();

  // Direct expenses
  const monthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate >= monthStart && expDate <= monthEnd;
  });
  const expensesTotal = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

  return expensesTotal + purchases + fixedCosts;
});

// Total income for current month
export const currentMonthTotalIncomeAtom = atom((get) => {
  const incomes = get(incomesAtom);
  const { monthStart, monthEnd } = getCurrentMonthData();

  const monthIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return incomeDate >= monthStart && incomeDate <= monthEnd;
  });

  return monthIncomes.reduce((acc, income) => acc + income.value, 0);
});

// Burn Rate calculation
export const burnRateAtom = atom((get): BurnRate => {
  const totalExpenses = get(currentMonthTotalExpensesAtom);
  const totalIncome = get(currentMonthTotalIncomeAtom);
  const { now } = getCurrentMonthData();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const netExpenses = totalExpenses - totalIncome;
  const monthly = netExpenses;
  const daily = monthly / daysInMonth;
  const yearly = monthly * 12;

  // Calculate months until zero (if expenses > income)
  let monthsUntilZero: number | null = null;
  if (netExpenses > 0) {
    // This would require knowing current savings/balance
    // For now, return null as we don't have that data
    monthsUntilZero = null;
  }

  return {
    monthly,
    daily,
    yearly,
    monthsUntilZero,
  };
});

// Saving Rate calculation
export const savingRateAtom = atom((get): SavingRate => {
  const totalIncome = get(currentMonthTotalIncomeAtom);
  const totalExpenses = get(currentMonthTotalExpensesAtom);

  const savings = totalIncome - totalExpenses;
  const rate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return {
    rate,
    amount: savings,
    income: totalIncome,
    expenses: totalExpenses,
  };
});

// Expense distribution by category
export const expenseDistributionByCategoryAtom = atom((get): DistributionItem[] => {
  const expenses = get(expensesAtom);
  const purchases = get(totalCurrentMonthPurchasesAtom);
  const { monthStart, monthEnd } = getCurrentMonthData();

  const categoryMap = new Map<string, number>();

  // Add expenses
  expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    })
    .forEach((exp) => {
      const current = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, current + exp.value);
    });

  // Add credit card purchases to shopping category
  if (purchases > 0) {
    const current = categoryMap.get('shopping') || 0;
    categoryMap.set('shopping', current + purchases);
  }

  const total = Array.from(categoryMap.values()).reduce((acc, val) => acc + val, 0);

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});

// Expense distribution by payment method
export const expenseDistributionByPaymentMethodAtom = atom((get): DistributionItem[] => {
  const expenses = get(expensesAtom);
  const purchases = get(totalCurrentMonthPurchasesAtom);
  const { monthStart, monthEnd } = getCurrentMonthData();

  const methodMap = new Map<string, number>();

  // Add expenses (direct payments)
  expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    })
    .forEach((exp) => {
      if (exp.paymentMethod) {
        const current = methodMap.get(exp.paymentMethod) || 0;
        methodMap.set(exp.paymentMethod, current + exp.value);
      }
    });

  // Add credit card purchases
  if (purchases > 0) {
    methodMap.set('credit-card', purchases);
  }

  const total = Array.from(methodMap.values()).reduce((acc, val) => acc + val, 0);

  return Array.from(methodMap.entries())
    .map(([method, amount]) => ({
      category: method,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});

// Complete expense distribution
export const expenseDistributionAtom = atom((get): ExpenseDistribution => {
  const byCategory = get(expenseDistributionByCategoryAtom);
  const byPaymentMethod = get(expenseDistributionByPaymentMethodAtom);
  const total = get(currentMonthTotalExpensesAtom);

  return {
    byCategory,
    byPaymentMethod,
    total,
  };
});

