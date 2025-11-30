import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoices } from '../hooks';
import { InvoiceCard } from './InvoiceCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function InvoicesSection() {
  const { currentInvoices, futureInvoices, generateInvoicesForPeriods } = useInvoices();

  useEffect(() => {
    generateInvoicesForPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Faturas</h2>
        <Button variant="outline" size="sm" onClick={generateInvoicesForPeriods}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {currentInvoices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Fatura Atual</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {currentInvoices.map((invoice) => (
              <InvoiceCard key={`${invoice.cardId}-${invoice.month}-${invoice.year}`} invoice={invoice} />
            ))}
          </div>
        </div>
      )}

      {futureInvoices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Próximas Faturas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {futureInvoices.map((invoice) => (
              <InvoiceCard
                key={`${invoice.cardId}-${invoice.month}-${invoice.year}`}
                invoice={invoice}
                isFuture
              />
            ))}
          </div>
        </div>
      )}

      {currentInvoices.length === 0 && futureInvoices.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Nenhuma fatura disponível. Adicione compras para gerar faturas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

