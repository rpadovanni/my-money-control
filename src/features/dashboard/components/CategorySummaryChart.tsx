import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useDashboard } from '../hooks';
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
  amount: {
    label: 'Valor',
  },
} as const;

export function CategorySummaryChart() {
  const { categoryData } = useDashboard();

  const chartData = categoryData.map((cat) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage.toFixed(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhum dado disponível</p>
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
                  return data ? `${data.name}: ${data.percentage}%` : '';
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
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">{data.name}</span>
                            <span className="text-sm font-bold">{formatCurrency(data.value as number)}</span>
                          </div>
                          {chartItem && (
                            <div className="text-muted-foreground text-xs">{chartItem.percentage}% do total</div>
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
