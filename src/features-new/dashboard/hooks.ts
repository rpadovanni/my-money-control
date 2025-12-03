import { useAtomValue } from 'jotai';
import {
  totalMonthlySpendingAtom,
  totalMonthlyIncomeAtom,
  monthlyBalanceAtom,
  creditCardSpendingAtom,
  remainingBudgetAtom,
  monthlySpendingChartAtom,
  categoryDistributionChartAtom,
} from './selectors';

export function useDashboard() {
  const totalMonthlySpending = useAtomValue(totalMonthlySpendingAtom);
  const totalMonthlyIncome = useAtomValue(totalMonthlyIncomeAtom);
  const monthlyBalance = useAtomValue(monthlyBalanceAtom);
  const creditCardSpending = useAtomValue(creditCardSpendingAtom);
  const remainingBudget = useAtomValue(remainingBudgetAtom);
  const monthlySpendingChart = useAtomValue(monthlySpendingChartAtom);
  const categoryDistributionChart = useAtomValue(categoryDistributionChartAtom);

  return {
    totalMonthlySpending,
    totalMonthlyIncome,
    monthlyBalance,
    creditCardSpending,
    remainingBudget,
    monthlySpendingChart,
    categoryDistributionChart,
  };
}
