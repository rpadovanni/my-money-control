import { atom } from 'jotai';
import { categoryBudgetsAtom } from './atoms';
import { expensesByCategoryAtom } from '../transactions/selectors';
import { getMonthlyFixedCostsAtom } from '../fixed-costs/selectors';
import { totalCurrentMonthPurchasesAtom } from '../credit-card/selectors';
import type { BudgetStatus, BudgetSummary, BudgetWarning, BudgetCategory } from './types';
import { TRANSACTION_CATEGORIES } from '../transactions/types';

// Current month budgets
export const currentMonthBudgetsAtom = atom((get) => {
  const budgets = get(categoryBudgetsAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  return budgets.filter((b) => b.month === month && b.year === year);
});

// Total budget limit
export const totalBudgetLimitAtom = atom((get) => {
  const budgets = get(currentMonthBudgetsAtom);
  return budgets.reduce((sum, budget) => sum + budget.limit, 0);
});

// Total spending by category (from transactions, credit-card, fixed-costs)
export const totalSpendingByCategoryAtom = atom((get) => {
  const expensesByCategory = get(expensesByCategoryAtom);
  const totalPurchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom);

  // Combine all sources
  const spending: Record<string, number> = { ...expensesByCategory };
  
  // Add credit card purchases to shopping category
  if (totalPurchases > 0) {
    spending['shopping'] = (spending['shopping'] || 0) + totalPurchases;
  }
  
  // Add fixed costs to bills category
  if (fixedCosts > 0) {
    spending['bills'] = (spending['bills'] || 0) + fixedCosts;
  }

  return spending;
});

/**
 * Get budget status for a specific category
 */
export const getBudgetForCategoryAtom = (category: BudgetCategory) =>
  atom((get): BudgetStatus | null => {
    const budgets = get(currentMonthBudgetsAtom);
    const spendingByCategory = get(totalSpendingByCategoryAtom);

    const budget = budgets.find((b) => b.category === category);
    if (!budget) return null;

    const spent = spendingByCategory[category] || 0;
    const remaining = budget.limit - spent;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const isExceeded = spent > budget.limit;
    const isWarning = percentage >= 80 && !isExceeded;

    return {
      category: budget.category,
      limit: budget.limit,
      spent,
      remaining,
      percentage,
      isExceeded,
      isWarning,
    };
  });

/**
 * Get complete budget summary for current month
 */
export const getBudgetSummaryAtom = atom((get): BudgetSummary => {
  const budgets = get(currentMonthBudgetsAtom);
  const spendingByCategory = get(totalSpendingByCategoryAtom);

  const categories: BudgetStatus[] = budgets.map((budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    const remaining = budget.limit - spent;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const isExceeded = spent > budget.limit;
    const isWarning = percentage >= 80 && !isExceeded;

    return {
      category: budget.category,
      limit: budget.limit,
      spent,
      remaining,
      percentage,
      isExceeded,
      isWarning,
    };
  });

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = totalLimit - totalSpent;
  const exceededCount = categories.filter((c) => c.isExceeded).length;
  const warningCount = categories.filter((c) => c.isWarning).length;

  return {
    totalLimit,
    totalSpent,
    totalRemaining,
    categories,
    exceededCount,
    warningCount,
  };
});

/**
 * Get budget warnings (exceeded and > 80%)
 */
export const getBudgetWarningsAtom = atom((get): BudgetWarning[] => {
  const summary = get(getBudgetSummaryAtom);
  const warnings: BudgetWarning[] = [];

  summary.categories.forEach((status) => {
    if (status.isExceeded) {
      warnings.push({
        category: status.category,
        type: 'exceeded',
        message: `${TRANSACTION_CATEGORIES[status.category]} excedeu o limite em R$ ${Math.abs(status.remaining).toFixed(2).replace('.', ',')}`,
        limit: status.limit,
        spent: status.spent,
        percentage: status.percentage,
      });
    } else if (status.isWarning) {
      warnings.push({
        category: status.category,
        type: 'warning',
        message: `${TRANSACTION_CATEGORIES[status.category]} está em ${status.percentage.toFixed(1)}% do limite`,
        limit: status.limit,
        spent: status.spent,
        percentage: status.percentage,
      });
    }
  });

  return warnings.sort((a, b) => {
    // Sort by type (exceeded first) then by percentage
    if (a.type !== b.type) {
      return a.type === 'exceeded' ? -1 : 1;
    }
    return b.percentage - a.percentage;
  });
});
