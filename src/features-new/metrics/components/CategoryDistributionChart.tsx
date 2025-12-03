import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { useMetrics } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { TRANSACTION_CATEGORIES } from '../../transactions/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
  'hsl(var(--chart-9))',
  'hsl(var(--chart-10))',
];

const chartConfig = {
  amount: {
    label: 'Valor',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function CategoryDistributionChart() {
  const { distributionByCategory } = useMetrics();

  if (distributionByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>Gastos agrupados por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum gasto registrado para exibir distribuição.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = distributionByCategory.map((item, index) => ({
    name: TRANSACTION_CATEGORIES[item.category as keyof typeof TRANSACTION_CATEGORIES] || item.category,
    value: item.amount,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Categoria</CardTitle>
        <CardDescription>Gastos agrupados por categoria no mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${formatPercent(percentage)}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">{data.name}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Valor:</span>
                            <span className="text-sm font-bold">{formatCurrency(data.value)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Percentual:</span>
                            <span className="text-sm font-bold">{formatPercent(data.percentage)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value, entry: any) => {
                  const item = chartData.find((d) => d.name === value);
                  return `${value} (${formatPercent(item?.percentage || 0)})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

