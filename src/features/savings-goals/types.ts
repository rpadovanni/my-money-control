// Types for savings-goals feature

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type GoalType = 'amount' | 'percentage' | 'custom';

export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  startDate: Date;
  status: GoalStatus;
  type: GoalType;
  category?: string;
}

export interface SavingsGoalFormData {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  startDate: Date;
  status: GoalStatus;
  type: GoalType;
  category?: string;
}

export interface GoalProgress {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  percentage: number;
  daysRemaining?: number;
  estimatedCompletionDate?: Date;
  isOnTrack: boolean;
  isCompleted: boolean;
}

export interface GoalContribution {
  goalId: string;
  amount: number;
  date: Date;
  source: 'manual' | 'expense_savings' | 'budget_surplus';
  description?: string;
}

export const GOAL_STATUSES: Record<GoalStatus, string> = {
  active: 'Ativa',
  completed: 'Concluída',
  paused: 'Pausada',
  cancelled: 'Cancelada',
};

export const GOAL_TYPES: Record<GoalType, string> = {
  amount: 'Valor Fixo',
  percentage: 'Percentual',
  custom: 'Personalizada',
};

