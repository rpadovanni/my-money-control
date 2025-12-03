import { useAtomValue } from 'jotai';
import {
  burnRateAtom,
  savingRateAtom,
  expenseDistributionAtom,
  totalMonthlyExpensesAtom,
  totalMonthlyIncomesAtom,
} from './selectors';

export function useMetrics() {
  const burnRate = useAtomValue(burnRateAtom);
  const savingRate = useAtomValue(savingRateAtom);
  const expenseDistribution = useAtomValue(expenseDistributionAtom);
  const totalExpenses = useAtomValue(totalMonthlyExpensesAtom);
  const totalIncome = useAtomValue(totalMonthlyIncomesAtom);

  return {
    burnRate,
    savingRate,
    expenseDistribution,
    totalExpenses,
    totalIncome,
  };
}

