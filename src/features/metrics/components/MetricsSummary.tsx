import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMetrics } from '../hooks';
import { formatCurrency } from '../utils';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export function MetricsSummary() {
  const { totalIncome, totalExpenses, savingRate } = useMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de receitas recebidas este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de despesas pagas este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <Wallet className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              savingRate.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(savingRate.amount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {savingRate.amount >= 0 ? 'Economizado' : 'Déficit'} este mês
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

