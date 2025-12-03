import { format } from 'date-fns';
import type { Income } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

export function formatCurrencyWhileTyping(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para número e divide por 100 (centavos)
  const numericValue = parseInt(numbers, 10) / 100;
  
  // Formata como moeda
  return formatCurrency(numericValue);
}

export function getCurrentMonth(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

export function getMonthKey(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function calculateMonthlyIncome(incomes: Income[], month: number, year: number): {
  fixed: number;
  variable: number;
  total: number;
  received: number;
  pending: number;
} {
  const monthIncomes = incomes.filter(
    (income) => income.month === month && income.year === year
  );

  const fixed = monthIncomes
    .filter((income) => income.type === 'fixed')
    .reduce((sum, income) => sum + income.amount, 0);

  const variable = monthIncomes
    .filter((income) => income.type === 'variable')
    .reduce((sum, income) => sum + income.amount, 0);

  const received = monthIncomes
    .filter((income) => income.received)
    .reduce((sum, income) => sum + income.amount, 0);

  const total = fixed + variable;
  const pending = total - received;

  return { fixed, variable, total, received, pending };
}

