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
import { usePurchases, useCreditCards } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { PurchaseForm } from './PurchaseForm';
import { useState } from 'react';
import type { Purchase } from '../types';
import { PURCHASE_CATEGORIES } from '../types';
import { Trash2, Edit, Plus } from 'lucide-react';

interface PurchasesTableProps {
  cardId?: string;
}

export function PurchasesTable({ cardId }: PurchasesTableProps) {
  const { purchases, deletePurchase } = usePurchases(cardId);
  const { getCardById } = useCreditCards();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>();

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingPurchase(undefined);
    setFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Compras</CardTitle>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Compra
        </Button>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma compra registrada. Clique em "Nova Compra" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                {!cardId && <TableHead>Cartão</TableHead>}
                <TableHead>Parcelas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => {
                const card = getCardById(purchase.cardId);
                return (
                  <TableRow key={purchase.id}>
                    <TableCell>{formatDate(purchase.date)}</TableCell>
                    <TableCell className="font-medium">{purchase.description}</TableCell>
                    <TableCell>{PURCHASE_CATEGORIES[purchase.category]}</TableCell>
                    <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                    {!cardId && (
                      <TableCell>
                        {card
                          ? `${card.name || 'Cartão sem nome'} ${card.lastFourDigits ? `•••• ${card.lastFourDigits}` : ''}`
                          : '-'}
                      </TableCell>
                    )}
                    <TableCell>
                      {purchase.installments && purchase.installments > 1
                        ? `${purchase.currentInstallment || 1}/${purchase.installments}`
                        : 'À vista'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(purchase)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePurchase(purchase.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <PurchaseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        purchase={editingPurchase}
        defaultCardId={cardId}
      />
    </Card>
  );
}

