import { atom } from 'jotai';
import {
  currentMonthExpensesTotalAtom,
  currentMonthIncomesTotalAtom,
  expensesByCategoryAtom,
} from '../transactions/selectors';
import { totalCurrentMonthPurchasesAtom } from '../credit-card/selectors';
import { getMonthlyFixedCostsAtom } from '../fixed-costs/selectors';
import type { BurnRate, SavingRate, DistributionItem } from './types';

/**
 * Total monthly expenses (transactions + credit-card + fixed-costs)
 */
export const totalMonthlyExpensesAtom = atom((get) => {
  const expenses = get(currentMonthExpensesTotalAtom);
  const purchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom);

  return expenses + purchases + fixedCosts;
});

/**
 * Total monthly income
 */
export const totalMonthlyIncomesAtom = atom((get) => {
  return get(currentMonthIncomesTotalAtom);
});

/**
 * Burn Rate calculation
 * Net expenses (expenses - income) per month, day, and year
 */
export const burnRateAtom = atom((get): BurnRate => {
  const totalExpenses = get(totalMonthlyExpensesAtom);
  const totalIncome = get(totalMonthlyIncomesAtom);

  const netExpenses = totalExpenses - totalIncome;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return {
    monthly: netExpenses,
    daily: netExpenses / daysInMonth,
    yearly: netExpenses * 12,
  };
});

/**
 * Saving Rate calculation
 * Percentage of income saved after expenses
 */
export const savingRateAtom = atom((get): SavingRate => {
  const totalIncome = get(totalMonthlyIncomesAtom);
  const totalExpenses = get(totalMonthlyExpensesAtom);

  const savings = totalIncome - totalExpenses;
  const rate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return {
    rate,
    amount: savings,
    income: totalIncome,
    expenses: totalExpenses,
  };
});

/**
 * Distribution by category
 * Combines expenses from transactions, credit-card, and fixed-costs
 */
export const distributionByCategoryAtom = atom((get): DistributionItem[] => {
  const expensesByCategory = get(expensesByCategoryAtom);
  const totalPurchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom);

  // Combine all sources
  const distribution: Record<string, number> = { ...expensesByCategory };

  // Add credit card purchases to shopping category
  if (totalPurchases > 0) {
    distribution['shopping'] = (distribution['shopping'] || 0) + totalPurchases;
  }

  // Add fixed costs to bills category
  if (fixedCosts > 0) {
    distribution['bills'] = (distribution['bills'] || 0) + fixedCosts;
  }

  // Calculate total and percentages
  const total = Object.values(distribution).reduce((acc, val) => acc + val, 0);

  return Object.entries(distribution)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});
