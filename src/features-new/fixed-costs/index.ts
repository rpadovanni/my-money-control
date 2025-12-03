// Public API - only hooks and components are exposed
export { default } from './FixedCosts';
export { useFixedCosts } from './hooks';
export * from './types';
export * from './components/FixedCostForm';
export * from './components/FixedCostsTable';

// Selectors for other features to consume
export {
  activeFixedCostsAtom,
  totalFixedCostsAtom,
  getMonthlyFixedCostsAtom,
  getActiveFixedCostsAtom,
} from './selectors';
