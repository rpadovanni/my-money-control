import type { FixedCost, FixedCostSummary, FixedCostType } from './types';

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

export function calculateSummary(costs: FixedCost[]): FixedCostSummary {
  const activeCosts = costs.filter((cost) => cost.active);
  
  const total = activeCosts.reduce((sum, cost) => sum + cost.amount, 0);
  
  const byType: Record<FixedCostType, number> = {
    housing: 0,
    health: 0,
    subscriptions: 0,
  };
  
  activeCosts.forEach((cost) => {
    byType[cost.type] += cost.amount;
  });
  
  return {
    total,
    byType,
    activeCount: activeCosts.length,
    inactiveCount: costs.length - activeCosts.length,
  };
}

export function getMonthlyTotal(costs: FixedCost[]): number {
  return costs
    .filter((cost) => cost.active)
    .reduce((sum, cost) => sum + cost.amount, 0);
}

export function sortFixedCostsByDueDay(costs: FixedCost[]): FixedCost[] {
  return [...costs].sort((a, b) => {
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }
    return a.dueDay - b.dueDay;
  });
}

