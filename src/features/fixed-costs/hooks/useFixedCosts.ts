import { useAtom, useAtomValue } from 'jotai';
import {
  fixedCostsAtom,
  activeFixedCostsAtom,
  inactiveFixedCostsAtom,
  fixedCostsByTypeAtom,
  totalFixedCostsAtom,
  fixedCostsByTypeTotalAtom,
} from '../atoms';
import type { FixedCost, FixedCostFormData } from '../types';
import { sortFixedCostsByDueDay } from '../utils';
import { useBudget } from '../../credit-card/hooks/useBudget';

export function useFixedCosts() {
  const [fixedCosts, setFixedCosts] = useAtom(fixedCostsAtom);
  const activeFixedCosts = useAtomValue(activeFixedCostsAtom);
  const inactiveFixedCosts = useAtomValue(inactiveFixedCostsAtom);
  const fixedCostsByType = useAtomValue(fixedCostsByTypeAtom);
  const totalFixedCosts = useAtomValue(totalFixedCostsAtom);
  const fixedCostsByTypeTotal = useAtomValue(fixedCostsByTypeTotalAtom);
  const { setBudget } = useBudget();

  const sortedFixedCosts = sortFixedCostsByDueDay(fixedCosts);

  const addFixedCost = (data: FixedCostFormData) => {
    const newFixedCost: FixedCost = {
      id: crypto.randomUUID(),
      ...data,
    };
    
    setFixedCosts((prev) => [...prev, newFixedCost]);
    
    // Update budget if cost is active
    if (newFixedCost.active) {
      try {
        // Budget update can be done manually by user
        // This is just a placeholder for future integration
      } catch (error) {
        console.warn('Error updating budget:', error);
      }
    }
    
    return newFixedCost;
  };

  const updateFixedCost = (id: string, data: Partial<FixedCostFormData>) => {
    setFixedCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, ...data } : cost))
    );
  };

  const deleteFixedCost = (id: string) => {
    setFixedCosts((prev) => prev.filter((cost) => cost.id !== id));
  };

  const toggleActive = (id: string) => {
    setFixedCosts((prev) =>
      prev.map((cost) => (cost.id === id ? { ...cost, active: !cost.active } : cost))
    );
  };

  return {
    fixedCosts: sortedFixedCosts,
    activeFixedCosts,
    inactiveFixedCosts,
    fixedCostsByType,
    totalFixedCosts,
    fixedCostsByTypeTotal,
    addFixedCost,
    updateFixedCost,
    deleteFixedCost,
    toggleActive,
  };
}

