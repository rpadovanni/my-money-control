import type { StateCreator } from 'zustand';
import type { LimitCategory, PlanningState } from '../types/planning';

export interface PlanningSlice {
  planning: PlanningState;
  setMonthlyIncome: (value: number) => void;
  addLimit: (limit: Omit<LimitCategory, 'id'>) => void;
  updateLimit: (id: string, data: Partial<LimitCategory>) => void;
  removeLimit: (id: string) => void;
  getTotalLimits: () => number;
  getRemaining: () => number;
  getUsedPercentage: () => number;
}

export const createPlanningSlice: StateCreator<PlanningSlice> = (set, get) => ({
  planning: {
    monthlyIncome: 0,
    limits: [],
  },
  setMonthlyIncome: (value) =>
    set((s) => ({ planning: { ...s.planning, monthlyIncome: value } })),
  addLimit: (limit) =>
    set((s) => ({
      planning: {
        ...s.planning,
        limits: [
          ...s.planning.limits,
          {
            ...limit,
            id: crypto.randomUUID(),
          },
        ],
      },
    })),
  updateLimit: (id, data) =>
    set((s) => ({
      planning: {
        ...s.planning,
        limits: s.planning.limits.map((l) => (l.id === id ? { ...l, ...data } : l)),
      },
    })),
  removeLimit: (id) =>
    set((s) => ({
      planning: {
        ...s.planning,
        limits: s.planning.limits.filter((l) => l.id !== id),
      },
    })),
  getTotalLimits: () => {
    const state = get();
    return state.planning.limits.reduce((sum, limit) => sum + limit.amount, 0);
  },
  getRemaining: () => {
    const state = get();
    return state.planning.monthlyIncome - state.getTotalLimits();
  },
  getUsedPercentage: () => {
    const state = get();
    if (state.planning.monthlyIncome === 0) return 0;
    return (state.getTotalLimits() / state.planning.monthlyIncome) * 100;
  },
});
