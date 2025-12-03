import { atom } from 'jotai';
import type { SavingsGoal } from '../types';

// Base atoms for goals
export const savingsGoalsAtom = atom<SavingsGoal[]>([]);

// Derived atoms for goals
export const activeGoalsAtom = atom((get) => {
  const goals = get(savingsGoalsAtom);
  return goals.filter((goal) => goal.status === 'active');
});

export const completedGoalsAtom = atom((get) => {
  const goals = get(savingsGoalsAtom);
  return goals.filter((goal) => goal.status === 'completed');
});

export const pausedGoalsAtom = atom((get) => {
  const goals = get(savingsGoalsAtom);
  return goals.filter((goal) => goal.status === 'paused');
});

export const totalGoalsTargetAtom = atom((get) => {
  const goals = get(activeGoalsAtom);
  return goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
});

export const totalGoalsCurrentAtom = atom((get) => {
  const goals = get(activeGoalsAtom);
  return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
});

