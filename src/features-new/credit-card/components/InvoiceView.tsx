import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInvoices, useCreditCards } from '../hooks';
import { useAtomValue } from 'jotai';
import { getMonthlyInvoiceAtom } from '../selectors';
import { formatCurrency, formatDate } from '../utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { PURCHASE_CATEGORIES } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

export function InvoiceView() {
  const { invoices } = useInvoices();
  const { cards } = useCreditCards();
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const selectedInvoice = selectedCardId
    ? useAtomValue(getMonthlyInvoiceAtom(selectedCardId, selectedMonth, selectedYear))
    : undefined;

  const selectedCard = cards.find((c) => c.id === selectedCardId);

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Generate year options (last 2 years and next year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Faturas do Cartão</CardTitle>
          <CardDescription>Visualize e gerencie faturas dos seus cartões</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cartão</label>
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name} - ****{card.lastFourDigits}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {monthNames[month - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedInvoice && selectedCard && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedCard.name}</CardTitle>
                <CardDescription>
                  Fatura de {monthNames[selectedInvoice.month - 1]} de {selectedInvoice.year}
                </CardDescription>
              </div>
              <Badge variant={selectedInvoice.paid ? 'default' : 'destructive'} className="flex items-center gap-2">
                {selectedInvoice.paid ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Paga
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Pendente
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-lg font-semibold">Total da Fatura</span>
              <span className="text-2xl font-bold">{formatCurrency(selectedInvoice.total)}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Compras</h3>
              {selectedInvoice.purchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma compra nesta fatura</p>
              ) : (
                <div className="space-y-2">
                  {selectedInvoice.purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{purchase.description}</span>
                          <Badge variant="secondary" className="text-xs">
                            {PURCHASE_CATEGORIES[purchase.category]}
                          </Badge>
                          {purchase.installments && purchase.currentInstallment && (
                            <Badge variant="outline" className="text-xs">
                              {purchase.currentInstallment}/{purchase.installments}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(purchase.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{formatCurrency(purchase.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant={selectedInvoice.paid ? 'outline' : 'default'}
                onClick={() => {
                  // TODO: Implement mark as paid
                }}
              >
                {selectedInvoice.paid ? 'Marcar como Pendente' : 'Marcar como Paga'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedInvoice && selectedCardId && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma fatura encontrada para o período selecionado
          </CardContent>
        </Card>
      )}
    </div>
  );
}
