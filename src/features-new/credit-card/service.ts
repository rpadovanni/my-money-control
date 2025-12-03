import type { CreditCard, Purchase, CreditCardFormData, PurchaseFormData } from './types';

// Pure functions for business logic
// Future: API integration

export const creditCardService = {
  async fetchCards(): Promise<CreditCard[]> {
    // TODO: implement API call
    return [];
  },

  async createCard(data: CreditCardFormData): Promise<CreditCard> {
    // TODO: implement API call
    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newCard;
  },

  async updateCard(id: string, data: Partial<CreditCard>): Promise<CreditCard> {
    // TODO: implement API call
    return { ...data, id } as CreditCard;
  },

  async deleteCard(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting card:', id);
  },

  async fetchPurchases(): Promise<Purchase[]> {
    // TODO: implement API call
    return [];
  },

  async createPurchase(data: PurchaseFormData): Promise<Purchase> {
    // TODO: implement API call
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newPurchase;
  },

  async deletePurchase(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting purchase:', id);
  },
};

