import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '../hooks';
import { formatCurrency } from '../utils';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export function MonthForecastCard() {
  const { forecast } = useDashboard();

  if (!forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previsão do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  const isOverProjection = forecast.projectedTotal > (forecast.currentSpent / forecast.daysRemaining) * 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Previsão do Mês
        </CardTitle>
        <CardDescription>Projeção baseada nos gastos até agora</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Gasto Atual:</span>
            <span className="text-lg font-semibold">{formatCurrency(forecast.currentSpent)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Projeção Total:</span>
            <span
              className={`flex items-center gap-1 text-lg font-semibold ${
                isOverProjection ? 'text-destructive' : 'text-green-600'
              }`}
            >
              {isOverProjection ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatCurrency(forecast.projectedTotal)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Média Diária Atual:</span>
            <span className="font-medium">{formatCurrency(forecast.dailyAverage)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Média Diária Projetada:</span>
            <span className="font-medium">{formatCurrency(forecast.projectedDailyAverage)}</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
            <span>Dias restantes: {forecast.daysRemaining}</span>
            <span>Progresso do mês</span>
          </div>
          <Progress value={((30 - forecast.daysRemaining) / 30) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
