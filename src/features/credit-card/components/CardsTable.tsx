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
import { useCreditCards } from '../hooks';
import { formatCurrency } from '../utils';
import { CardForm } from './CardForm';
import { useState } from 'react';
import type { CreditCard } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

export function CardsTable() {
  const { cards, deleteCard, toggleCardActive } = useCreditCards();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>();

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCard(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cartões de Crédito</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum cartão cadastrado. Clique em "Novo Cartão" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Últimos 4 Dígitos</TableHead>
                <TableHead>Fechamento</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Limite</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.name || '-'}</TableCell>
                  <TableCell>
                    {card.lastFourDigits ? `•••• ${card.lastFourDigits}` : '-'}
                  </TableCell>
                  <TableCell>Dia {card.closingDay}</TableCell>
                  <TableCell>Dia {card.dueDay}</TableCell>
                  <TableCell>{formatCurrency(card.limit)}</TableCell>
                  <TableCell>
                    <Badge variant={card.active ? 'default' : 'secondary'}>
                      {card.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(card)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCard(card.id)}
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
      <CardForm open={formOpen} onOpenChange={setFormOpen} card={editingCard} />
    </Card>
  );
}

