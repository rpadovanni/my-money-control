import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useBudget } from '../hooks';
import { formatCurrency } from '../utils';
import { TRANSACTION_CATEGORIES } from '../../transactions/types';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export function BudgetSummary() {
  const { budgetSummary } = useBudget();

  if (budgetSummary.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Orçamento</CardTitle>
          <CardDescription>Nenhum orçamento configurado para o mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Configure orçamentos por categoria para visualizar o resumo.
          </p>
        </CardContent>
      </Card>
    );
  }

  const overallPercentage =
    budgetSummary.totalLimit > 0
      ? (budgetSummary.totalSpent / budgetSummary.totalLimit) * 100
      : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
          <CardDescription>Visão geral do orçamento do mês atual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total Gasto</span>
              <span className="font-semibold">
                {formatCurrency(budgetSummary.totalSpent)} / {formatCurrency(budgetSummary.totalLimit)}
              </span>
            </div>
            <Progress value={Math.min(overallPercentage, 100)} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {overallPercentage.toFixed(1)}% utilizado
              </span>
              <span
                className={
                  budgetSummary.totalRemaining >= 0
                    ? 'text-green-600 font-semibold'
                    : 'text-destructive font-semibold'
                }
              >
                {budgetSummary.totalRemaining >= 0 ? 'Restante: ' : 'Excedido: '}
                {formatCurrency(Math.abs(budgetSummary.totalRemaining))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{budgetSummary.categories.length}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{budgetSummary.warningCount}</div>
              <div className="text-sm text-muted-foreground">Atenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{budgetSummary.exceededCount}</div>
              <div className="text-sm text-muted-foreground">Excedidas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Por Categoria</CardTitle>
          <CardDescription>Detalhamento do orçamento por categoria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgetSummary.categories.map((status) => {
            const getStatusIcon = () => {
              if (status.isExceeded) {
                return <XCircle className="h-4 w-4 text-destructive" />;
              }
              if (status.isWarning) {
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
              }
              return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            };

            const getStatusBadge = () => {
              if (status.isExceeded) {
                return <Badge variant="destructive">Excedido</Badge>;
              }
              if (status.isWarning) {
                return (
                  <Badge variant="outline" className="border-orange-500 text-orange-700">
                    Atenção
                  </Badge>
                );
              }
              return <Badge variant="default" className="bg-green-500">Dentro do Limite</Badge>;
            };

            return (
              <div key={status.category} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className="font-medium">
                      {TRANSACTION_CATEGORIES[status.category]}
                    </span>
                  </div>
                  {getStatusBadge()}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Gasto</span>
                    <span className="font-semibold">
                      {formatCurrency(status.spent)} / {formatCurrency(status.limit)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(status.percentage, 100)}
                    className={
                      status.isExceeded
                        ? 'bg-destructive'
                        : status.isWarning
                        ? 'bg-orange-500'
                        : ''
                    }
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {status.percentage.toFixed(1)}% utilizado
                    </span>
                    <span
                      className={
                        status.remaining >= 0
                          ? 'text-green-600 font-semibold'
                          : 'text-destructive font-semibold'
                      }
                    >
                      {status.remaining >= 0 ? 'Restante: ' : 'Excedido: '}
                      {formatCurrency(Math.abs(status.remaining))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
