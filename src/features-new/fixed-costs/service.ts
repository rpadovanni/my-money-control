import type { FixedCost, FixedCostFormData } from './types';

export const fixedCostService = {
  async fetchFixedCosts(): Promise<FixedCost[]> {
    return [];
  },

  async createFixedCost(data: FixedCostFormData): Promise<FixedCost> {
    const newCost: FixedCost = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newCost;
  },

  async updateFixedCost(id: string, data: Partial<FixedCost>): Promise<FixedCost> {
    return { ...data, id } as FixedCost;
  },

  async deleteFixedCost(id: string): Promise<void> {
    console.log('Deleting fixed cost:', id);
  },
};
