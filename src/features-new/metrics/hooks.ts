import { useAtomValue } from 'jotai';
import {
  burnRateAtom,
  savingRateAtom,
  totalMonthlyExpensesAtom,
  totalMonthlyIncomesAtom,
  distributionByCategoryAtom,
} from './selectors';

export function useMetrics() {
  const burnRate = useAtomValue(burnRateAtom);
  const savingRate = useAtomValue(savingRateAtom);
  const totalMonthlyExpenses = useAtomValue(totalMonthlyExpensesAtom);
  const totalMonthlyIncomes = useAtomValue(totalMonthlyIncomesAtom);
  const distributionByCategory = useAtomValue(distributionByCategoryAtom);

  return {
    burnRate,
    savingRate,
    totalMonthlyExpenses,
    totalMonthlyIncomes,
    distributionByCategory,
  };
}
