import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardsTable } from './components/CardsTable';
import { PurchasesTable } from './components/PurchasesTable';
import { InvoicesSection } from './components/InvoicesSection';
import { BudgetCard } from './components/BudgetCard';

export default function CreditCard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cartão de Crédito</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="cards" className="space-y-4">
            <TabsList>
              <TabsTrigger value="cards">Cartões</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
            </TabsList>
            <TabsContent value="cards" className="space-y-4">
              <CardsTable />
            </TabsContent>
            <TabsContent value="purchases" className="space-y-4">
              <PurchasesTable />
            </TabsContent>
            <TabsContent value="invoices" className="space-y-4">
              <InvoicesSection />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <BudgetCard />
        </div>
      </div>
    </div>
  );
}

