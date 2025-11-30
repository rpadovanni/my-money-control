import type { Expense } from './types';

// Utility functions for expenses feature

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function sortExpensesByDate(expenses: Expense[], order: 'asc' | 'desc' = 'desc'): Expense[] {
  return [...expenses].sort((a, b) => {
    const timeA = a.date.getTime();
    const timeB = b.date.getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

/**
 * Converte string formatada (ex: "1.234,56") para número
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  // Remove tudo exceto números e vírgula
  const cleaned = value.replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para parseFloat
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}

/**
 * Formata número para string de moeda brasileira (ex: "1.234,56")
 */
export function formatCurrencyInput(value: number | string): string {
  if (value === '' || value === null || value === undefined) return '';
  
  const numValue = typeof value === 'string' ? parseCurrency(value) : value;
  if (isNaN(numValue)) return '';
  
  // Formata com 2 casas decimais
  const formatted = numValue.toFixed(2);
  // Substitui ponto por vírgula
  return formatted.replace('.', ',');
}

/**
 * Formata string digitada para moeda brasileira enquanto digita
 * Exemplo: "1" -> "0,01", "10" -> "0,10", "100" -> "1,00"
 */
export function formatCurrencyWhileTyping(value: string): string {
  if (!value) return '';
  
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  // Converte para número e divide por 100 para ter centavos
  const numValue = parseInt(numbers, 10) / 100;
  
  // Formata com 2 casas decimais, sempre mostrando vírgula
  const parts = numValue.toFixed(2).split('.');
  return `${parts[0]},${parts[1]}`;
}

/**
 * Converte valor formatado (ex: "1,50") para número
 */
export function parseCurrencyFormatted(value: string): number {
  if (!value) return 0;
  // Remove espaços e formatação, mantém apenas números e vírgula
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  const numValue = parseFloat(cleaned);
  return isNaN(numValue) ? 0 : numValue;
}

