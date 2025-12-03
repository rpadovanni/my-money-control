/**
 * Integration layer between transactions and credit-card
 * This ensures credit-card doesn't import atoms directly from transactions
 */

import { useAtomValue, useAtom } from 'jotai';
import { expensesAtom } from '../transactions/selectors';
import { purchasesAtom } from './atoms';
import { useMemo, useEffect } from 'react';
import type { Purchase } from './types';
import { transactionToPurchase } from './utils';

/**
 * Hook to sync transactions with credit-card purchases
 * Automatically creates purchases when transactions are expense + credit-card
 */
export function useCreditCardIntegration() {
  const expenses = useAtomValue(expensesAtom);
  const [purchases, setPurchases] = useAtom(purchasesAtom);

  // Find transactions that should be purchases but aren't yet
  const transactionsToSync = useMemo(() => {
    return expenses.filter((transaction) => {
      // Must be expense with credit-card payment and have creditCardId
      if (
        transaction.type !== 'expense' ||
        transaction.paymentMethod !== 'credit-card' ||
        !transaction.creditCardId
      ) {
        return false;
      }

      // Check if purchase already exists for this transaction
      return !purchases.some((p) => p.transactionId === transaction.id);
    });
  }, [expenses, purchases]);

  // Auto-create purchases for new credit-card transactions
  useEffect(() => {
    if (transactionsToSync.length === 0) return;

    const newPurchases: Purchase[] = [];

    transactionsToSync.forEach((transaction) => {
      if (!transaction.creditCardId) return;

      // Check if already exists (double-check)
      if (purchases.some((p) => p.transactionId === transaction.id)) {
        return;
      }

      const purchaseData = transactionToPurchase(transaction, transaction.creditCardId);

      const newPurchase: Purchase = {
        id: crypto.randomUUID(),
        transactionId: transaction.id,
        ...purchaseData,
      };

      newPurchases.push(newPurchase);
    });

    if (newPurchases.length > 0) {
      setPurchases((prev) => [...prev, ...newPurchases]);
    }
  }, [transactionsToSync, purchases, setPurchases]);
}

