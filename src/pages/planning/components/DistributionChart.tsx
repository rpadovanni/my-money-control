import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { useStore } from '@/shared/store';

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

export function DistributionChart() {
  const limits = useStore((state) => state.planning.limits);
  const totalLimits = useStore((state) => state.getTotalLimits());

  if (limits.length === 0 || totalLimits === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Adicione limites para visualizar a distribuição.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = limits.map((limit) => ({
    name: limit.category,
    value: limit.amount,
    percentage: totalLimits > 0 ? ((limit.amount / totalLimits) * 100).toFixed(1) : '0.0',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
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
                          <span className="text-sm font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(data.value as number)}
                          </span>
                        </div>
                        {chartItem && (
                          <div className="text-muted-foreground text-xs">
                            {chartItem.percentage}% do total planejado
                          </div>
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
        <div className="space-y-2 mt-4">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.value)}
                </span>
                <span className="text-sm text-muted-foreground">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

