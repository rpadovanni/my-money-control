import { atom } from 'jotai';
import { fixedCostsAtom } from './atoms';

export const activeFixedCostsAtom = atom((get) => {
  const costs = get(fixedCostsAtom);
  return costs.filter((cost) => cost.active);
});

export const totalFixedCostsAtom = atom((get) => {
  const costs = get(activeFixedCostsAtom);
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
});
