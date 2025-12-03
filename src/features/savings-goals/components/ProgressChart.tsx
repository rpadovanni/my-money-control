import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { useSavingsGoals } from '../hooks';
import { formatCurrency } from '../utils';
import { Pie, PieChart, Cell } from 'recharts';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const chartConfig = {
  current: {
    label: 'Valor Atual',
  },
} as const;

export function ProgressChart() {
  const { activeGoals } = useSavingsGoals();

  const chartData = activeGoals.map((goal) => ({
    name: goal.name,
    value: goal.currentAmount,
    target: goal.targetAmount,
    percentage: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Meta</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma meta ativa. Crie metas para visualizar a distribuição.
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => {
                  const data = chartData.find((d) => d.name === entry.name);
                  return data ? `${data.percentage.toFixed(0)}%` : '';
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const chartItem = chartData.find((d) => d.name === data.name);
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="font-medium">{data.name}</div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Atual:</span>
                            <span className="text-sm font-bold">
                              {formatCurrency(data.value as number)}
                            </span>
                          </div>
                          {chartItem && (
                            <>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">Meta:</span>
                                <span className="text-sm font-bold">
                                  {formatCurrency(chartItem.target)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {chartItem.percentage.toFixed(1)}% do objetivo
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

