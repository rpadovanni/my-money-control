import { useEffect } from 'react';
import { InvestmentBreakdown, InvestmentsList, useInvestments } from '@/features/investments';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { InvestmentForm } from '@/features/investments/components/InvestmentForm';

export function InvestmentsPage() {
  const { fetchInvestments } = useInvestments();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
          <p className="text-muted-foreground">
            Gerencie seu portfólio de investimentos
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Investimento
        </Button>
      </div>

      <InvestmentBreakdown />

      <InvestmentsList />

      <InvestmentForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}


