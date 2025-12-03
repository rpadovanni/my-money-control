import { useAtom, useAtomValue } from 'jotai';
import { fixedCostsAtom } from './atoms';
import { activeFixedCostsAtom, totalFixedCostsAtom } from './selectors';
import type { FixedCost, FixedCostFormData } from './types';

export function useFixedCosts() {
  const [fixedCosts, setFixedCosts] = useAtom(fixedCostsAtom);
  const activeFixedCosts = useAtomValue(activeFixedCostsAtom);
  const totalFixedCosts = useAtomValue(totalFixedCostsAtom);

  const addFixedCost = (data: FixedCostFormData) => {
    const newCost: FixedCost = {
      id: crypto.randomUUID(),
      ...data,
    };
    setFixedCosts((prev) => [...prev, newCost]);
    return newCost;
  };

  const updateFixedCost = (id: string, data: Partial<FixedCost>) => {
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
    totalFixedCosts,
    addFixedCost,
    updateFixedCost,
    deleteFixedCost,
  };
}
