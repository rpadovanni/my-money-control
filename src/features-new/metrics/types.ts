// Types for metrics feature

export interface BurnRate {
  monthly: number;
  daily: number;
  yearly: number;
}

export interface SavingRate {
  rate: number;
  amount: number;
  income: number;
  expenses: number;
}

export interface DistributionItem {
  category: string;
  amount: number;
  percentage: number;
}

