import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForecast } from '../hooks';
import { formatCurrency } from '../utils';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';

export function IncomeForecast() {
  const { currentMonthForecast, nextMonthForecast } = useForecast();

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month - 1, 1);
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Previsão do Mês Atual
          </CardTitle>
          <CardDescription>
            {formatMonthYear(currentMonthForecast.month, currentMonthForecast.year)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receita Fixa</span>
              <span className="font-medium">{formatCurrency(currentMonthForecast.fixedIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receita Variável</span>
              <span className="font-medium">{formatCurrency(currentMonthForecast.variableIncome)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium">Total Previsto</span>
              <span className="text-lg font-bold">{formatCurrency(currentMonthForecast.totalIncome)}</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Recebido
              </span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {formatCurrency(currentMonthForecast.receivedIncome)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Pendente
              </span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {formatCurrency(currentMonthForecast.pendingIncome)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Previsão do Próximo Mês
          </CardTitle>
          <CardDescription>
            {formatMonthYear(nextMonthForecast.month, nextMonthForecast.year)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receita Fixa</span>
              <span className="font-medium">{formatCurrency(nextMonthForecast.fixedIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receita Variável</span>
              <span className="font-medium">{formatCurrency(nextMonthForecast.variableIncome)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium">Total Previsto</span>
              <span className="text-lg font-bold">{formatCurrency(nextMonthForecast.totalIncome)}</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Recebido
              </span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {formatCurrency(nextMonthForecast.receivedIncome)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Pendente
              </span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {formatCurrency(nextMonthForecast.pendingIncome)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

