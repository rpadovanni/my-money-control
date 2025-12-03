import { useState } from 'react';
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
import { useFixedCosts } from '../hooks';
import { formatCurrency } from '../utils';
import { FixedCostForm } from './FixedCostForm';
import type { FixedCost } from '../types';
import { FIXED_COST_TYPES, RENEWAL_CYCLES } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function FixedCostsTable() {
  const { fixedCosts, deleteFixedCost } = useFixedCosts();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<FixedCost | undefined>();

  const handleEdit = (cost: FixedCost) => {
    setEditingCost(cost);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCost(undefined);
    setFormOpen(true);
  };

  // Calculate monthly equivalent for display
  const getMonthlyEquivalent = (cost: FixedCost): number => {
    return cost.renewalCycle === 'monthly' ? cost.amount : cost.amount / 12;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Custos Fixos</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Custo Fixo
          </Button>
        </CardHeader>
        <CardContent>
          {fixedCosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum custo fixo registrado. Clique em "Novo Custo Fixo" para adicionar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Equivalente Mensal</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedCosts.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {FIXED_COST_TYPES[cost.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{RENEWAL_CYCLES[cost.renewalCycle]}</TableCell>
                    <TableCell>
                      {formatCurrency(cost.amount)} /{' '}
                      {cost.renewalCycle === 'monthly' ? 'mês' : 'ano'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(getMonthlyEquivalent(cost))} / mês
                    </TableCell>
                    <TableCell>Dia {cost.dueDay}</TableCell>
                    <TableCell>
                      <Badge variant={cost.active ? 'default' : 'secondary'}>
                        {cost.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(cost)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFixedCost(cost.id)}
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
      <FixedCostForm open={formOpen} onOpenChange={setFormOpen} fixedCost={editingCost} />
    </>
  );
}
