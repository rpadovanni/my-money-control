import type { Transaction } from '@/shared/store/types/transactions';
import { formatCurrency, formatDate } from '@/shared/utils';

export { formatCurrency, formatDate };

export function sortTransactionsByDate(
  transactions: Transaction[],
  order: 'asc' | 'desc' = 'desc'
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
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

