import type { CreditCard, Purchase, Invoice } from './types';

// Utility functions for credit-card feature

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

/**
 * Calculate invoice dates based on card closing and due days
 */
export function calculateInvoiceDates(
  card: CreditCard,
  month: number,
  year: number
): { closingDate: Date; dueDate: Date } {
  // Closing date: closingDay of the current month
  const closingDate = new Date(year, month - 1, card.closingDay);
  
  // Due date: dueDay of the next month
  const dueDate = new Date(year, month, card.dueDay);
  
  return { closingDate, dueDate };
}

/**
 * Check if a purchase date falls within an invoice period
 */
export function isPurchaseInInvoicePeriod(
  purchase: Purchase,
  card: CreditCard,
  invoiceMonth: number,
  invoiceYear: number
): boolean {
  const purchaseDate = new Date(purchase.date);
  const { closingDate } = calculateInvoiceDates(card, invoiceMonth, invoiceYear);
  
  // Previous closing date
  const prevClosingDate = new Date(invoiceYear, invoiceMonth - 2, card.closingDay);
  
  return purchaseDate >= prevClosingDate && purchaseDate < closingDate;
}

/**
 * Generate invoices for all cards based on purchases
 */
export function generateInvoices(
  cards: CreditCard[],
  purchases: Purchase[],
  month: number,
  year: number
): Invoice[] {
  const invoices: Invoice[] = [];
  
  for (const card of cards) {
    if (!card.active) continue;
    
    const cardPurchases = purchases.filter((p) => 
      p.cardId === card.id && isPurchaseInInvoicePeriod(p, card, month, year)
    );
    
    const total = cardPurchases.reduce((acc, p) => acc + p.amount, 0);
    const { closingDate, dueDate } = calculateInvoiceDates(card, month, year);
    
    invoices.push({
      cardId: card.id,
      month,
      year,
      total,
      purchases: cardPurchases,
      closingDate,
      dueDate,
      paid: false,
    });
  }
  
  return invoices;
}

/**
 * Get current invoice period for a card
 */
export function getCurrentInvoicePeriod(card: CreditCard): { month: number; year: number } {
  const now = new Date();
  const currentDay = now.getDate();
  
  // If current day is before closing day, invoice is for previous month
  if (currentDay < card.closingDay) {
    const prevMonth = now.getMonth(); // 0-11
    return {
      month: prevMonth + 1,
      year: now.getFullYear(),
    };
  }
  
  // Otherwise, invoice is for current month
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Get next invoice period for a card
 */
export function getNextInvoicePeriod(card: CreditCard): { month: number; year: number } {
  const now = new Date();
  const currentDay = now.getDate();
  
  // If current day is before closing day, next invoice is current month
  if (currentDay < card.closingDay) {
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }
  
  // Otherwise, next invoice is next month
  const nextMonth = now.getMonth() + 1;
  return {
    month: nextMonth === 12 ? 1 : nextMonth + 1,
    year: nextMonth === 12 ? now.getFullYear() + 1 : now.getFullYear(),
  };
}

