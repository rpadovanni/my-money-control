import { useAtom, useAtomValue } from 'jotai';
import {
  incomesAtom,
  currentMonthIncomesAtom,
  fixedIncomesAtom,
  variableIncomesAtom,
  receivedIncomesAtom,
  pendingIncomesAtom,
  totalIncomeAtom,
  totalReceivedIncomeAtom,
  totalPendingIncomeAtom,
} from '../atoms';
import type { Income, IncomeFormData } from '../types';

export function useIncome() {
  const [incomes, setIncomes] = useAtom(incomesAtom);
  const currentMonthIncomes = useAtomValue(currentMonthIncomesAtom);
  const fixedIncomes = useAtomValue(fixedIncomesAtom);
  const variableIncomes = useAtomValue(variableIncomesAtom);
  const receivedIncomes = useAtomValue(receivedIncomesAtom);
  const pendingIncomes = useAtomValue(pendingIncomesAtom);
  const totalIncome = useAtomValue(totalIncomeAtom);
  const totalReceivedIncome = useAtomValue(totalReceivedIncomeAtom);
  const totalPendingIncome = useAtomValue(totalPendingIncomeAtom);

  const addIncome = (data: IncomeFormData) => {
    const newIncome: Income = {
      id: crypto.randomUUID(),
      ...data,
      month: data.date.getMonth() + 1,
      year: data.date.getFullYear(),
    };
    
    setIncomes((prev) => [...prev, newIncome]);
    
    return newIncome;
  };

  const updateIncome = (id: string, data: Partial<IncomeFormData>) => {
    setIncomes((prev) => {
      const oldIncome = prev.find((i) => i.id === id);
      if (!oldIncome) return prev;
      
      const updatedIncome: Income = {
        ...oldIncome,
        ...data,
        month: data.date ? data.date.getMonth() + 1 : oldIncome.month,
        year: data.date ? data.date.getFullYear() : oldIncome.year,
      };
      
      return prev.map((income) => (income.id === id ? updatedIncome : income));
    });
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((income) => income.id !== id));
  };

  const toggleReceived = (id: string) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.id === id ? { ...income, received: !income.received } : income
      )
    );
  };

  return {
    incomes,
    currentMonthIncomes,
    fixedIncomes,
    variableIncomes,
    receivedIncomes,
    pendingIncomes,
    totalIncome,
    totalReceivedIncome,
    totalPendingIncome,
    addIncome,
    updateIncome,
    deleteIncome,
    toggleReceived,
  };
}

