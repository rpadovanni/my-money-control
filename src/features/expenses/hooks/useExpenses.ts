import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  expensesAtom,
  expenseFiltersAtom,
  filteredExpensesAtom,
  totalExpensesAtom,
  expensesByCategoryAtom,
  expensesByPaymentMethodAtom,
  expensesByMonthAtom,
} from '../atoms';
import type { Expense, ExpenseFormData, ExpenseFilters } from '../types';
import { sortExpensesByDate } from '../utils';
import { useBudget } from '../../credit-card/hooks/useBudget';

export function useExpenses() {
  const [expenses, setExpenses] = useAtom(expensesAtom);
  const [filters, setFiltersState] = useAtom(expenseFiltersAtom);
  const filteredExpenses = useAtomValue(filteredExpensesAtom);
  const totalExpenses = useAtomValue(totalExpensesAtom);
  const expensesByCategory = useAtomValue(expensesByCategoryAtom);
  const expensesByPaymentMethod = useAtomValue(expensesByPaymentMethodAtom);
  const expensesByMonth = useAtomValue(expensesByMonthAtom);
  const { updateBudgetSpent } = useBudget();

  const sortedExpenses = sortExpensesByDate(filteredExpenses);

  const addExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...data,
    };
    setExpenses((prev) => [...prev, newExpense]);
    // Update budget spent
    try {
      updateBudgetSpent(data.amount);
    } catch (error) {
      console.warn('Error updating budget:', error);
    }
    return newExpense;
  };

  const updateExpense = (id: string, data: Partial<Expense>) => {
    setExpenses((prev) => {
      const oldExpense = prev.find((e) => e.id === id);
      const updated = prev.map((expense) =>
        expense.id === id ? { ...expense, ...data } : expense
      );
      
      // Update budget if amount changed
      if (oldExpense && data.amount !== undefined && data.amount !== oldExpense.amount) {
        try {
          const difference = data.amount - oldExpense.amount;
          updateBudgetSpent(difference);
        } catch (error) {
          console.warn('Error updating budget:', error);
        }
      }
      
      return updated;
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => {
      const expense = prev.find((e) => e.id === id);
      if (expense) {
        // Subtract from budget
        try {
          updateBudgetSpent(-expense.amount);
        } catch (error) {
          console.warn('Error updating budget:', error);
        }
      }
      return prev.filter((expense) => expense.id !== id);
    });
  };

  const setFilters = (newFilters: ExpenseFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const filterByCurrentMonth = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFiltersState({ startDate, endDate });
  };

  const filterByLastMonth = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    setFiltersState({ startDate, endDate });
  };

  return {
    expenses: sortedExpenses,
    allExpenses: expenses,
    totalExpenses,
    expensesByCategory,
    expensesByPaymentMethod,
    expensesByMonth,
    filters,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    clearFilters,
    filterByCurrentMonth,
    filterByLastMonth,
  };
}

