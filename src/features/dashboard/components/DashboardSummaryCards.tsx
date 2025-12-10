import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '../hooks';
import { formatCurrency } from '../utils';
import { Wallet, CreditCard, Target, TrendingUp } from 'lucide-react';

export function DashboardSummaryCards() {
  const { summary } = useDashboard();

  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          <Wallet className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
          <p className="text-muted-foreground text-xs">Este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Diretas</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
          <p className="text-muted-foreground text-xs">Débito/Dinheiro/PIX</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cartão de Crédito</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalCreditCard)}</div>
          <p className="text-muted-foreground text-xs">Compras no cartão</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
          <Target className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.budgetRemaining)}</div>
          <p className="text-muted-foreground mb-2 text-xs">Restante de {formatCurrency(summary.budgetLimit)}</p>
          <Progress value={summary.budgetPercentage} className="h-2" />
          <p className="text-muted-foreground mt-1 text-xs">{summary.budgetPercentage.toFixed(1)}% utilizado</p>
        </CardContent>
      </Card>
    </div>
  );
}
