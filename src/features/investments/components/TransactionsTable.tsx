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
import { useInvestments } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { TransactionForm } from './TransactionForm';
import { TRANSACTION_TYPES } from '../types';
import { Trash2, Plus } from 'lucide-react';

export function TransactionsTable() {
  const { transactions, assets, deleteTransaction } = useInvestments();
  const [formOpen, setFormOpen] = useState(false);

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset ? `${asset.code} - ${asset.name}` : 'N/A';
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações</CardTitle>
        <Button onClick={() => setFormOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação registrada. Clique em "Nova Transação" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Taxas</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => {
                const total = transaction.quantity * transaction.price + (transaction.fees || 0);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">
                      {getAssetName(transaction.assetId)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'buy' ? 'default' : 'secondary'}
                      >
                        {TRANSACTION_TYPES[transaction.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.quantity.toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(transaction.price)}</TableCell>
                    <TableCell>{formatCurrency(transaction.fees || 0)}</TableCell>
                    <TableCell>{formatCurrency(total)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
    </Card>
  );
}

