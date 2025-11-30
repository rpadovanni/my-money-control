import { atom } from 'jotai';
import type { CreditCard } from '../types';

// Base atoms for cards
export const creditCardsAtom = atom<CreditCard[]>([]);

// Derived atoms for cards
export const activeCardsAtom = atom((get) => {
  const cards = get(creditCardsAtom);
  return cards.filter((card) => card.active);
});

export const cardByIdAtom = (id: string) =>
  atom((get) => {
    const cards = get(creditCardsAtom);
    return cards.find((card) => card.id === id);
  });

export const totalLimitAtom = atom((get) => {
  const cards = get(creditCardsAtom);
  return cards.reduce((acc, card) => acc + card.limit, 0);
});

