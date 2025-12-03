// Types for checklist feature

export type ChecklistPeriod = 'weekly' | 'monthly';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  period: ChecklistPeriod;
}

export interface ChecklistItemState {
  itemId: string;
  completed: boolean;
  completedAt?: string; // ISO date string
  period: ChecklistPeriod;
  periodKey: string; // "2024-01" for monthly, "2024-W01" for weekly
}

// Pre-defined checklist items
export const CHECKLIST_MENSAL: ChecklistItem[] = [
  {
    id: 'monthly-1',
    title: 'Fechar mês anterior',
    description: 'Revisar todas as transações do mês anterior e garantir que estão corretas',
    period: 'monthly',
  },
  {
    id: 'monthly-2',
    title: 'Revisar orçamento',
    description: 'Analisar o orçamento do mês atual e ajustar se necessário',
    period: 'monthly',
  },
  {
    id: 'monthly-3',
    title: 'Ajustar limites do cartão',
    description: 'Revisar e ajustar os limites de orçamento dos cartões de crédito',
    period: 'monthly',
  },
  {
    id: 'monthly-4',
    title: 'Revisar categorias ativas',
    description: 'Verificar se todas as categorias de gastos estão sendo utilizadas corretamente',
    period: 'monthly',
  },
];

export const CHECKLIST_SEMANAL: ChecklistItem[] = [
  {
    id: 'weekly-1',
    title: 'Registrar transações',
    description: 'Registrar todas as transações da semana (receitas e despesas)',
    period: 'weekly',
  },
  {
    id: 'weekly-2',
    title: 'Revisar gastos do cartão',
    description: 'Conferir os gastos realizados no cartão de crédito durante a semana',
    period: 'weekly',
  },
  {
    id: 'weekly-3',
    title: 'Conferir metas de economia',
    description: 'Verificar o progresso das metas de economia e ajustar se necessário',
    period: 'weekly',
  },
];
