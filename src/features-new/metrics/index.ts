// Public API - only hooks and components are exposed
export { default } from './Metrics';
export { useMetrics } from './hooks';
export * from './types';
export * from './components/MetricCard';
export * from './components/BurnRateCard';
export * from './components/SavingRateCard';
export * from './components/CategoryDistributionChart';

// Selectors for other features to consume
export {
  burnRateAtom,
  savingRateAtom,
  totalMonthlyExpensesAtom,
  totalMonthlyIncomesAtom,
  distributionByCategoryAtom,
} from './selectors';
