import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixedCostsTable } from './components/FixedCostsTable';
import { FixedCostsSummary } from './components/FixedCostsSummary';

export default function FixedCosts() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Custos Fixos</h1>
      </div>

      <FixedCostsSummary />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Listagem</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <FixedCostsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

