import { useAtom, useAtomValue } from 'jotai';
import { cardsAtom, purchasesAtom, monthlyBudgetsAtom } from './atoms';
import {
  activeCardsAtom,
  totalPurchasesAtom,
  currentBudgetAtom,
  budgetRemainingAtom,
  invoicesByMonthAtom,
  currentInvoicesAtom,
  currentMonthPurchasesAtom,
  totalCurrentMonthPurchasesAtom,
  getMonthlyInvoiceAtom,
  getCardBudgetProgressAtom,
  getTotalCreditCardExpensesAtom,
} from './selectors';
import type {
  CreditCard,
  Purchase,
  MonthlyBudget,
  CreditCardFormData,
  PurchaseFormData,
  CardBudgetProgress,
  Invoice,
} from './types';

export function useCreditCards() {
  const [cards, setCards] = useAtom(cardsAtom);
  const activeCards = useAtomValue(activeCardsAtom);

  const addCard = (data: CreditCardFormData) => {
    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      ...data,
    };
    setCards((prev) => [...prev, newCard]);
    return newCard;
  };

  const updateCard = (id: string, data: Partial<CreditCard>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...data } : card))
    );
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return {
    cards,
    activeCards,
    addCard,
    updateCard,
    deleteCard,
  };
}

export function usePurchases() {
  const [purchases, setPurchases] = useAtom(purchasesAtom);
  const totalPurchases = useAtomValue(totalPurchasesAtom);
  const currentMonthPurchases = useAtomValue(currentMonthPurchasesAtom);
  const totalCurrentMonthPurchases = useAtomValue(totalCurrentMonthPurchasesAtom);

  const addPurchase = (data: PurchaseFormData, transactionId: string) => {
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      transactionId,
      ...data,
      currentInstallment: data.installments ? 1 : undefined,
      parentPurchaseId: undefined, // First purchase has no parent
    };

    // If installments > 1, create additional purchase records
    const purchasesToAdd: Purchase[] = [newPurchase];
    
    if (data.installments && data.installments > 1) {
      const installmentAmount = data.amount / data.installments;
      const purchaseDate = new Date(data.date);

      for (let i = 2; i <= data.installments; i++) {
        const installmentDate = new Date(purchaseDate);
        installmentDate.setMonth(installmentDate.getMonth() + (i - 1));

        purchasesToAdd.push({
          id: crypto.randomUUID(),
          transactionId: `${transactionId}-installment-${i}`, // Reference to parent transaction
          cardId: data.cardId,
          description: `${data.description} (${i}/${data.installments})`,
          amount: installmentAmount,
          category: data.category,
          date: installmentDate.toISOString().split('T')[0],
          installments: data.installments,
          currentInstallment: i,
          parentPurchaseId: newPurchase.id,
        });
      }
    }

    setPurchases((prev) => [...prev, ...purchasesToAdd]);
    return purchasesToAdd;
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => {
      const purchase = prev.find((p) => p.id === id);
      if (!purchase) return prev;

      // If it's an installment purchase, delete all related installments
      if (purchase.parentPurchaseId) {
        // Delete all installments of the same parent
        return prev.filter(
          (p) => p.id !== purchase.parentPurchaseId && p.parentPurchaseId !== purchase.parentPurchaseId
        );
      } else if (purchase.installments && purchase.installments > 1) {
        // Delete all installments
        return prev.filter((p) => p.parentPurchaseId !== id && p.id !== id);
      }

      return prev.filter((p) => p.id !== id);
    });
  };

  return {
    purchases,
    currentMonthPurchases,
    totalPurchases,
    totalCurrentMonthPurchases,
    addPurchase,
    deletePurchase,
  };
}

export function useInvoices() {
  const invoices = useAtomValue(invoicesByMonthAtom);
  const currentInvoices = useAtomValue(currentInvoicesAtom);

  return {
    invoices,
    currentInvoices,
  };
}

export function useBudget() {
  const [budgets, setBudgets] = useAtom(monthlyBudgetsAtom);
  const currentBudget = useAtomValue(currentBudgetAtom);
  const budgetRemaining = useAtomValue(budgetRemainingAtom);

  const setBudget = (budget: MonthlyBudget) => {
    setBudgets((prev) => {
      const index = prev.findIndex(
        (b) => b.cardId === budget.cardId && b.month === budget.month && b.year === budget.year
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = budget;
        return updated;
      }
      return [...prev, budget];
    });
  };

  const updateBudgetSpent = (cardId: string, amount: number) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const budget = budgets.find((b) => b.cardId === cardId && b.month === month && b.year === year);
    if (!budget) return;
    
    setBudget({
      ...budget,
      spent: budget.spent + amount,
    });
  };

  return {
    budgets,
    currentBudget,
    budgetRemaining,
    setBudget,
    updateBudgetSpent,
  };
}
