import { atom } from 'jotai';
import { categoryBudgetsAtom } from './atoms';
import { expensesByCategoryAtom } from '../transactions';
import { getMonthlyFixedCostsAtom } from '../fixed-costs';
import { totalCurrentMonthPurchasesAtom } from '../credit-card';

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
  const fixedCosts = get(getMonthlyFixedCostsAtom); // Use monthly equivalent

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
