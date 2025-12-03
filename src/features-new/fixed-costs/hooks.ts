import { useAtom, useAtomValue } from 'jotai';
import { fixedCostsAtom } from './atoms';
import {
  activeFixedCostsAtom,
  totalFixedCostsAtom,
  getMonthlyFixedCostsAtom,
  getActiveFixedCostsAtom,
} from './selectors';
import type { FixedCost, FixedCostFormData } from './types';

export function useFixedCosts() {
  const [fixedCosts, setFixedCosts] = useAtom(fixedCostsAtom);
  const activeFixedCosts = useAtomValue(activeFixedCostsAtom);
  const totalFixedCosts = useAtomValue(totalFixedCostsAtom);
  const monthlyFixedCosts = useAtomValue(getMonthlyFixedCostsAtom);
  const activeFixedCostsList = useAtomValue(getActiveFixedCostsAtom);

  const addFixedCost = (data: FixedCostFormData) => {
    const newCost: FixedCost = {
      id: crypto.randomUUID(),
      ...data,
    };
    setFixedCosts((prev) => [...prev, newCost]);
    return newCost;
  };

  const updateFixedCost = (id: string, data: Partial<FixedCostFormData>) => {
    setFixedCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, ...data } : cost))
    );
  };

  const deleteFixedCost = (id: string) => {
    setFixedCosts((prev) => prev.filter((cost) => cost.id !== id));
  };

  return {
    fixedCosts,
    activeFixedCosts,
    activeFixedCostsList,
    totalFixedCosts,
    monthlyFixedCosts,
    addFixedCost,
    updateFixedCost,
    deleteFixedCost,
  };
}
