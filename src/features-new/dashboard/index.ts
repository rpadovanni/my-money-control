// Public API - only hooks and components are exposed
export { default } from './Dashboard';
export { useDashboard } from './hooks';
export * from './components/DashboardSummary';
export * from './components/DashboardCharts';

// Selectors for other features to consume (if needed)
export {
  totalMonthlySpendingAtom,
  totalMonthlyIncomeAtom,
  monthlyBalanceAtom,
  creditCardSpendingAtom,
  remainingBudgetAtom,
  monthlySpendingChartAtom,
  categoryDistributionChartAtom,
} from './selectors';
