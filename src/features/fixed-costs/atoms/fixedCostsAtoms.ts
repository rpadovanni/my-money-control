import { atom } from 'jotai';
import type { FixedCost } from '../types';

// Base atoms for fixed costs
export const fixedCostsAtom = atom<FixedCost[]>([]);

// Derived atoms for fixed costs
export const activeFixedCostsAtom = atom((get) => {
  const costs = get(fixedCostsAtom);
  return costs.filter((cost) => cost.active);
});

export const inactiveFixedCostsAtom = atom((get) => {
  const costs = get(fixedCostsAtom);
  return costs.filter((cost) => !cost.active);
});

export const fixedCostsByTypeAtom = atom((get) => {
  const costs = get(fixedCostsAtom);
  return {
    housing: costs.filter((cost) => cost.type === 'housing'),
    health: costs.filter((cost) => cost.type === 'health'),
    subscriptions: costs.filter((cost) => cost.type === 'subscriptions'),
  };
});

export const totalFixedCostsAtom = atom((get) => {
  const costs = get(activeFixedCostsAtom);
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
});

export const fixedCostsByTypeTotalAtom = atom((get) => {
  const costs = get(activeFixedCostsAtom);
  return {
    housing: costs
      .filter((cost) => cost.type === 'housing')
      .reduce((sum, cost) => sum + cost.amount, 0),
    health: costs
      .filter((cost) => cost.type === 'health')
      .reduce((sum, cost) => sum + cost.amount, 0),
    subscriptions: costs
      .filter((cost) => cost.type === 'subscriptions')
      .reduce((sum, cost) => sum + cost.amount, 0),
  };
});

