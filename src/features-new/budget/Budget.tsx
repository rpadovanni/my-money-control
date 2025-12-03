import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BudgetForm } from './components/BudgetForm';
import { BudgetSummary } from './components/BudgetSummary';
import { BudgetWarnings } from './components/BudgetWarnings';
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
import { useBudget } from './hooks';
import { formatCurrency, formatMonthYear } from './utils';
import { TRANSACTION_CATEGORIES } from '../transactions/types';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function Budget() {
  const { currentMonthBudgets, deleteBudget } = useBudget();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(undefined);

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingBudget(undefined);
    setFormOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamento</h1>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="warnings">Alertas</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <BudgetSummary />
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          <BudgetWarnings />
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Orçamentos Configurados</CardTitle>
              <Button onClick={handleAdd} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </CardHeader>
            <CardContent>
              {currentMonthBudgets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum orçamento configurado. Clique em "Novo Orçamento" para adicionar.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMonthBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <Badge variant="secondary">
                            {TRANSACTION_CATEGORIES[budget.category]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatMonthYear(budget.month, budget.year)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(budget.limit)}
                        </TableCell>
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
                              onClick={() => deleteBudget(budget.id)}
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
          </Card>
          <BudgetForm open={formOpen} onOpenChange={setFormOpen} budget={editingBudget} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
