import { useAtom, useAtomValue } from 'jotai';
import {
  recurringExpensesAtom,
  activeRecurringExpensesAtom,
  totalRecurringExpensesAtom,
  consultationsAtom,
  currentMonthConsultationsAtom,
  totalConsultationsAtom,
  currentMonthConsultationsTotalAtom,
  medicationsAtom,
  activeMedicationsAtom,
  totalMedicationsAtom,
  currentMonthMedicationsTotalAtom,
} from '../atoms';
import type {
  RecurringExpense,
  RecurringExpenseFormData,
  Consultation,
  ConsultationFormData,
  Medication,
  MedicationFormData,
} from '../types';
import {
  sortRecurringExpensesByDueDay,
  sortConsultationsByDate,
  sortMedicationsByName,
} from '../utils';
import { useBudget } from '../../credit-card/hooks/useBudget';

export function useHealth() {
  // Recurring expenses
  const [recurringExpenses, setRecurringExpenses] = useAtom(recurringExpensesAtom);
  const activeRecurringExpenses = useAtomValue(activeRecurringExpensesAtom);
  const totalRecurringExpenses = useAtomValue(totalRecurringExpensesAtom);

  // Consultations
  const [consultations, setConsultations] = useAtom(consultationsAtom);
  const currentMonthConsultations = useAtomValue(currentMonthConsultationsAtom);
  const totalConsultations = useAtomValue(totalConsultationsAtom);
  const currentMonthConsultationsTotal = useAtomValue(currentMonthConsultationsTotalAtom);

  // Medications
  const [medications, setMedications] = useAtom(medicationsAtom);
  const activeMedications = useAtomValue(activeMedicationsAtom);
  const totalMedications = useAtomValue(totalMedicationsAtom);
  const currentMonthMedicationsTotal = useAtomValue(currentMonthMedicationsTotalAtom);

  const { updateBudgetSpent } = useBudget();

  const sortedRecurringExpenses = sortRecurringExpensesByDueDay(recurringExpenses);
  const sortedConsultations = sortConsultationsByDate(consultations);
  const sortedMedications = sortMedicationsByName(medications);

  // Recurring expenses CRUD
  const addRecurringExpense = (data: RecurringExpenseFormData) => {
    const newExpense: RecurringExpense = {
      id: crypto.randomUUID(),
      ...data,
    };
    setRecurringExpenses((prev) => [...prev, newExpense]);
    return newExpense;
  };

  const updateRecurringExpense = (id: string, data: Partial<RecurringExpenseFormData>) => {
    setRecurringExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, ...data } : expense))
    );
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const toggleRecurringExpenseActive = (id: string) => {
    setRecurringExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, active: !expense.active } : expense))
    );
  };

  // Consultations CRUD
  const addConsultation = (data: ConsultationFormData) => {
    const newConsultation: Consultation = {
      id: crypto.randomUUID(),
      ...data,
    };
    setConsultations((prev) => [...prev, newConsultation]);
    
    // Update budget
    try {
      updateBudgetSpent(data.amount);
    } catch (error) {
      console.warn('Error updating budget:', error);
    }
    
    return newConsultation;
  };

  const updateConsultation = (id: string, data: Partial<ConsultationFormData>) => {
    setConsultations((prev) => {
      const oldConsultation = prev.find((c) => c.id === id);
      const updated = prev.map((consultation) =>
        consultation.id === id ? { ...consultation, ...data } : consultation
      );
      
      // Update budget if amount changed
      if (oldConsultation && data.amount !== undefined && data.amount !== oldConsultation.amount) {
        try {
          const difference = data.amount - oldConsultation.amount;
          updateBudgetSpent(difference);
        } catch (error) {
          console.warn('Error updating budget:', error);
        }
      }
      
      return updated;
    });
  };

  const deleteConsultation = (id: string) => {
    setConsultations((prev) => {
      const consultation = prev.find((c) => c.id === id);
      if (consultation) {
        try {
          updateBudgetSpent(-consultation.amount);
        } catch (error) {
          console.warn('Error updating budget:', error);
        }
      }
      return prev.filter((consultation) => consultation.id !== id);
    });
  };

  // Medications CRUD
  const addMedication = (data: MedicationFormData) => {
    const newMedication: Medication = {
      id: crypto.randomUUID(),
      ...data,
    };
    setMedications((prev) => [...prev, newMedication]);
    return newMedication;
  };

  const updateMedication = (id: string, data: Partial<MedicationFormData>) => {
    setMedications((prev) =>
      prev.map((medication) => (medication.id === id ? { ...medication, ...data } : medication))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((medication) => medication.id !== id));
  };

  const toggleMedicationActive = (id: string) => {
    setMedications((prev) =>
      prev.map((medication) => (medication.id === id ? { ...medication, active: !medication.active } : medication))
    );
  };

  return {
    // Recurring expenses
    recurringExpenses: sortedRecurringExpenses,
    activeRecurringExpenses,
    totalRecurringExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    toggleRecurringExpenseActive,
    
    // Consultations
    consultations: sortedConsultations,
    currentMonthConsultations,
    totalConsultations,
    currentMonthConsultationsTotal,
    addConsultation,
    updateConsultation,
    deleteConsultation,
    
    // Medications
    medications: sortedMedications,
    activeMedications,
    totalMedications,
    currentMonthMedicationsTotal,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationActive,
  };
}

