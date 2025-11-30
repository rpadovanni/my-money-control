import type {
  CreditCard,
  CreditCardFormData,
  Purchase,
  PurchaseFormData,
  Invoice,
  MonthlyBudget,
} from '../types';
import { generateInvoices, getCurrentInvoicePeriod, getNextInvoicePeriod } from '../utils';

// Service layer for future API integration
// Following YAGNI - implementing only what's needed now

export const creditCardService = {
  // Cards
  async fetchCards(): Promise<CreditCard[]> {
    // TODO: implement API call
    return [];
  },

  async createCard(data: CreditCardFormData): Promise<CreditCard> {
    // TODO: implement API call
    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      ...data,
      active: true,
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

  // Purchases
  async fetchPurchases(): Promise<Purchase[]> {
    // TODO: implement API call
    return [];
  },

  async createPurchase(data: PurchaseFormData): Promise<Purchase> {
    // TODO: implement API call
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...data,
      installments: data.installments || 1,
      currentInstallment: 1,
    };
    return newPurchase;
  },

  async updatePurchase(id: string, data: Partial<Purchase>): Promise<Purchase> {
    // TODO: implement API call
    return { ...data, id } as Purchase;
  },

  async deletePurchase(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting purchase:', id);
  },

  // Invoices
  async fetchInvoices(): Promise<Invoice[]> {
    // TODO: implement API call
    return [];
  },

  async generateInvoicesForMonth(
    cards: CreditCard[],
    purchases: Purchase[],
    month: number,
    year: number
  ): Promise<Invoice[]> {
    return generateInvoices(cards, purchases, month, year);
  },

  // Budget
  async fetchBudgets(): Promise<MonthlyBudget[]> {
    // TODO: implement API call
    return [];
  },

  async createOrUpdateBudget(budget: MonthlyBudget): Promise<MonthlyBudget> {
    // TODO: implement API call
    return budget;
  },
};

