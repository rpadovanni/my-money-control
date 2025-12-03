import { useAtom, useAtomValue } from 'jotai';
import { categoryBudgetsAtom, currentMonthBudgetsAtom, totalBudgetLimitAtom } from '../atoms';
import type { CategoryBudget, CategoryBudgetFormData, BudgetSimulation, BudgetAlert, ExpenseCategory } from '../types';
import { calculateBudgetSimulation, generateBudgetAlerts, getCurrentMonth } from '../utils';
import { useTransactions } from '../../features-new/transactions/hooks';
import { useFixedCosts } from '../../fixed-costs/hooks';
import { useHealth } from '../../health/hooks';

export function useBudgets() {
  const [categoryBudgets, setCategoryBudgets] = useAtom(categoryBudgetsAtom);
  const currentMonthBudgets = useAtomValue(currentMonthBudgetsAtom);
  const totalBudgetLimit = useAtomValue(totalBudgetLimitAtom);
  
  // Get spending from all features
  const { expensesByCategory } = useTransactions();
  const { totalFixedCosts } = useFixedCosts();
  const { totalRecurringExpenses, currentMonthConsultationsTotal, currentMonthMedicationsTotal } = useHealth();

  const { month, year } = getCurrentMonth();

  // Calculate total spending by category
  const getSpendingByCategory = (): Record<ExpenseCategory, number> => {
    const spending: Record<ExpenseCategory, number> = {
      food: (expensesByCategory['food'] as number) || 0,
      transport: (expensesByCategory['transport'] as number) || 0,
      entertainment: (expensesByCategory['entertainment'] as number) || 0,
      health: ((expensesByCategory['health'] as number) || 0) + totalRecurringExpenses + currentMonthConsultationsTotal + currentMonthMedicationsTotal,
      education: (expensesByCategory['education'] as number) || 0,
      shopping: (expensesByCategory['shopping'] as number) || 0,
      bills: ((expensesByCategory['bills'] as number) || 0) + totalFixedCosts,
      travel: (expensesByCategory['travel'] as number) || 0,
      personal: (expensesByCategory['personal'] as number) || 0,
      other: (expensesByCategory['other'] as number) || 0,
    };
    return spending;
  };

  const addCategoryBudget = (data: CategoryBudgetFormData) => {
    const newBudget: CategoryBudget = {
      id: crypto.randomUUID(),
      ...data,
    };
    setCategoryBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateCategoryBudget = (id: string, data: Partial<CategoryBudgetFormData>) => {
    setCategoryBudgets((prev) =>
      prev.map((budget) => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  const deleteCategoryBudget = (id: string) => {
    setCategoryBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  const getBudgetSimulation = (targetMonth?: number, targetYear?: number): BudgetSimulation => {
    const simulationMonth = targetMonth || month;
    const simulationYear = targetYear || year;
    const spendingByCategory = getSpendingByCategory();
    
    return calculateBudgetSimulation(
      categoryBudgets,
      spendingByCategory,
      simulationMonth,
      simulationYear
    );
  };

  const getBudgetAlerts = (): BudgetAlert[] => {
    const simulation = getBudgetSimulation();
    return generateBudgetAlerts(simulation);
  };

  return {
    categoryBudgets,
    currentMonthBudgets,
    totalBudgetLimit,
    addCategoryBudget,
    updateCategoryBudget,
    deleteCategoryBudget,
    getBudgetSimulation,
    getBudgetAlerts,
    getSpendingByCategory,
  };
}

