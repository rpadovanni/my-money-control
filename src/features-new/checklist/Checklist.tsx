import { ChecklistCard } from './components/ChecklistCard';
import { useChecklist } from './hooks';

export default function Checklist() {
  const {
    monthlyChecklist,
    weeklyChecklist,
    monthlyProgress,
    weeklyProgress,
  } = useChecklist();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checklist Financeiro</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChecklistCard
          title="Checklist Mensal"
          description="Tarefas importantes para realizar no início de cada mês"
          items={monthlyChecklist}
          progress={monthlyProgress}
          period="monthly"
        />

        <ChecklistCard
          title="Checklist Semanal"
          description="Tarefas para manter suas finanças organizadas durante a semana"
          items={weeklyChecklist}
          progress={weeklyProgress}
          period="weekly"
        />
      </div>
    </div>
  );
}
