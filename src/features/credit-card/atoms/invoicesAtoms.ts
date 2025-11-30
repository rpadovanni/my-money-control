import { atom } from 'jotai';
import type { Invoice } from '../types';

// Base atoms for invoices
export const invoicesAtom = atom<Invoice[]>([]);

// Derived atoms for invoices
export const currentInvoicesAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  const now = new Date();
  return invoices.filter(
    (invoice) => invoice.month === now.getMonth() + 1 && invoice.year === now.getFullYear()
  );
});

export const futureInvoicesAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  const now = new Date();
  return invoices.filter(
    (invoice) =>
      invoice.year > now.getFullYear() ||
      (invoice.year === now.getFullYear() && invoice.month > now.getMonth() + 1)
  );
});

export const invoiceByCardAtom = (cardId: string) =>
  atom((get) => {
    const invoices = get(invoicesAtom);
    return invoices.filter((invoice) => invoice.cardId === cardId);
  });

export const totalInvoicesAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  return invoices.reduce((acc, invoice) => acc + invoice.total, 0);
});

