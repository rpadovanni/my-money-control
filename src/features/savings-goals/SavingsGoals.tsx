import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoalsTable } from './components/GoalsTable';
import { GoalProgressCard } from './components/GoalProgressCard';
import { GoalsChart } from './components/GoalsChart';
import { ProgressChart } from './components/ProgressChart';

export default function SavingsGoals() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Metas Financeiras</h1>
      </div>

      <GoalProgressCard />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Listagem</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <GoalsTable />
        </TabsContent>
        <TabsContent value="progress" className="space-y-4">
          <GoalsChart />
        </TabsContent>
        <TabsContent value="distribution" className="space-y-4">
          <ProgressChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}

