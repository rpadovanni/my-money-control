import type { Transaction, TransactionFormData } from './types';

// Pure functions for business logic
// Future: API integration

export const transactionService = {
  async fetchTransactions(): Promise<Transaction[]> {
    // TODO: implement API call
    return [];
  },

  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    // TODO: implement API call
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newTransaction;
  },

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    // TODO: implement API call
    return { ...data, id } as Transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting transaction:', id);
  },
};

