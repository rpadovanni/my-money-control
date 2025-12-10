export interface LimitCategory {
  id: string;
  category: string;
  amount: number;
}

export interface PlanningState {
  monthlyIncome: number;
  limits: LimitCategory[];
}
