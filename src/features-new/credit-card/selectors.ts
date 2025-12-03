import { atom } from 'jotai';
import { cardsAtom, purchasesAtom, monthlyBudgetsAtom } from './atoms';
import type { Invoice, CardBudgetProgress } from './types';

// Active cards
export const activeCardsAtom = atom((get) => {
  const cards = get(cardsAtom);
  return cards.filter((card) => card.active);
});

// Purchases by card
export const purchasesByCardAtom = (cardId: string) =>
  atom((get) => {
    const purchases = get(purchasesAtom);
    return purchases.filter((purchase) => purchase.cardId === cardId);
  });

// Total purchases
export const totalPurchasesAtom = atom((get) => {
  const purchases = get(purchasesAtom);
  return purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
});

// Current month budget
export const currentBudgetAtom = atom((get) => {
  const budgets = get(monthlyBudgetsAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  return budgets.find((b) => b.month === month && b.year === year);
});

// Budget remaining
export const budgetRemainingAtom = atom((get) => {
  const currentBudget = get(currentBudgetAtom);
  if (!currentBudget) return 0;
  return currentBudget.limit - currentBudget.spent;
});

// Invoices by month
export const invoicesByMonthAtom = atom((get): Invoice[] => {
  const cards = get(cardsAtom);
  const purchases = get(purchasesAtom);

  const invoiceMap = new Map<string, Invoice>();

  purchases.forEach((purchase) => {
    const card = cards.find((c) => c.id === purchase.cardId);
    if (!card) return;

    const purchaseDate = new Date(purchase.date);
    let invoiceMonth = purchaseDate.getMonth() + 1;
    let invoiceYear = purchaseDate.getFullYear();

    // Adjust for closing day
    if (purchaseDate.getDate() > card.closingDay) {
      invoiceMonth += 1;
      if (invoiceMonth > 12) {
        invoiceMonth = 1;
        invoiceYear += 1;
      }
    }

    const key = `${purchase.cardId}-${invoiceYear}-${invoiceMonth}`;
    
    if (!invoiceMap.has(key)) {
      const card = cards.find((c) => c.id === purchase.cardId);
      invoiceMap.set(key, {
        cardId: purchase.cardId,
        cardName: card?.name || 'Cartão',
        month: invoiceMonth,
        year: invoiceYear,
        total: 0,
        paid: false,
        purchases: [],
      });
    }

    const invoice = invoiceMap.get(key)!;
    invoice.total += purchase.amount;
    invoice.purchases.push(purchase);
  });

  return Array.from(invoiceMap.values());
});

// Current month invoices
export const currentInvoicesAtom = atom((get) => {
  const invoices = get(invoicesByMonthAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return invoices.filter((invoice) => invoice.month === month && invoice.year === year);
});

// Current month purchases
export const currentMonthPurchasesAtom = atom((get) => {
  const purchases = get(purchasesAtom);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate >= monthStart && purchaseDate <= monthEnd;
  });
});

// Total current month purchases
export const totalCurrentMonthPurchasesAtom = atom((get) => {
  const purchases = get(currentMonthPurchasesAtom);
  return purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
});

// NEW SELECTORS

/**
 * Get monthly invoice for a specific card and month
 */
export const getMonthlyInvoiceAtom = (cardId: string, month: number, year: number) =>
  atom((get) => {
    const invoices = get(invoicesByMonthAtom);
    return invoices.find(
      (invoice) => invoice.cardId === cardId && invoice.month === month && invoice.year === year
    );
  });

/**
 * Get card budget progress
 */
export const getCardBudgetProgressAtom = (cardId: string) =>
  atom((get): CardBudgetProgress | null => {
    const cards = get(cardsAtom);
    const purchases = get(purchasesAtom);
    const budgets = get(monthlyBudgetsAtom);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const card = cards.find((c) => c.id === cardId);
    if (!card) return null;

    const budget = budgets.find((b) => b.cardId === cardId && b.month === month && b.year === year);
    const limit = budget?.limit || card.limit;

    // Calculate spent from purchases in current month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);
    
    const monthPurchases = purchases.filter((p) => {
      if (p.cardId !== cardId) return false;
      const purchaseDate = new Date(p.date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });

    const spent = monthPurchases.reduce((acc, p) => acc + p.amount, 0);
    const remaining = limit - spent;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const isExceeded = spent > limit;
    const isWarning = percentage >= 80 && !isExceeded;

    return {
      cardId: card.id,
      cardName: card.name,
      limit,
      spent,
      remaining,
      percentage,
      isExceeded,
      isWarning,
    };
  });

/**
 * Get total credit card expenses for a specific month
 */
export const getTotalCreditCardExpensesAtom = (month: number, year: number) =>
  atom((get) => {
    const purchases = get(purchasesAtom);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    const monthPurchases = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });

    return monthPurchases.reduce((acc, purchase) => acc + purchase.amount, 0);
  });
