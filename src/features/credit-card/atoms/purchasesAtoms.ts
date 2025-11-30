import { atom } from 'jotai';
import type { Purchase } from '../types';

// Base atoms for purchases
export const purchasesAtom = atom<Purchase[]>([]);

// Derived atoms for purchases
export const purchasesByCardAtom = (cardId: string) =>
  atom((get) => {
    const purchases = get(purchasesAtom);
    return purchases.filter((purchase) => purchase.cardId === cardId);
  });

export const purchasesByCategoryAtom = atom((get) => {
  const purchases = get(purchasesAtom);
  return purchases.reduce(
    (acc, purchase) => {
      if (!acc[purchase.category]) {
        acc[purchase.category] = [];
      }
      acc[purchase.category].push(purchase);
      return acc;
    },
    {} as Record<string, Purchase[]>
  );
});

export const totalPurchasesAtom = atom((get) => {
  const purchases = get(purchasesAtom);
  return purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
});

