import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetsTable } from './components/BudgetsTable';
import { BudgetSummary } from './components/BudgetSummary';
import { BudgetChart } from './components/BudgetChart';
import { BudgetAlerts } from './components/BudgetAlerts';
import { BudgetSimulation } from './components/BudgetSimulation';

export default function Budgets() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
      </div>

      <BudgetSummary />
      <BudgetAlerts />

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="chart">Gráficos</TabsTrigger>
          <TabsTrigger value="simulation">Simulação</TabsTrigger>
        </TabsList>
        <TabsContent value="config" className="space-y-4">
          <BudgetsTable />
        </TabsContent>
        <TabsContent value="chart" className="space-y-4">
          <BudgetChart />
        </TabsContent>
        <TabsContent value="simulation" className="space-y-4">
          <BudgetSimulation />
        </TabsContent>
      </Tabs>
    </div>
  );
}

