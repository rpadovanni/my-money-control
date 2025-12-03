import type { Income } from '../types';
import { calculateMonthlyIncome } from '../utils';

/**
 * Calcula a receita total recebida de um mês específico
 * Útil para integração com orçamento
 */
export function getReceivedIncomeForMonth(
  incomes: Income[],
  month: number,
  year: number
): number {
  const { received } = calculateMonthlyIncome(incomes, month, year);
  return received;
}

/**
 * Calcula a receita total prevista de um mês específico
 * Útil para sugerir limite de orçamento
 */
export function getTotalIncomeForMonth(
  incomes: Income[],
  month: number,
  year: number
): number {
  const { total } = calculateMonthlyIncome(incomes, month, year);
  return total;
}

