import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyChecklist } from './components/MonthlyChecklist';
import { WeeklyChecklist } from './components/WeeklyChecklist';

export default function Checklist() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checklist</h1>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <MonthlyChecklist />
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <WeeklyChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}

