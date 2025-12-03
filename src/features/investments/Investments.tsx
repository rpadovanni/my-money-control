import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetsTable } from './components/AssetsTable';
import { PositionSummary } from './components/PositionSummary';
import { TransactionsTable } from './components/TransactionsTable';
import { PriceChart } from './components/PriceChart';

export default function Investments() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Investimentos</h1>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Posições</TabsTrigger>
          <TabsTrigger value="assets">Ativos</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
        </TabsList>
        <TabsContent value="positions" className="space-y-4">
          <PositionSummary />
        </TabsContent>
        <TabsContent value="assets" className="space-y-4">
          <AssetsTable />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTable />
        </TabsContent>
        <TabsContent value="charts" className="space-y-4">
          <PriceChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}

