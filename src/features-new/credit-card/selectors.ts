import { atom } from 'jotai';
import { cardsAtom, purchasesAtom, monthlyBudgetsAtom } from './atoms';
import type { Invoice } from './types';

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
      invoiceMap.set(key, {
        cardId: purchase.cardId,
        month: invoiceMonth,
        year: invoiceYear,
        total: 0,
        paid: false,
      });
    }

    const invoice = invoiceMap.get(key)!;
    invoice.total += purchase.amount;
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

