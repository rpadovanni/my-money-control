import type { Expense, ExpenseFormData } from '../types';

// Service layer for future API integration
// Following YAGNI - implementing only what's needed now

export const expensesService = {
  // Expenses
  async fetchExpenses(): Promise<Expense[]> {
    // TODO: implement API call
    return [];
  },

  async createExpense(data: ExpenseFormData): Promise<Expense> {
    // TODO: implement API call
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newExpense;
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    // TODO: implement API call
    return { ...data, id } as Expense;
  },

  async deleteExpense(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting expense:', id);
  },
};

