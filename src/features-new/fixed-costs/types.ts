// Types for fixed-costs feature

export type FixedCostType = 'housing' | 'health' | 'subscriptions' | 'other';

export type RenewalCycle = 'monthly' | 'yearly';

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  type: FixedCostType;
  dueDay: number; // 1-31
  renewalCycle: RenewalCycle;
  active: boolean;
}

export interface FixedCostFormData {
  name: string;
  amount: number;
  type: FixedCostType;
  dueDay: number;
  renewalCycle: RenewalCycle;
  active: boolean;
}

// Type labels
export const FIXED_COST_TYPES: Record<FixedCostType, string> = {
  housing: 'Moradia',
  health: 'Saúde',
  subscriptions: 'Assinaturas',
  other: 'Outros',
};

export const RENEWAL_CYCLES: Record<RenewalCycle, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};
