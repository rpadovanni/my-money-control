import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCreditCards } from '../hooks';
import { formatCurrency, formatDate, formatMonthYear } from '../utils';
import type { Invoice } from '../types';
import { PURCHASE_CATEGORIES } from '../types';

interface InvoiceCardProps {
  invoice: Invoice;
  isFuture?: boolean;
}

export function InvoiceCard({ invoice, isFuture }: InvoiceCardProps) {
  const { getCardById } = useCreditCards();
  const card = getCardById(invoice.cardId);

  if (!card) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cartão não encontrado</CardTitle>
          <CardDescription>{formatMonthYear(invoice.month, invoice.year)}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {card.name || 'Cartão sem nome'} {card.lastFourDigits ? `•••• ${card.lastFourDigits}` : ''}
            </CardTitle>
            <CardDescription>
              {formatMonthYear(invoice.month, invoice.year)}
            </CardDescription>
          </div>
          <Badge variant={invoice.paid ? 'default' : isFuture ? 'secondary' : 'destructive'}>
            {invoice.paid ? 'Paga' : isFuture ? 'Futura' : 'Pendente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total da Fatura:</span>
            <span className="text-2xl font-bold">{formatCurrency(invoice.total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Fechamento:</span>
              <p className="font-medium">{formatDate(invoice.closingDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Vencimento:</span>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          {invoice.purchases.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Compras ({invoice.purchases.length}):</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDate(purchase.date)}</TableCell>
                      <TableCell className="font-medium">{purchase.description}</TableCell>
                      <TableCell>{PURCHASE_CATEGORIES[purchase.category]}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(purchase.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

