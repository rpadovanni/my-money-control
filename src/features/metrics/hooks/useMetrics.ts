import { useAtomValue } from 'jotai';
import {
  burnRateAtom,
  savingRateAtom,
  expenseDistributionAtom,
  currentMonthTotalExpensesAtom,
  currentMonthTotalIncomeAtom,
} from '../atoms';

export function useMetrics() {
  const burnRate = useAtomValue(burnRateAtom);
  const savingRate = useAtomValue(savingRateAtom);
  const expenseDistribution = useAtomValue(expenseDistributionAtom);
  const totalExpenses = useAtomValue(currentMonthTotalExpensesAtom);
  const totalIncome = useAtomValue(currentMonthTotalIncomeAtom);

  return {
    burnRate,
    savingRate,
    expenseDistribution,
    totalExpenses,
    totalIncome,
  };
}

