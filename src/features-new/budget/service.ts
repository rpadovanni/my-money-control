import type { CategoryBudget, CategoryBudgetFormData } from './types';

export const budgetService = {
  async fetchBudgets(): Promise<CategoryBudget[]> {
    return [];
  },

  async createBudget(data: CategoryBudgetFormData): Promise<CategoryBudget> {
    const newBudget: CategoryBudget = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newBudget;
  },

  async updateBudget(id: string, data: Partial<CategoryBudget>): Promise<CategoryBudget> {
    return { ...data, id } as CategoryBudget;
  },

  async deleteBudget(id: string): Promise<void> {
    console.log('Deleting budget:', id);
  },
};

