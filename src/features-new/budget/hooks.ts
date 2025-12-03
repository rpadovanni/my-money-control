import { useAtom, useAtomValue } from 'jotai';
import { categoryBudgetsAtom } from './atoms';
import { currentMonthBudgetsAtom, totalBudgetLimitAtom, totalSpendingByCategoryAtom } from './selectors';
import type { CategoryBudget, CategoryBudgetFormData } from './types';

export function useBudget() {
  const [budgets, setBudgets] = useAtom(categoryBudgetsAtom);
  const currentMonthBudgets = useAtomValue(currentMonthBudgetsAtom);
  const totalBudgetLimit = useAtomValue(totalBudgetLimitAtom);
  const totalSpendingByCategory = useAtomValue(totalSpendingByCategoryAtom);

  const addBudget = (data: CategoryBudgetFormData) => {
    const newBudget: CategoryBudget = {
      id: crypto.randomUUID(),
      ...data,
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id: string, data: Partial<CategoryBudget>) => {
    setBudgets((prev) =>
      prev.map((budget) => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  return {
    budgets,
    currentMonthBudgets,
    totalBudgetLimit,
    totalSpendingByCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

