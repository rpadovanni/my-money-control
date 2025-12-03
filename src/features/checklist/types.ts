// Types for checklist feature

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface MonthlyChecklist {
  month: string; // Format: YYYY-MM
  items: ChecklistItem[];
  lastResetDate: Date;
}

export interface WeeklyChecklist {
  week: string; // Format: YYYY-WW
  items: ChecklistItem[];
  lastResetDate: Date;
}

export const DEFAULT_MONTHLY_ITEMS: Omit<ChecklistItem, 'id' | 'checked'>[] = [
  { label: 'Revisar orçamento mensal' },
  { label: 'Pagar contas fixas' },
  { label: 'Revisar investimentos' },
  { label: 'Analisar gastos do mês' },
  { label: 'Planejar próximo mês' },
  { label: 'Revisar metas financeiras' },
];

export const DEFAULT_WEEKLY_ITEMS: Omit<ChecklistItem, 'id' | 'checked'>[] = [
  { label: 'Revisar gastos da semana' },
  { label: 'Verificar saldo bancário' },
  { label: 'Organizar comprovantes' },
  { label: 'Atualizar planilha de controle' },
];

