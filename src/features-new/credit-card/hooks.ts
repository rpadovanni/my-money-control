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
} from './selectors';
import type { CreditCard, Purchase, MonthlyBudget, CreditCardFormData, PurchaseFormData } from './types';

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

  const addPurchase = (data: PurchaseFormData) => {
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...data,
    };
    setPurchases((prev) => [...prev, newPurchase]);
    return newPurchase;
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
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
        (b) => b.month === budget.month && b.year === budget.year
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = budget;
        return updated;
      }
      return [...prev, budget];
    });
  };

  const updateBudgetSpent = (amount: number) => {
    if (!currentBudget) return;
    setBudget({
      ...currentBudget,
      spent: currentBudget.spent + amount,
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

