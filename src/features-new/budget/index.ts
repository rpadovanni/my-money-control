// Public API - only hooks and components are exposed
export { default } from './Budget';
export { useBudget } from './hooks';
export * from './types';
export * from './components/BudgetForm';
export * from './components/BudgetSummary';
export * from './components/BudgetWarnings';

// Selectors for other features to consume
export {
  currentMonthBudgetsAtom,
  totalBudgetLimitAtom,
  totalSpendingByCategoryAtom,
  getBudgetForCategoryAtom,
  getBudgetSummaryAtom,
  getBudgetWarningsAtom,
} from './selectors';
