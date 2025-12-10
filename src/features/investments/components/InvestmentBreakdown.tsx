import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useInvestments } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { PieChart, Pie, Cell } from 'recharts';
import { ASSET_TYPES } from '@/shared/store/types/investments';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const chartConfig = {
  amount: {
    label: 'Valor',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function InvestmentBreakdown() {
  const { distribution, totalCurrentValue, totalInvested, totalProfitLoss, totalProfitLossPercent } =
    useInvestments();

  // Prepare data for pie chart
  const chartData = distribution.map((item, index) => ({
    name: ASSET_TYPES[item.type],
    value: item.amount,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro/Prejuízo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(totalProfitLoss)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercent(totalProfitLossPercent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo de Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum investimento registrado. Adicione investimentos para ver a distribuição.
            </p>
          ) : (
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => `${name}: ${formatPercent(percentage)}`}
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
                                <span className="text-sm text-muted-foreground">Valor</span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(data.value)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">Percentual</span>
                                <span className="text-sm font-medium">
                                  {formatPercent(data.percentage)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
              <div className="space-y-2">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatPercent(item.percentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


