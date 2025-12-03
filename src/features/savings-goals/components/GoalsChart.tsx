import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { useSavingsGoals } from '../hooks';
import { formatCurrency } from '../utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

const chartConfig = {
  target: {
    label: 'Meta',
    color: 'hsl(var(--chart-1))',
  },
  current: {
    label: 'Atual',
    color: 'hsl(var(--chart-2))',
  },
} as const;

const COLORS = {
  active: 'hsl(var(--chart-2))',
  completed: 'hsl(var(--chart-4))',
  paused: 'hsl(var(--muted))',
};

export function GoalsChart() {
  const { activeGoals } = useSavingsGoals();

  const chartData = activeGoals.map((goal) => ({
    name: goal.name.length > 15 ? goal.name.substring(0, 15) + '...' : goal.name,
    fullName: goal.name,
    target: goal.targetAmount,
    current: goal.currentAmount,
    percentage: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
    status: goal.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma meta ativa. Crie metas para visualizar o progresso.
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
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={150}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="font-medium">{data.fullName}</div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Meta:</span>
                            <span className="text-sm font-bold">{formatCurrency(data.target)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Atual:</span>
                            <span className="text-sm font-bold">{formatCurrency(data.current)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Progresso:</span>
                            <span className="text-sm font-bold">{data.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="target" fill="var(--color-target)" radius={4} />
              <Bar dataKey="current" fill="var(--color-current)" radius={4}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.active}
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

