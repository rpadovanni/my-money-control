import { useAtomValue } from 'jotai';
import { dashboardSummaryAtom, monthlySpendingAtom } from './selectors';

export function useDashboard() {
  const summary = useAtomValue(dashboardSummaryAtom);
  const monthlySpending = useAtomValue(monthlySpendingAtom);

  return {
    summary,
    monthlySpending,
  };
}
