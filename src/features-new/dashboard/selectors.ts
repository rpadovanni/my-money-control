import { atom } from 'jotai';
import {
  currentMonthExpensesTotalAtom,
  currentMonthIncomesTotalAtom,
  expensesByMonthAtom,
} from '../transactions';
import { totalCurrentMonthPurchasesAtom } from '../credit-card';
import { totalFixedCostsAtom } from '../fixed-costs';
import { savingRateAtom } from '../metrics';
import type { DashboardSummary } from './types';

// Dashboard summary
export const dashboardSummaryAtom = atom((get): DashboardSummary => {
  const totalIncome = get(currentMonthIncomesTotalAtom);
  const transactionsExpenses = get(currentMonthExpensesTotalAtom);
  const creditCardPurchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(totalFixedCostsAtom);
  const savingRate = get(savingRateAtom);

  const totalExpenses = transactionsExpenses + creditCardPurchases + fixedCosts;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    savingRate: savingRate.rate,
  };
});

// Monthly spending data (last 6 months)
export const monthlySpendingAtom = atom((get) => {
  const expensesByMonth = get(expensesByMonthAtom);
  const now = new Date();
  const months: Array<{ month: number; year: number; total: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
    months.push({
      month,
      year,
      total: expensesByMonth[monthKey] || 0,
    });
  }

  return months;
});
