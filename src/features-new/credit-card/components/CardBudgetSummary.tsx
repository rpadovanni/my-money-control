import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBudget, useCreditCards } from '../hooks';
import { useAtomValue } from 'jotai';
import { getCardBudgetProgressAtom } from '../selectors';
import { formatCurrency } from '../utils';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { MonthlyBudget } from '../types';

interface BudgetFormData {
  limit: number;
}

export function CardBudgetSummary() {
  const { cards } = useCreditCards();
  const { setBudget } = useBudget();
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const form = useForm<BudgetFormData>({
    defaultValues: {
      limit: 0,
    },
  });

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const handleSetBudget = (cardId: string) => {
    setSelectedCardId(cardId);
    form.reset({ limit: 0 });
    setBudgetFormOpen(true);
  };

  const onSubmit = (data: BudgetFormData) => {
    if (!selectedCardId) return;

    setBudget({
      cardId: selectedCardId,
      month: currentMonth,
      year: currentYear,
      limit: data.limit,
      spent: 0,
    });

    form.reset();
    setBudgetFormOpen(false);
    setSelectedCardId('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orçamento por Cartão</CardTitle>
          <CardDescription>
            Acompanhe o uso do limite de cada cartão no mês atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum cartão cadastrado
            </p>
          ) : (
            cards.map((card) => {
              const progress = useAtomValue(getCardBudgetProgressAtom(card.id));

              if (!progress) {
                return (
                  <Card key={card.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{card.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Orçamento não configurado
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetBudget(card.id)}
                      >
                        Configurar
                      </Button>
                    </div>
                  </Card>
                );
              }

              const getStatusIcon = () => {
                if (progress.isExceeded) {
                  return <XCircle className="h-5 w-5 text-destructive" />;
                }
                if (progress.isWarning) {
                  return <AlertTriangle className="h-5 w-5 text-orange-500" />;
                }
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
              };

              const getStatusBadge = () => {
                if (progress.isExceeded) {
                  return (
                    <Badge variant="destructive">Excedido</Badge>
                  );
                }
                if (progress.isWarning) {
                  return (
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      Atenção
                    </Badge>
                  );
                }
                return (
                  <Badge variant="default" className="bg-green-500">
                    Dentro do Limite
                  </Badge>
                );
              };

              return (
                <Card key={card.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <div>
                          <h3 className="font-semibold">{progress.cardName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Limite: {formatCurrency(progress.limit)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge()}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Gasto</span>
                        <span className="font-semibold">
                          {formatCurrency(progress.spent)} / {formatCurrency(progress.limit)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(progress.percentage, 100)}
                        className={
                          progress.isExceeded
                            ? 'bg-destructive'
                            : progress.isWarning
                            ? 'bg-orange-500'
                            : ''
                        }
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {progress.percentage.toFixed(1)}% utilizado
                        </span>
                        <span
                          className={
                            progress.remaining >= 0
                              ? 'text-green-600 font-semibold'
                              : 'text-destructive font-semibold'
                          }
                        >
                          {progress.remaining >= 0 ? 'Restante: ' : 'Excedido: '}
                          {formatCurrency(Math.abs(progress.remaining))}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleSetBudget(card.id)}
                    >
                      Ajustar Orçamento
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={budgetFormOpen} onOpenChange={setBudgetFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Orçamento</DialogTitle>
            <DialogDescription>
              Defina o limite de gastos para este cartão no mês atual
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite Mensal (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBudgetFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
