import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMetrics } from '../hooks';
import { formatCurrency, formatPercent } from '../utils';
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '../../features-new/transactions/types';
import { PURCHASE_CATEGORIES } from '../../credit-card/types';

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

export function DistributionChart() {
  const { expenseDistribution } = useMetrics();

  // Prepare data for category pie chart
  const categoryChartData = expenseDistribution.byCategory.map((item, index) => {
    // Try to get label from TRANSACTION_CATEGORIES or PURCHASE_CATEGORIES
    let label = item.category;
    if (TRANSACTION_CATEGORIES[item.category as keyof typeof TRANSACTION_CATEGORIES]) {
      label = TRANSACTION_CATEGORIES[item.category as keyof typeof TRANSACTION_CATEGORIES];
    } else if (PURCHASE_CATEGORIES[item.category as keyof typeof PURCHASE_CATEGORIES]) {
      label = PURCHASE_CATEGORIES[item.category as keyof typeof PURCHASE_CATEGORIES];
    }

    return {
      name: label,
      value: item.amount,
      percentage: item.percentage,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  // Prepare data for payment method chart
  const paymentMethodChartData = expenseDistribution.byPaymentMethod.map((item, index) => {
    let label = item.category;
    if (item.category === 'credit-card') {
      label = 'Cartão de Crédito';
    } else {
      label = PAYMENT_METHODS[item.category as keyof typeof PAYMENT_METHODS] || item.category;
    }

    return {
      name: label,
      value: item.amount,
      percentage: item.percentage,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="category" className="space-y-4">
          <TabsList>
            <TabsTrigger value="category">Por Categoria</TabsTrigger>
            <TabsTrigger value="payment">Por Forma de Pagamento</TabsTrigger>
          </TabsList>
          <TabsContent value="category" className="space-y-4">
            {categoryChartData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum dado disponível para o período.
              </p>
            ) : (
              <>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name}: ${formatPercent(percentage)}`}
                    >
                      {categoryChartData.map((entry, index) => (
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
                  {categoryChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
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
              </>
            )}
          </TabsContent>
          <TabsContent value="payment" className="space-y-4">
            {paymentMethodChartData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum dado disponível para o período.
              </p>
            ) : (
              <>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={paymentMethodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-amount)" radius={4} />
                  </BarChart>
                </ChartContainer>
                <div className="space-y-2">
                  {paymentMethodChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

