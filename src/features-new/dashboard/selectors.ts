import { atom } from 'jotai';
import { totalMonthlyIncomesAtom, totalMonthlyExpensesAtom } from '../metrics';
import { savingRateAtom } from '../metrics';
import type { DashboardSummary } from './types';

// Dashboard summary
export const dashboardSummaryAtom = atom((get): DashboardSummary => {
  const totalIncome = get(totalMonthlyIncomesAtom);
  const totalExpenses = get(totalMonthlyExpensesAtom);
  const savingRate = get(savingRateAtom);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    savingRate: savingRate.rate,
  };
});

