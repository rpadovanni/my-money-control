import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '../hooks';
import { formatCurrency } from '../utils';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DashboardSummary() {
  const {
    totalMonthlySpending,
    totalMonthlyIncome,
    monthlyBalance,
    creditCardSpending,
    remainingBudget,
  } = useDashboard();

  const isPositive = monthlyBalance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMonthlySpending)}</div>
          <p className="text-xs text-muted-foreground mt-1">Mês atual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMonthlyIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">Mês atual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(monthlyBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive ? 'Receitas > Despesas' : 'Despesas > Receitas'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos no Cartão</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(creditCardSpending)}</div>
          <p className="text-xs text-muted-foreground mt-1">Mês atual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orçamento Restante</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(remainingBudget)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {remainingBudget >= 0 ? 'Dentro do orçamento' : 'Orçamento excedido'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
