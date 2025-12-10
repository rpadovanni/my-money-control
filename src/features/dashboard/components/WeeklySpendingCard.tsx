import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useDashboard } from '../hooks';
import { formatCurrency, formatWeekLabel } from '../utils';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  total: {
    label: 'Total',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Despesas',
    color: 'hsl(var(--chart-2))',
  },
  creditCard: {
    label: 'Cartão',
    color: 'hsl(var(--chart-3))',
  },
} as const;

export function WeeklySpendingCard() {
  const { weeklyData } = useDashboard();

  const chartData = weeklyData.map((week) => ({
    week: `Semana ${week.week}`,
    label: formatWeekLabel(week.startDate, week.endDate),
    total: week.total,
    expenses: week.expenses,
    creditCard: week.creditCard,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Semanais do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhum dado disponível</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="text-muted-foreground text-xs">{data.label}</div>
                          {payload.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-sm font-bold">{formatCurrency(item.value as number)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="1"
                stroke="var(--color-expenses)"
                fill="var(--color-expenses)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="creditCard"
                stackId="1"
                stroke="var(--color-creditCard)"
                fill="var(--color-creditCard)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
