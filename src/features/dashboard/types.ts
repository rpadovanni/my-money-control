// Types for dashboard feature

export interface MonthlySpending {
  month: number; // 1-12
  year: number;
  total: number;
  expenses: number;
  creditCard: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface WeeklySpending {
  week: number; // 1-4 or 5
  startDate: Date;
  endDate: Date;
  total: number;
  expenses: number;
  creditCard: number;
}

export interface MonthForecast {
  currentSpent: number;
  projectedTotal: number;
  daysRemaining: number;
  dailyAverage: number;
  projectedDailyAverage: number;
}

export interface DashboardSummary {
  totalSpent: number;
  totalExpenses: number;
  totalCreditCard: number;
  budgetLimit: number;
  budgetRemaining: number;
  budgetPercentage: number;
}

