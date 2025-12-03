// Types for checklist feature
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  period: 'weekly' | 'monthly';
}

