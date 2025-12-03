// Types for fixed-costs feature

export type FixedCostType = 'housing' | 'health' | 'subscriptions';

export interface FixedCost {
  id: string;
  description: string;
  amount: number;
  type: FixedCostType;
  dueDay: number; // Day of month (1-31)
  active: boolean;
  notes?: string;
}

export interface FixedCostFormData {
  description: string;
  amount: number;
  type: FixedCostType;
  dueDay: number;
  active: boolean;
  notes?: string;
}

export interface FixedCostSummary {
  total: number;
  byType: Record<FixedCostType, number>;
  activeCount: number;
  inactiveCount: number;
}

export const FIXED_COST_TYPES: Record<FixedCostType, string> = {
  housing: 'Moradia',
  health: 'Saúde',
  subscriptions: 'Assinaturas',
};

