import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CardForm } from './components/CardForm';
import { PurchaseForm } from './components/PurchaseForm';
import { InvoiceView } from './components/InvoiceView';
import { CardBudgetSummary } from './components/CardBudgetSummary';
import { useCreditCardIntegration } from './integration';
import { useState } from 'react';

export default function CreditCard() {
  // Auto-integrate transactions with purchases
  useCreditCardIntegration();

  const [purchaseFormOpen, setPurchaseFormOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cartão de Crédito</h1>
      </div>

      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <CardForm />
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setPurchaseFormOpen(true)}>
              Nova Compra
            </Button>
          </div>
          <PurchaseForm open={purchaseFormOpen} onOpenChange={setPurchaseFormOpen} />
          {/* TODO: Add purchases table */}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceView />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <CardBudgetSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
