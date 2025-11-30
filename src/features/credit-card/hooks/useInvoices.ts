import { useAtom, useAtomValue } from 'jotai';
import {
  invoicesAtom,
  currentInvoicesAtom,
  futureInvoicesAtom,
  invoiceByCardAtom,
  totalInvoicesAtom,
} from '../atoms';
import { useCreditCards } from './useCreditCards';
import { usePurchases } from './usePurchases';
import { generateInvoices, getCurrentInvoicePeriod, getNextInvoicePeriod } from '../utils';

export function useInvoices(cardId?: string) {
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const currentInvoices = useAtomValue(currentInvoicesAtom);
  const futureInvoices = useAtomValue(futureInvoicesAtom);
  const totalInvoices = useAtomValue(totalInvoicesAtom);
  const cardInvoices = cardId ? useAtomValue(invoiceByCardAtom(cardId)) : invoices;

  const { cards } = useCreditCards();
  const { purchases } = usePurchases();

  // Generate invoices for current and next month
  const generateInvoicesForPeriods = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    const currentPeriodInvoices = generateInvoices(cards, purchases, currentMonth, currentYear);
    const nextPeriodInvoices = generateInvoices(cards, purchases, nextMonth, nextYear);

    // Merge and update invoices
    const allInvoices = [...currentPeriodInvoices, ...nextPeriodInvoices];
    setInvoices((prev) => {
      // Update existing or add new
      const updated = [...prev];
      allInvoices.forEach((newInvoice) => {
        const index = updated.findIndex(
          (inv) =>
            inv.cardId === newInvoice.cardId &&
            inv.month === newInvoice.month &&
            inv.year === newInvoice.year
        );
        if (index >= 0) {
          updated[index] = newInvoice;
        } else {
          updated.push(newInvoice);
        }
      });
      return updated;
    });
  };

  const getCurrentInvoice = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return null;

    const period = getCurrentInvoicePeriod(card);
    return invoices.find(
      (inv) =>
        inv.cardId === cardId &&
        inv.month === period.month &&
        inv.year === period.year
    );
  };

  const getNextInvoice = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return null;

    const period = getNextInvoicePeriod(card);
    return invoices.find(
      (inv) =>
        inv.cardId === cardId &&
        inv.month === period.month &&
        inv.year === period.year
    );
  };

  return {
    invoices: cardId ? cardInvoices : invoices,
    currentInvoices,
    futureInvoices,
    totalInvoices,
    generateInvoicesForPeriods,
    getCurrentInvoice,
    getNextInvoice,
  };
}

