import type { CategoryBudget, BudgetStatus, BudgetSimulation, BudgetAlert } from './types';
import type { TransactionCategory } from '../../features-new/transactions/types';
import { TRANSACTION_CATEGORIES } from '../../features-new/transactions/types';

// Use expense categories from transactions
type ExpenseCategory = Extract<
  TransactionCategory,
  'food' | 'transport' | 'entertainment' | 'health' | 'education' | 'shopping' | 'bills' | 'travel' | 'personal' | 'other'
>;

const EXPENSE_CATEGORIES: Record<ExpenseCategory, string> = {
  food: TRANSACTION_CATEGORIES.food,
  transport: TRANSACTION_CATEGORIES.transport,
  entertainment: TRANSACTION_CATEGORIES.entertainment,
  health: TRANSACTION_CATEGORIES.health,
  education: TRANSACTION_CATEGORIES.education,
  shopping: TRANSACTION_CATEGORIES.shopping,
  bills: TRANSACTION_CATEGORIES.bills,
  travel: TRANSACTION_CATEGORIES.travel,
  personal: TRANSACTION_CATEGORIES.personal,
  other: TRANSACTION_CATEGORIES.other,
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCurrencyWhileTyping(value: string): string {
  if (!value) return '';
  
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  const numValue = parseInt(numbers, 10) / 100;
  const parts = numValue.toFixed(2).split('.');
  return `${parts[0]},${parts[1]}`;
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function calculateBudgetStatus(
  category: ExpenseCategory,
  limit: number,
  spent: number
): BudgetStatus {
  const remaining = limit - spent;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const isExceeded = spent > limit;
  const isWarning = percentage >= 80 && !isExceeded;

  return {
    category,
    limit,
    spent,
    remaining,
    percentage,
    isExceeded,
    isWarning,
  };
}

export function calculateBudgetSimulation(
  budgets: CategoryBudget[],
  spendingByCategory: Record<ExpenseCategory, number>,
  month: number,
  year: number
): BudgetSimulation {
  const monthBudgets = budgets.filter(
    (budget) => budget.month === month && budget.year === year
  );

  const categories: BudgetStatus[] = monthBudgets.map((budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    return calculateBudgetStatus(budget.category, budget.limit, spent);
  });

  const totalLimit = monthBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const projectedSpending = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  const remaining = totalLimit - projectedSpending;
  const isExceeded = projectedSpending > totalLimit;
  const warnings = categories.filter((status) => status.isWarning || status.isExceeded);

  return {
    month,
    year,
    totalLimit,
    projectedSpending,
    remaining,
    categories,
    isExceeded,
    warnings,
  };
}

export function generateBudgetAlerts(simulation: BudgetSimulation): BudgetAlert[] {
  const alerts: BudgetAlert[] = [];

  simulation.categories.forEach((status) => {
    if (status.isExceeded) {
      alerts.push({
        category: status.category,
        type: 'exceeded',
        message: `${EXPENSE_CATEGORIES[status.category]} excedeu o limite em ${formatCurrency(Math.abs(status.remaining))}`,
        amount: status.spent,
        limit: status.limit,
      });
    } else if (status.isWarning) {
      alerts.push({
        category: status.category,
        type: 'warning',
        message: `${EXPENSE_CATEGORIES[status.category]} está em ${status.percentage.toFixed(1)}% do limite`,
        amount: status.spent,
        limit: status.limit,
      });
    }
  });

  return alerts;
}

export function getCurrentMonth(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

