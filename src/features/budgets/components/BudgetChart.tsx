import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { useBudgets } from '../hooks';
import { formatCurrency } from '../utils';
import { EXPENSE_CATEGORIES } from '../../expenses/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

const chartConfig = {
  limit: {
    label: 'Limite',
    color: 'hsl(var(--chart-1))',
  },
  spent: {
    label: 'Gasto',
    color: 'hsl(var(--chart-2))',
  },
} as const;

const COLORS = {
  normal: 'hsl(var(--chart-1))',
  warning: 'hsl(var(--chart-3))',
  exceeded: 'hsl(var(--destructive))',
};

export function BudgetChart() {
  const { getBudgetSimulation } = useBudgets();
  const simulation = getBudgetSimulation();

  const chartData = simulation.categories.map((status) => ({
    category: EXPENSE_CATEGORIES[status.category],
    limit: status.limit,
    spent: status.spent,
    remaining: status.remaining,
    percentage: status.percentage,
    isExceeded: status.isExceeded,
    isWarning: status.isWarning,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamento por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum orçamento configurado. Configure orçamentos por categoria para visualizar.
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={120}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">Limite:</span>
                            <span className="text-sm font-bold">{formatCurrency(data.limit)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">Gasto:</span>
                            <span className={`text-sm font-bold ${data.isExceeded ? 'text-destructive' : ''}`}>
                              {formatCurrency(data.spent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">Restante:</span>
                            <span className={`text-sm font-bold ${data.remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
                              {formatCurrency(data.remaining)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.percentage.toFixed(1)}% do limite
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="limit" fill="var(--color-limit)" radius={4} />
              <Bar dataKey="spent" fill="var(--color-spent)" radius={4}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isExceeded
                        ? COLORS.exceeded
                        : entry.isWarning
                        ? COLORS.warning
                        : COLORS.normal
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

