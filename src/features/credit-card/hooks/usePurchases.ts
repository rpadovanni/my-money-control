import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  purchasesAtom,
  purchasesByCardAtom,
  totalPurchasesAtom,
} from '../atoms';
import type { Purchase, PurchaseFormData } from '../types';
import { useBudget } from './useBudget';

export function usePurchases(cardId?: string) {
  const [purchases, setPurchases] = useAtom(purchasesAtom);
  const totalPurchases = useAtomValue(totalPurchasesAtom);
  const cardPurchases = cardId
    ? useAtomValue(purchasesByCardAtom(cardId))
    : purchases;
  const { updateBudgetSpent } = useBudget();

  const addPurchase = (data: PurchaseFormData) => {
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...data,
      installments: data.installments || 1,
      currentInstallment: 1,
    };
    setPurchases((prev) => [...prev, newPurchase]);
    // Update budget spent
    updateBudgetSpent(data.amount);
    return newPurchase;
  };

  const updatePurchase = (id: string, data: Partial<Purchase>) => {
    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.id === id ? { ...purchase, ...data } : purchase
      )
    );
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
  };

  return {
    purchases: cardId ? cardPurchases : purchases,
    totalPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
  };
}

