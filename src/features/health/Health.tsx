import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecurringExpensesTable } from './components/RecurringExpensesTable';
import { ConsultationsTable } from './components/ConsultationsTable';
import { MedicationsTable } from './components/MedicationsTable';
import { HealthSummary } from './components/HealthSummary';

export default function Health() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saúde</h1>
      </div>

      <HealthSummary />

      <Tabs defaultValue="recurring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recurring">Despesas Recorrentes</TabsTrigger>
          <TabsTrigger value="consultations">Consultas</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="recurring" className="space-y-4">
          <RecurringExpensesTable />
        </TabsContent>
        <TabsContent value="consultations" className="space-y-4">
          <ConsultationsTable />
        </TabsContent>
        <TabsContent value="medications" className="space-y-4">
          <MedicationsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

