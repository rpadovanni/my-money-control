import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useInvestments } from '../hooks';
import { formatCurrency, formatDate } from '../utils';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { RefreshCw } from 'lucide-react';

const chartConfig = {
  price: {
    label: 'Preço',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function PriceChart() {
  const { assets, getPriceHistory, updatePriceHistory, refreshAllPrices } = useInvestments();
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [chartData, setChartData] = useState<Array<{ date: string; price: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedAssetId) {
      const history = getPriceHistory(selectedAssetId);
      const formatted = history.map((ph) => ({
        date: formatDate(ph.date),
        price: ph.price,
      }));
      setChartData(formatted);
    } else if (assets.length > 0) {
      setSelectedAssetId(assets[0].id);
    }
  }, [selectedAssetId, assets, getPriceHistory]);

  const handleRefresh = async () => {
    if (selectedAssetId) {
      setIsLoading(true);
      await updatePriceHistory(selectedAssetId);
      const history = getPriceHistory(selectedAssetId);
      const formatted = history.map((ph) => ({
        date: formatDate(ph.date),
        price: ph.price,
      }));
      setChartData(formatted);
      setIsLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    setIsLoading(true);
    await refreshAllPrices();
    if (selectedAssetId) {
      const history = getPriceHistory(selectedAssetId);
      const formatted = history.map((ph) => ({
        date: formatDate(ph.date),
        price: ph.price,
      }));
      setChartData(formatted);
    }
    setIsLoading(false);
  };

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Preços</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Cadastre ativos para visualizar gráficos de preços.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gráfico de Preços</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || !selectedAssetId}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um ativo" />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.code} - {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum histórico de preços disponível. Clique em "Atualizar" para gerar dados.
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

