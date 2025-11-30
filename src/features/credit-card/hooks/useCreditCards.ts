import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  creditCardsAtom,
  activeCardsAtom,
  totalLimitAtom,
  cardByIdAtom,
} from '../atoms';
import type { CreditCard, CreditCardFormData } from '../types';

export function useCreditCards() {
  const [cards, setCards] = useAtom(creditCardsAtom);
  const activeCards = useAtomValue(activeCardsAtom);
  const totalLimit = useAtomValue(totalLimitAtom);

  const addCard = (data: CreditCardFormData) => {
    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      ...data,
      active: true,
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

  const toggleCardActive = (id: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, active: !card.active } : card))
    );
  };

  const getCardById = (id: string) => {
    return cards.find((card) => card.id === id);
  };

  return {
    cards,
    activeCards,
    totalLimit,
    addCard,
    updateCard,
    deleteCard,
    toggleCardActive,
    getCardById,
  };
}

