import { atom } from 'jotai';
import {
  currentMonthExpensesTotalAtom,
  currentMonthIncomesTotalAtom,
  expensesByCategoryAtom,
} from '../transactions';
import { totalCurrentMonthPurchasesAtom } from '../credit-card';
import { getMonthlyFixedCostsAtom } from '../fixed-costs';
import type { BurnRate, SavingRate, DistributionItem } from './types';

// Total current month expenses (transactions + credit-card + fixed-costs)
export const totalMonthlyExpensesAtom = atom((get) => {
  const expenses = get(currentMonthExpensesTotalAtom);
  const purchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom); // Use monthly equivalent

  return expenses + purchases + fixedCosts;
});

// Total current month income
export const totalMonthlyIncomesAtom = atom((get) => {
  return get(currentMonthIncomesTotalAtom);
});

// Burn Rate
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

// Saving Rate
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

// Expense distribution by category
export const expenseDistributionAtom = atom((get): DistributionItem[] => {
  const expensesByCategory = get(expensesByCategoryAtom);
  const total = Object.values(expensesByCategory).reduce((acc, val) => acc + val, 0);

  return Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});
