import { atom } from 'jotai';
import { fixedCostsAtom } from './atoms';
import type { FixedCost } from './types';

// Active fixed costs
export const activeFixedCostsAtom = atom((get) => {
  const costs = get(fixedCostsAtom);
  return costs.filter((cost) => cost.active);
});

// Total fixed costs (all active costs)
export const totalFixedCostsAtom = atom((get) => {
  const costs = get(activeFixedCostsAtom);
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
});

/**
 * Get monthly fixed costs
 * Calculates the monthly equivalent for all active fixed costs
 * (yearly costs are divided by 12)
 */
export const getMonthlyFixedCostsAtom = atom((get) => {
  const costs = get(activeFixedCostsAtom);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return costs.reduce((total, cost) => {
    if (cost.renewalCycle === 'monthly') {
      return total + cost.amount;
    } else {
      // Yearly cost divided by 12 for monthly equivalent
      return total + cost.amount / 12;
    }
  }, 0);
});

/**
 * Get active fixed costs (alias for activeFixedCostsAtom for consistency)
 */
export const getActiveFixedCostsAtom = atom((get): FixedCost[] => {
  return get(activeFixedCostsAtom);
});
