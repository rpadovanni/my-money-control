import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncome } from '../hooks';
import { formatCurrency } from '../utils';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export function IncomeSummary() {
  const { totalIncome, totalReceivedIncome, totalPendingIncome } = useIncome();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <CardDescription className="mt-1">Todas as receitas registradas</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas Recebidas</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceivedIncome)}</div>
          <CardDescription className="mt-1">Total já recebido</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalPendingIncome)}</div>
          <CardDescription className="mt-1">Aguardando recebimento</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

