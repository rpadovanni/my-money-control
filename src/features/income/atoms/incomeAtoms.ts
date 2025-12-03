import { atom } from 'jotai';
import type { Income } from '../types';

// Base atoms for income
export const incomesAtom = atom<Income[]>([]);

// Derived atoms for income
export const currentMonthIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  return incomes.filter((income) => income.month === month && income.year === year);
});

export const fixedIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.filter((income) => income.type === 'fixed');
});

export const variableIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.filter((income) => income.type === 'variable');
});

export const receivedIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.filter((income) => income.received);
});

export const pendingIncomesAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.filter((income) => !income.received);
});

export const totalIncomeAtom = atom((get) => {
  const incomes = get(incomesAtom);
  return incomes.reduce((sum, income) => sum + income.amount, 0);
});

export const totalReceivedIncomeAtom = atom((get) => {
  const incomes = get(receivedIncomesAtom);
  return incomes.reduce((sum, income) => sum + income.amount, 0);
});

export const totalPendingIncomeAtom = atom((get) => {
  const incomes = get(pendingIncomesAtom);
  return incomes.reduce((sum, income) => sum + income.amount, 0);
});

