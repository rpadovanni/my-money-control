import { useAtom, useAtomValue } from 'jotai';
import {
  savingsGoalsAtom,
  activeGoalsAtom,
  completedGoalsAtom,
  pausedGoalsAtom,
  totalGoalsTargetAtom,
  totalGoalsCurrentAtom,
  goalsProgressAtom,
  activeGoalsProgressAtom,
  overallProgressAtom,
  goalsOnTrackAtom,
  goalsOffTrackAtom,
} from '../atoms';
import type { SavingsGoal, SavingsGoalFormData, GoalProgress } from '../types';
import { sortGoalsByProgress, calculateTotalProgress } from '../utils';
import { useTransactions } from '../../features-new/transactions/hooks';
import { useBudgets } from '../../features-new/budget/hooks';

export function useSavingsGoals() {
  const [savingsGoals, setSavingsGoals] = useAtom(savingsGoalsAtom);
  const activeGoals = useAtomValue(activeGoalsAtom);
  const completedGoals = useAtomValue(completedGoalsAtom);
  const pausedGoals = useAtomValue(pausedGoalsAtom);
  const totalGoalsTarget = useAtomValue(totalGoalsTargetAtom);
  const totalGoalsCurrent = useAtomValue(totalGoalsCurrentAtom);
  const goalsProgress = useAtomValue(goalsProgressAtom);
  const activeGoalsProgress = useAtomValue(activeGoalsProgressAtom);
  const overallProgress = useAtomValue(overallProgressAtom);
  const goalsOnTrack = useAtomValue(goalsOnTrackAtom);
  const goalsOffTrack = useAtomValue(goalsOffTrackAtom);
  
  const { totalExpenses } = useTransactions();
  const { getBudgetSimulation } = useBudgets();

  const sortedGoals = sortGoalsByProgress(savingsGoals);
  const totalProgress = calculateTotalProgress(savingsGoals);

  const addGoal = (data: SavingsGoalFormData) => {
    const newGoal: SavingsGoal = {
      id: crypto.randomUUID(),
      ...data,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, data: Partial<SavingsGoalFormData>) => {
    setSavingsGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...data } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const addContribution = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  const getAvailableForGoals = (): number => {
    const simulation = getBudgetSimulation();
    // Calculate available amount: income - expenses - budget
    // This is a simplified calculation - in a real app, you'd integrate with income feature
    const budgetRemaining = simulation.remaining;
    return Math.max(0, budgetRemaining);
  };

  return {
    savingsGoals: sortedGoals,
    activeGoals,
    completedGoals,
    pausedGoals,
    totalGoalsTarget,
    totalGoalsCurrent,
    goalsProgress,
    activeGoalsProgress,
    overallProgress,
    goalsOnTrack,
    goalsOffTrack,
    totalProgress,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    getAvailableForGoals,
  };
}

