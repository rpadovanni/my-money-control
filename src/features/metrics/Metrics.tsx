import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricsSummary } from './components/MetricsSummary';
import { BurnRateCard } from './components/BurnRateCard';
import { SavingRateCard } from './components/SavingRateCard';
import { DistributionChart } from './components/DistributionChart';

export default function Metrics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Métricas Financeiras</h1>
      </div>

      <MetricsSummary />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BurnRateCard />
            <SavingRateCard />
          </div>
        </TabsContent>
        <TabsContent value="distribution" className="space-y-4">
          <DistributionChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}

