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
import { useHealth } from '../hooks';
import { formatCurrency } from '../utils';
import { RecurringExpenseForm } from './RecurringExpenseForm';
import { useState } from 'react';
import type { RecurringExpense } from '../types';
import { Trash2, Edit, Plus, CheckCircle2, XCircle } from 'lucide-react';

export function RecurringExpensesTable() {
  const { recurringExpenses, deleteRecurringExpense, toggleRecurringExpenseActive } = useHealth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | undefined>();

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingExpense(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Despesas Recorrentes</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Despesa
        </Button>
      </CardHeader>
      <CardContent>
        {recurringExpenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma despesa recorrente registrada. Clique em "Nova Despesa" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>Dia {expense.dueDay}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRecurringExpenseActive(expense.id)}
                      className="flex items-center gap-2"
                    >
                      {expense.active ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Ativo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Inativo</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecurringExpense(expense.id)}
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
      <RecurringExpenseForm open={formOpen} onOpenChange={setFormOpen} recurringExpense={editingExpense} />
    </Card>
  );
}

