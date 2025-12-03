import { atom } from 'jotai';
import { savingsGoalsAtom, activeGoalsAtom } from './goalsAtoms';
import type { GoalProgress } from '../types';
import { calculateGoalProgress } from '../utils';

// Derived atoms for progress
export const goalsProgressAtom = atom((get) => {
  const goals = get(savingsGoalsAtom);
  return goals.map((goal) => calculateGoalProgress(goal));
});

export const activeGoalsProgressAtom = atom((get) => {
  const goals = get(activeGoalsAtom);
  return goals.map((goal) => calculateGoalProgress(goal));
});

export const overallProgressAtom = atom((get) => {
  const goals = get(activeGoalsAtom);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  
  return {
    totalTarget,
    totalCurrent,
    totalRemaining: totalTarget - totalCurrent,
    percentage,
  };
});

export const goalsOnTrackAtom = atom((get) => {
  const progress = get(activeGoalsProgressAtom);
  return progress.filter((p) => p.isOnTrack && !p.isCompleted);
});

export const goalsOffTrackAtom = atom((get) => {
  const progress = get(activeGoalsProgressAtom);
  return progress.filter((p) => !p.isOnTrack && !p.isCompleted);
});

