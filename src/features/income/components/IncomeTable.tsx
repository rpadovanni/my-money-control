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
import { useIncome } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { IncomeForm } from './IncomeForm';
import { useState } from 'react';
import type { Income } from '../types';
import { INCOME_TYPES } from '../types';
import { Trash2, Edit, Plus, CheckCircle2, Circle } from 'lucide-react';

export function IncomeTable() {
  const { incomes, deleteIncome, toggleReceived } = useIncome();
  const [formOpen, setFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingIncome(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Receitas</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma receita registrada. Clique em "Nova Receita" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{formatDate(income.date)}</TableCell>
                  <TableCell className="font-medium">{income.description}</TableCell>
                  <TableCell>
                    <Badge variant={income.type === 'fixed' ? 'default' : 'secondary'}>
                      {INCOME_TYPES[income.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(income.amount)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReceived(income.id)}
                      className="flex items-center gap-2"
                    >
                      {income.received ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Recebido</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Pendente</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteIncome(income.id)}
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
      <IncomeForm open={formOpen} onOpenChange={setFormOpen} income={editingIncome} />
    </Card>
  );
}

