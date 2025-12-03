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
import { useTransactions } from '../hooks';
import { formatCurrency, formatDate, sortTransactionsByDate } from '../utils';
import { TransactionForm } from './TransactionForm';
import type { Transaction, TransactionType } from '../types';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '../types';
import { Trash2, Edit, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionTableProps {
  defaultType?: TransactionType;
  showTypeFilter?: boolean;
}

export function TransactionTable({ defaultType, showTypeFilter = true }: TransactionTableProps) {
  const { transactions, deleteTransaction, filters, setFilters } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setFormOpen(true);
  };

  // Filter transactions by type if defaultType is provided
  const filteredTransactions = defaultType
    ? transactions.filter((t) => t.type === defaultType)
    : transactions;

  const sortedTransactions = sortTransactionsByDate(filteredTransactions);

  const handleTypeFilter = (type: TransactionType | 'all') => {
    if (type === 'all') {
      setFilters({ ...filters, type: undefined });
    } else {
      setFilters({ ...filters, type });
    }
  };

  const currentFilter = filters.type || 'all';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações</CardTitle>
        <div className="flex items-center gap-2">
          {showTypeFilter && (
            <div className="flex gap-1">
              <Button
                variant={currentFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={currentFilter === 'income' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeFilter('income')}
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                Receitas
              </Button>
              <Button
                variant={currentFilter === 'expense' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeFilter('expense')}
              >
                <TrendingDown className="mr-1 h-3 w-3" />
                Despesas
              </Button>
            </div>
          )}
          <Button onClick={handleAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação registrada. Clique em "Nova Transação" para adicionar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.type === 'income' ? 'default' : 'destructive'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.notes || TRANSACTION_CATEGORIES[transaction.category]}
                  </TableCell>
                  <TableCell>{TRANSACTION_CATEGORIES[transaction.category]}</TableCell>
                  <TableCell>
                    {transaction.paymentMethod
                      ? PAYMENT_METHODS[transaction.paymentMethod]
                      : '-'}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.value)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction.id)}
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
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTransaction}
        defaultType={defaultType}
      />
    </Card>
  );
}
