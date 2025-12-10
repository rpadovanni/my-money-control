import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useDashboard } from '../hooks';
import { formatCurrency, formatMonth } from '../utils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export function MonthlySpendingChart() {
  const { monthlyData } = useDashboard();

  const chartData = monthlyData.map((month) => ({
    month: formatMonth(month.month, month.year),
    total: month.total,
    expenses: month.expenses,
    creditCard: month.creditCard,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Mensais</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhum dado disponível</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              <Bar dataKey="creditCard" fill="var(--color-creditCard)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
