import { formatCurrency, formatDate } from '@/shared/utils';

export { formatCurrency, formatDate };

/**
 * Formata string digitada para moeda brasileira enquanto digita
 */
export function formatCurrencyWhileTyping(value: string): string {
  if (!value) return '';
  
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  const numValue = parseInt(numbers, 10) / 100;
  const parts = numValue.toFixed(2).split('.');
  return `${parts[0]},${parts[1]}`;
}
