import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpensesTable } from './components/ExpensesTable';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpensesSummary } from './components/ExpensesSummary';

export default function Expenses() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Despesas</h1>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Listagem</TabsTrigger>
          <TabsTrigger value="filters">Filtros</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <ExpensesTable />
        </TabsContent>
        <TabsContent value="filters" className="space-y-4">
          <ExpenseFilters />
          <ExpensesTable />
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          <ExpensesSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}

