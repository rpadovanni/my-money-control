// Types for metrics feature

export interface BurnRate {
  monthly: number;
  daily: number;
  yearly: number;
}

export interface SavingRate {
  rate: number; // percentage
  amount: number; // savings amount
  income: number;
  expenses: number;
}

export interface DistributionItem {
  category: string;
  amount: number;
  percentage: number;
}
