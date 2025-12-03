import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudgets } from '../hooks';
import { formatCurrency, formatMonthYear } from '../utils';
import { CategoryBudgetForm } from './CategoryBudgetForm';
import { useState } from 'react';
import type { CategoryBudget } from '../types';
import { TRANSACTION_CATEGORIES } from '../../features-new/transactions/types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function BudgetsTable() {
  const { categoryBudgets, deleteCategoryBudget } = useBudgets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<CategoryBudget | undefined>();

  const handleEdit = (budget: CategoryBudget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingBudget(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orçamentos por Categoria</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </CardHeader>
      <CardContent>
        {categoryBudgets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum orçamento configurado. Clique em "Novo Orçamento" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Limite</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <Badge variant="secondary">
                      {TRANSACTION_CATEGORIES[budget.category as keyof typeof TRANSACTION_CATEGORIES] || budget.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(budget.limit)}</TableCell>
                  <TableCell>{formatMonthYear(budget.month, budget.year)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategoryBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CategoryBudgetForm open={formOpen} onOpenChange={setFormOpen} budget={editingBudget} />
    </Card>
  );
}

