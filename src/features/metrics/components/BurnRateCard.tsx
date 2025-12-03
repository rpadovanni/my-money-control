import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMetrics } from '../hooks';
import { formatCurrency, formatNumber } from '../utils';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function BurnRateCard() {
  const { burnRate, totalExpenses, totalIncome } = useMetrics();
  const isPositive = burnRate.monthly < 0; // Negative burn rate means we're saving

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPositive ? (
            <TrendingDown className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingUp className="h-5 w-5 text-red-600" />
          )}
          Burn Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Mensal</span>
            <span
              className={`text-lg font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '-' : '+'}
              {formatCurrency(Math.abs(burnRate.monthly))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Diário</span>
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '-' : '+'}
              {formatCurrency(Math.abs(burnRate.daily))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Anual (projeção)</span>
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '-' : '+'}
              {formatCurrency(Math.abs(burnRate.yearly))}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Receitas</span>
              <span className="text-sm font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Despesas</span>
              <span className="text-sm font-medium">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>

        {burnRate.monthsUntilZero !== null && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>
                Estimativa: {formatNumber(burnRate.monthsUntilZero, 1)} meses até zerar
              </span>
            </div>
          </div>
        )}

        {isPositive && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingDown className="h-4 w-4" />
              <span>Você está economizando dinheiro!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

