// Types for metrics feature

export interface BurnRate {
  monthly: number;
  daily: number;
  yearly: number;
  monthsUntilZero: number | null; // null if income > expenses
}

export interface SavingRate {
  rate: number; // percentage
  amount: number;
  income: number;
  expenses: number;
}

export interface DistributionItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseDistribution {
  byCategory: DistributionItem[];
  byPaymentMethod: DistributionItem[];
  total: number;
}

export interface MetricsPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
}

