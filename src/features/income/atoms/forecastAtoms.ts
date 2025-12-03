import { atom } from 'jotai';
import { incomesAtom } from './incomeAtoms';
import type { IncomeForecast } from '../types';
import { calculateMonthlyIncome } from '../utils';

// Base atoms for forecast
export const forecastsAtom = atom<IncomeForecast[]>([]);

// Derived atoms for forecast
export const currentMonthForecastAtom = atom((get) => {
  const incomes = get(incomesAtom);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const { fixed, variable, total, received, pending } = calculateMonthlyIncome(incomes, month, year);
  
  return {
    month,
    year,
    fixedIncome: fixed,
    variableIncome: variable,
    totalIncome: total,
    receivedIncome: received,
    pendingIncome: pending,
  } as IncomeForecast;
});

export const nextMonthForecastAtom = atom((get) => {
  const incomes = get(incomesAtom);
  const now = new Date();
  let month = now.getMonth() + 2;
  let year = now.getFullYear();
  
  if (month > 12) {
    month = 1;
    year += 1;
  }
  
  const { fixed, variable, total, received, pending } = calculateMonthlyIncome(incomes, month, year);
  
  return {
    month,
    year,
    fixedIncome: fixed,
    variableIncome: variable,
    totalIncome: total,
    receivedIncome: received,
    pendingIncome: pending,
  } as IncomeForecast;
});

