import type { SavingsGoal, GoalProgress, GoalContribution } from './types';
import { differenceInDays, addDays } from 'date-fns';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatCurrencyWhileTyping(value: string): string {
  if (!value) return '';
  
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  const numValue = parseInt(numbers, 10) / 100;
  const parts = numValue.toFixed(2).split('.');
  return `${parts[0]},${parts[1]}`;
}

export function calculateGoalProgress(goal: SavingsGoal): GoalProgress {
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = goal.currentAmount >= goal.targetAmount || goal.status === 'completed';
  
  let daysRemaining: number | undefined;
  let estimatedCompletionDate: Date | undefined;
  let isOnTrack = true;

  if (goal.targetDate && !isCompleted) {
    const now = new Date();
    daysRemaining = differenceInDays(goal.targetDate, now);
    
    if (daysRemaining > 0 && goal.currentAmount > 0) {
      const dailyRate = goal.currentAmount / differenceInDays(now, goal.startDate);
      const estimatedDays = remainingAmount / dailyRate;
      estimatedCompletionDate = addDays(now, estimatedDays);
      
      // Consider on track if estimated completion is before or close to target date
      isOnTrack = estimatedDays <= daysRemaining * 1.1; // 10% tolerance
    } else if (daysRemaining <= 0 && !isCompleted) {
      isOnTrack = false;
    }
  }

  return {
    goalId: goal.id,
    goalName: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    remainingAmount,
    percentage,
    daysRemaining,
    estimatedCompletionDate,
    isOnTrack,
    isCompleted,
  };
}

export function calculateTotalProgress(goals: SavingsGoal[]): {
  totalTarget: number;
  totalCurrent: number;
  totalRemaining: number;
  overallPercentage: number;
  activeGoals: number;
  completedGoals: number;
} {
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  
  const totalTarget = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalRemaining = totalTarget - totalCurrent;
  const overallPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return {
    totalTarget,
    totalCurrent,
    totalRemaining,
    overallPercentage,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
  };
}

export function sortGoalsByProgress(goals: SavingsGoal[]): SavingsGoal[] {
  return [...goals].sort((a, b) => {
    // Completed goals first
    if (a.status === 'completed' && b.status !== 'completed') return -1;
    if (a.status !== 'completed' && b.status === 'completed') return 1;
    
    // Then by percentage (descending)
    const progressA = calculateGoalProgress(a);
    const progressB = calculateGoalProgress(b);
    return progressB.percentage - progressA.percentage;
  });
}

