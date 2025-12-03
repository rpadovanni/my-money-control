import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMetrics } from '../hooks';
import { formatCurrency } from '../utils';
import { MetricCard } from './MetricCard';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function BurnRateCard() {
  const { burnRate } = useMetrics();

  const isPositive = burnRate.monthly > 0;
  const trend = isPositive ? 'down' : 'up';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate</CardTitle>
          <CardDescription>
            Taxa de queima mensal (gastos - receitas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Mensal"
              value={formatCurrency(burnRate.monthly)}
              icon={isPositive ? <TrendingDown /> : <TrendingUp />}
              trend={trend}
              trendValue={isPositive ? 'Gastando mais do que ganha' : 'Ganando mais do que gasta'}
            />
            <MetricCard
              title="Diário"
              value={formatCurrency(burnRate.daily)}
              description="Média por dia"
            />
            <MetricCard
              title="Anual"
              value={formatCurrency(burnRate.yearly)}
              description="Projeção anual"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
