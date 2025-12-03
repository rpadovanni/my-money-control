import type { RecurringExpense, Consultation, Medication, HealthSummary } from './types';

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

export function calculateHealthSummary(
  recurringExpenses: RecurringExpense[],
  consultations: Consultation[],
  medications: Medication[]
): HealthSummary {
  const recurringTotal = recurringExpenses
    .filter((expense) => expense.active)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const consultationsTotal = consultations.reduce((sum, consultation) => sum + consultation.amount, 0);

  const medicationsTotal = medications
    .filter((medication) => medication.active)
    .reduce((sum, medication) => sum + medication.amount, 0);

  return {
    recurringTotal,
    consultationsTotal,
    medicationsTotal,
    total: recurringTotal + consultationsTotal + medicationsTotal,
  };
}

export function getCurrentMonthConsultations(consultations: Consultation[]): Consultation[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return consultations.filter((consultation) => {
    const consultationDate = new Date(consultation.date);
    return (
      consultationDate.getMonth() === currentMonth &&
      consultationDate.getFullYear() === currentYear
    );
  });
}

export function getCurrentMonthMedicationsTotal(medications: Medication[]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return medications
    .filter((medication) => {
      if (!medication.active) return false;
      const startDate = new Date(medication.startDate);
      const endDate = medication.endDate ? new Date(medication.endDate) : null;

      // Check if medication is active in current month
      const isAfterStart =
        startDate.getFullYear() < currentYear ||
        (startDate.getFullYear() === currentYear && startDate.getMonth() <= currentMonth);
      const isBeforeEnd =
        !endDate ||
        endDate.getFullYear() > currentYear ||
        (endDate.getFullYear() === currentYear && endDate.getMonth() >= currentMonth);

      return isAfterStart && isBeforeEnd;
    })
    .reduce((sum, medication) => sum + medication.amount, 0);
}

export function sortRecurringExpensesByDueDay(expenses: RecurringExpense[]): RecurringExpense[] {
  return [...expenses].sort((a, b) => {
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }
    return a.dueDay - b.dueDay;
  });
}

export function sortConsultationsByDate(consultations: Consultation[]): Consultation[] {
  return [...consultations].sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });
}

export function sortMedicationsByName(medications: Medication[]): Medication[] {
  return [...medications].sort((a, b) => {
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

