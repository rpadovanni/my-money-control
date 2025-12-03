import { atom } from 'jotai';
import {
  currentMonthExpensesTotalAtom,
  currentMonthIncomesTotalAtom,
  expensesByMonthAtom,
  expensesByCategoryAtom,
} from '../transactions/selectors';
import { totalCurrentMonthPurchasesAtom } from '../credit-card/selectors';
import { getMonthlyFixedCostsAtom } from '../fixed-costs/selectors';
import { getBudgetSummaryAtom } from '../budget/selectors';
import { totalMonthlyExpensesAtom } from '../metrics/selectors';

/**
 * Total gasto no mês (transactions + credit-card + fixed-costs)
 */
export const totalMonthlySpendingAtom = atom((get) => {
  return get(totalMonthlyExpensesAtom);
});

/**
 * Total receitas no mês
 */
export const totalMonthlyIncomeAtom = atom((get) => {
  return get(currentMonthIncomesTotalAtom);
});

/**
 * Saldo (receitas - despesas)
 */
export const monthlyBalanceAtom = atom((get) => {
  const income = get(totalMonthlyIncomeAtom);
  const expenses = get(totalMonthlySpendingAtom);
  return income - expenses;
});

/**
 * Gastos no cartão no mês atual
 */
export const creditCardSpendingAtom = atom((get) => {
  return get(totalCurrentMonthPurchasesAtom);
});

/**
 * Orçamento restante (total do orçamento - gastos)
 */
export const remainingBudgetAtom = atom((get) => {
  const budgetSummary = get(getBudgetSummaryAtom);
  return budgetSummary.totalRemaining;
});

/**
 * Monthly spending data (last 6 months)
 * Combines transactions, credit-card, and fixed-costs
 */
export const monthlySpendingChartAtom = atom((get) => {
  const expensesByMonth = get(expensesByMonthAtom);
  const now = new Date();
  const months: Array<{ month: number; year: number; monthName: string; total: number }> = [];

  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
    months.push({
      month,
      year,
      monthName: monthNames[month - 1],
      total: expensesByMonth[monthKey] || 0,
    });
  }

  return months;
});

/**
 * Distribution by category for chart
 */
export const categoryDistributionChartAtom = atom((get) => {
  const expensesByCategory = get(expensesByCategoryAtom);
  const totalPurchases = get(totalCurrentMonthPurchasesAtom);
  const fixedCosts = get(getMonthlyFixedCostsAtom);

  // Combine all sources
  const distribution: Record<string, number> = { ...expensesByCategory };

  // Add credit card purchases to shopping category
  if (totalPurchases > 0) {
    distribution['shopping'] = (distribution['shopping'] || 0) + totalPurchases;
  }

  // Add fixed costs to bills category
  if (fixedCosts > 0) {
    distribution['bills'] = (distribution['bills'] || 0) + fixedCosts;
  }

  // Calculate total and percentages
  const total = Object.values(distribution).reduce((acc, val) => acc + val, 0);

  return Object.entries(distribution)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});
