import { atom } from 'jotai';
import type { Consultation } from '../types';

// Base atoms for consultations
export const consultationsAtom = atom<Consultation[]>([]);

// Derived atoms for consultations
export const currentMonthConsultationsAtom = atom((get) => {
  const consultations = get(consultationsAtom);
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
});

export const totalConsultationsAtom = atom((get) => {
  const consultations = get(consultationsAtom);
  return consultations.reduce((sum, consultation) => sum + consultation.amount, 0);
});

export const currentMonthConsultationsTotalAtom = atom((get) => {
  const consultations = get(currentMonthConsultationsAtom);
  return consultations.reduce((sum, consultation) => sum + consultation.amount, 0);
});

