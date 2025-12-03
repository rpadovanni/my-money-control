import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useDashboard } from '../hooks';
import { formatCurrency } from '../utils';
import { TRANSACTION_CATEGORIES } from '../../transactions/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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
  total: {
    label: 'Total',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function DashboardCharts() {
  const { monthlySpendingChart, categoryDistributionChart } = useDashboard();

  const barChartData = monthlySpendingChart.map((item) => ({
    name: `${item.monthName}/${item.year}`,
    total: item.total,
  }));

  const pieChartData = categoryDistributionChart.map((item, index) => ({
    name: TRANSACTION_CATEGORIES[item.category as keyof typeof TRANSACTION_CATEGORIES] || item.category,
    value: item.amount,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gastos dos Últimos 6 Meses</CardTitle>
          <CardDescription>Evolução dos gastos mensais</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySpendingChart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum dado disponível
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
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
                                <span className="text-sm text-muted-foreground">Total:</span>
                                <span className="text-sm font-bold">{formatCurrency(data.total)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>Gastos agrupados por categoria no mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryDistributionChart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum gasto registrado
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
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
                                <span className="text-sm font-bold">{data.percentage.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const item = pieChartData.find((d) => d.name === value);
                      return `${value} (${item?.percentage.toFixed(1) || 0}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
