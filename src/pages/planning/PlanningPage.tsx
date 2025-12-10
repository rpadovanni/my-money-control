import { useState } from 'react';
import { IncomeCard } from './components/IncomeCard';
import { LimitCard } from './components/LimitCard';
import { LimitList } from './components/LimitList';
import { LimitModal } from './components/LimitModal';
import { DistributionChart } from './components/DistributionChart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function PlanningPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddLimit = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditLimit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Planejamento Financeiro</h1>
        <Button onClick={handleAddLimit}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar limite
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <IncomeCard />
        <LimitCard />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LimitList onEdit={handleEditLimit} />
        <DistributionChart />
      </div>

      <LimitModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        editingId={editingId}
      />
    </div>
  );
}
