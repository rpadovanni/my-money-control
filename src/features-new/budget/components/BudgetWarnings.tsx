import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudget } from '../hooks';
import { formatCurrency } from '../utils';
import { TRANSACTION_CATEGORIES } from '../../transactions/types';
import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export function BudgetWarnings() {
  const { budgetWarnings } = useBudget();

  if (budgetWarnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Orçamento</CardTitle>
          <CardDescription>Status atual do orçamento por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-green-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-700">
                Todas as categorias estão dentro do orçamento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const exceededWarnings = budgetWarnings.filter((w) => w.type === 'exceeded');
  const warningAlerts = budgetWarnings.filter((w) => w.type === 'warning');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Orçamento</CardTitle>
        <CardDescription>Status atual do orçamento por categoria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {exceededWarnings.map((warning) => (
          <div
            key={warning.category}
            className="rounded-lg border border-destructive bg-destructive/10 p-4"
          >
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">
                    {TRANSACTION_CATEGORIES[warning.category]}
                  </Badge>
                  <span className="text-sm font-semibold text-destructive">
                    Orçamento Excedido
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{warning.message}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Limite: {formatCurrency(warning.limit)} | Gasto:{' '}
                  {formatCurrency(warning.spent)} ({warning.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        ))}

        {warningAlerts.map((warning) => (
          <div
            key={warning.category}
            className="rounded-lg border border-orange-500 bg-orange-50 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="border-orange-500 text-orange-700">
                    {TRANSACTION_CATEGORIES[warning.category]}
                  </Badge>
                  <span className="text-sm font-semibold text-orange-800">Atenção</span>
                </div>
                <p className="text-sm text-orange-700">{warning.message}</p>
                <div className="mt-2 text-xs text-orange-600">
                  Limite: {formatCurrency(warning.limit)} | Gasto:{' '}
                  {formatCurrency(warning.spent)} ({warning.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

