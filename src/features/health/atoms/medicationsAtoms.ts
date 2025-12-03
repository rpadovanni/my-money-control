import { atom } from 'jotai';
import type { Medication } from '../types';

// Base atoms for medications
export const medicationsAtom = atom<Medication[]>([]);

// Derived atoms for medications
export const activeMedicationsAtom = atom((get) => {
  const medications = get(medicationsAtom);
  return medications.filter((medication) => medication.active);
});

export const totalMedicationsAtom = atom((get) => {
  const medications = get(activeMedicationsAtom);
  return medications.reduce((sum, medication) => sum + medication.amount, 0);
});

export const currentMonthMedicationsTotalAtom = atom((get) => {
  const medications = get(activeMedicationsAtom);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return medications
    .filter((medication) => {
      const startDate = new Date(medication.startDate);
      const endDate = medication.endDate ? new Date(medication.endDate) : null;

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
});

