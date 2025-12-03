import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMetrics } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SavingRateCard() {
  const { savingRate } = useMetrics();

  const isPositive = savingRate.rate > 0;
  const progressValue = Math.min(Math.max(savingRate.rate, 0), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Poupança</CardTitle>
        <CardDescription>
          Percentual da receita que está sendo poupado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Taxa de Poupança</span>
            <Badge
              variant={isPositive ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatPercent(savingRate.rate)}
            </Badge>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Receitas</p>
            <p className="text-lg font-semibold">{formatCurrency(savingRate.income)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="text-lg font-semibold">{formatCurrency(savingRate.expenses)}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">Poupança</p>
          <p
            className={`text-2xl font-bold ${
              savingRate.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {savingRate.amount >= 0 ? '+' : ''}
            {formatCurrency(savingRate.amount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
