import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgets } from '../hooks';
import { formatCurrency } from '../utils';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export function BudgetSummary() {
  const { totalBudgetLimit, getBudgetSimulation } = useBudgets();
  const simulation = getBudgetSimulation();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Limite Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBudgetLimit)}</div>
          <CardDescription className="mt-1">Orçamento total do mês</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos Projetados</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${simulation.isExceeded ? 'text-destructive' : ''}`}>
            {formatCurrency(simulation.projectedSpending)}
          </div>
          <CardDescription className="mt-1">
            {simulation.isExceeded ? 'Orçamento excedido' : 'Total projetado para o mês'}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${simulation.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${simulation.remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
            {formatCurrency(simulation.remaining)}
          </div>
          <CardDescription className="mt-1">
            {simulation.remaining < 0 ? 'Déficit no orçamento' : 'Valor disponível'}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

