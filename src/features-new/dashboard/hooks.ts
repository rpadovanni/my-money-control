import { useAtomValue } from 'jotai';
import { dashboardSummaryAtom } from './selectors';

export function useDashboard() {
  const summary = useAtomValue(dashboardSummaryAtom);

  return {
    summary,
  };
}

