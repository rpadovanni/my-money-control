import type { Transaction } from '../transactions/types';
import type { Purchase, PurchaseFormData } from './types';

/**
 * Convert a Transaction to a Purchase
 */
export function transactionToPurchase(
  transaction: Transaction,
  cardId: string
): PurchaseFormData {
  return {
    cardId,
    description: transaction.notes || 'Compra no cartão',
    amount: transaction.value,
    category: transaction.category as Purchase['category'],
    date: transaction.date,
    // Installments can be added later via PurchaseForm
  };
}

/**
 * Calculate invoice month based on purchase date and card closing day
 */
export function calculateInvoiceMonth(
  purchaseDate: Date,
  closingDay: number
): { month: number; year: number } {
  let invoiceMonth = purchaseDate.getMonth() + 1;
  let invoiceYear = purchaseDate.getFullYear();

  if (purchaseDate.getDate() > closingDay) {
    invoiceMonth += 1;
    if (invoiceMonth > 12) {
      invoiceMonth = 1;
      invoiceYear += 1;
    }
  }

  return { month: invoiceMonth, year: invoiceYear };
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

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
