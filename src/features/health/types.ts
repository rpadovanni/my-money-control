// Types for health feature

// Recurring expenses (despesas recorrentes)
export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  dueDay: number; // Day of month (1-31)
  active: boolean;
  notes?: string;
}

export interface RecurringExpenseFormData {
  description: string;
  amount: number;
  dueDay: number;
  active: boolean;
  notes?: string;
}

// Consultations (consultas eventuais)
export interface Consultation {
  id: string;
  description: string;
  amount: number;
  date: Date;
  doctor?: string;
  specialty?: string;
  notes?: string;
}

export interface ConsultationFormData {
  description: string;
  amount: number;
  date: Date;
  doctor?: string;
  specialty?: string;
  notes?: string;
}

// Medications (medicamentos)
export interface Medication {
  id: string;
  name: string;
  amount: number;
  frequency: MedicationFrequency;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  notes?: string;
}

export type MedicationFrequency = 'daily' | 'weekly' | 'monthly' | 'as_needed';

export interface MedicationFormData {
  name: string;
  amount: number;
  frequency: MedicationFrequency;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  notes?: string;
}

export const MEDICATION_FREQUENCIES: Record<MedicationFrequency, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  as_needed: 'Quando necessário',
};

export interface HealthSummary {
  recurringTotal: number;
  consultationsTotal: number;
  medicationsTotal: number;
  total: number;
}

