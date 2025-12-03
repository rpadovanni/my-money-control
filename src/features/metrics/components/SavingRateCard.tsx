import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMetrics } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export function SavingRateCard() {
  const { savingRate } = useMetrics();
  const isPositive = savingRate.rate >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          Taxa de Poupança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taxa</span>
            <span
              className={`text-2xl font-bold flex items-center gap-2 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {formatPercent(savingRate.rate)}
            </span>
          </div>

          <div className="pt-2">
            <Progress
              value={Math.abs(savingRate.rate)}
              className="h-2"
            />
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor Economizado</span>
            <span
              className={`text-lg font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(savingRate.amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Receitas Totais</span>
            <span className="text-sm font-medium">{formatCurrency(savingRate.income)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Despesas Totais</span>
            <span className="text-sm font-medium">{formatCurrency(savingRate.expenses)}</span>
          </div>
        </div>

        {isPositive && savingRate.rate > 20 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <PiggyBank className="h-4 w-4" />
              <span>Excelente! Você está economizando mais de 20%!</span>
            </div>
          </div>
        )}

        {!isPositive && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <TrendingDown className="h-4 w-4" />
              <span>Despesas superam receitas. Considere revisar seus gastos.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

