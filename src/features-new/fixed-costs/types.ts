// Types for fixed-costs feature

export type FixedCostType = 'housing' | 'health' | 'subscriptions' | 'other';

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  type: FixedCostType;
  dueDay: number;
  active: boolean;
}

export interface FixedCostFormData {
  name: string;
  amount: number;
  type: FixedCostType;
  dueDay: number;
  active: boolean;
}
