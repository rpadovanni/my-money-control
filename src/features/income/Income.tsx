import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncomeTable } from './components/IncomeTable';
import { IncomeForecast } from './components/IncomeForecast';
import { IncomeSummary } from './components/IncomeSummary';

export default function Income() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Receitas</h1>
      </div>

      <IncomeSummary />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Listagem</TabsTrigger>
          <TabsTrigger value="forecast">Previsão</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <IncomeTable />
        </TabsContent>
        <TabsContent value="forecast" className="space-y-4">
          <IncomeForecast />
        </TabsContent>
      </Tabs>
    </div>
  );
}

