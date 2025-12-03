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
import { useState } from 'react';
import type { FixedCost } from '../types';
import { FIXED_COST_TYPES } from '../types';
import { Trash2, Edit, Plus, CheckCircle2, XCircle } from 'lucide-react';

export function FixedCostsTable() {
  const { fixedCosts, deleteFixedCost, toggleActive } = useFixedCosts();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFixedCost, setEditingFixedCost] = useState<FixedCost | undefined>();

  const handleEdit = (fixedCost: FixedCost) => {
    setEditingFixedCost(fixedCost);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingFixedCost(undefined);
    setFormOpen(true);
  };

  return (
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
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedCosts.map((fixedCost) => (
                <TableRow key={fixedCost.id}>
                  <TableCell className="font-medium">{fixedCost.description}</TableCell>
                  <TableCell>
                    <Badge variant={fixedCost.type === 'housing' ? 'default' : fixedCost.type === 'health' ? 'destructive' : 'secondary'}>
                      {FIXED_COST_TYPES[fixedCost.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(fixedCost.amount)}</TableCell>
                  <TableCell>Dia {fixedCost.dueDay}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(fixedCost.id)}
                      className="flex items-center gap-2"
                    >
                      {fixedCost.active ? (
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
                        onClick={() => handleEdit(fixedCost)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFixedCost(fixedCost.id)}
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
      <FixedCostForm open={formOpen} onOpenChange={setFormOpen} fixedCost={editingFixedCost} />
    </Card>
  );
}

