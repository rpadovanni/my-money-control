import { useAtom, useAtomValue } from 'jotai';
import { categoryBudgetsAtom } from './atoms';
import {
  currentMonthBudgetsAtom,
  totalBudgetLimitAtom,
  totalSpendingByCategoryAtom,
  getBudgetForCategoryAtom,
  getBudgetSummaryAtom,
  getBudgetWarningsAtom,
} from './selectors';
import type { CategoryBudget, CategoryBudgetFormData } from './types';

export function useBudget() {
  const [budgets, setBudgets] = useAtom(categoryBudgetsAtom);
  const currentMonthBudgets = useAtomValue(currentMonthBudgetsAtom);
  const totalBudgetLimit = useAtomValue(totalBudgetLimitAtom);
  const totalSpendingByCategory = useAtomValue(totalSpendingByCategoryAtom);
  const budgetSummary = useAtomValue(getBudgetSummaryAtom);
  const budgetWarnings = useAtomValue(getBudgetWarningsAtom);

  const addBudget = (data: CategoryBudgetFormData) => {
    // Check if budget already exists for this category/month/year
    const exists = budgets.some(
      (b) =>
        b.category === data.category &&
        b.month === data.month &&
        b.year === data.year
    );

    if (exists) {
      // Update existing instead of creating duplicate
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === data.category &&
          budget.month === data.month &&
          budget.year === data.year
            ? { ...budget, limit: data.limit }
            : budget
        )
      );
      return budgets.find(
        (b) =>
          b.category === data.category &&
          b.month === data.month &&
          b.year === data.year
      )!;
    }

    const newBudget: CategoryBudget = {
      id: crypto.randomUUID(),
      ...data,
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id: string, data: Partial<CategoryBudgetFormData>) => {
    setBudgets((prev) =>
      prev.map((budget) => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  // Helper to get budget for category (returns atom for useAtomValue)
  const getBudgetForCategory = (category: string) => {
    return getBudgetForCategoryAtom(category as any);
  };

  return {
    budgets,
    currentMonthBudgets,
    totalBudgetLimit,
    totalSpendingByCategory,
    budgetSummary,
    budgetWarnings,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetForCategory,
  };
}
