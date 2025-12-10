import { useEffect } from 'react';
import { TransactionFilters, TransactionTable, useTransactions } from '@/features/transactions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TransactionForm } from '@/features/transactions/components/TransactionForm';

export function TransactionsPage() {
  const { fetchTransactions } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Transação
        </Button>
      </div>

      <TransactionFilters />

      <TransactionTable />

      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

