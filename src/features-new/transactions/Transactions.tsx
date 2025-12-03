import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionTable } from './components/TransactionTable';
import { TransactionFilters } from './components/TransactionFilters';

export default function Transactions() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transações</h1>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
          <TabsTrigger value="filters">Filtros</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TransactionTable showTypeFilter={true} />
        </TabsContent>
        <TabsContent value="income" className="space-y-4">
          <TransactionTable defaultType="income" showTypeFilter={false} />
        </TabsContent>
        <TabsContent value="expense" className="space-y-4">
          <TransactionTable defaultType="expense" showTypeFilter={false} />
        </TabsContent>
        <TabsContent value="filters" className="space-y-4">
          <TransactionFilters />
          <TransactionTable showTypeFilter={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
