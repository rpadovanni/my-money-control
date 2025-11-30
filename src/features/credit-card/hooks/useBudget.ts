import { useAtom, useAtomValue } from 'jotai';
import {
  monthlyBudgetsAtom,
  currentBudgetAtom,
  budgetRemainingAtom,
} from '../atoms';
import type { MonthlyBudget } from '../types';

export function useBudget() {
  const [budgets, setBudgets] = useAtom(monthlyBudgetsAtom);
  const currentBudget = useAtomValue(currentBudgetAtom);
  const budgetRemaining = useAtomValue(budgetRemainingAtom);

  const setBudget = (budget: MonthlyBudget) => {
    setBudgets((prev) => {
      const index = prev.findIndex(
        (b) => b.month === budget.month && b.year === budget.year
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = budget;
        return updated;
      }
      return [...prev, budget];
    });
  };

  const updateBudgetSpent = (amount: number) => {
    if (!currentBudget) return;
    setBudget({
      ...currentBudget,
      spent: currentBudget.spent + amount,
    });
  };

  return {
    budgets,
    currentBudget,
    budgetRemaining,
    setBudget,
    updateBudgetSpent,
  };
}

