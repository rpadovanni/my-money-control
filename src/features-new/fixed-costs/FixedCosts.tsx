import { FixedCostsTable } from './components/FixedCostsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFixedCosts } from './hooks';
import { formatCurrency } from './utils';

export default function FixedCosts() {
  const { totalFixedCosts, monthlyFixedCosts, activeFixedCostsList } = useFixedCosts();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Custos Fixos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Custos Fixos</CardTitle>
            <CardDescription>Valor total de todos os custos fixos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalFixedCosts)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {activeFixedCostsList.length} custo{activeFixedCostsList.length !== 1 ? 's' : ''} fixo{activeFixedCostsList.length !== 1 ? 's' : ''} ativo{activeFixedCostsList.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equivalente Mensal</CardTitle>
            <CardDescription>
              Soma mensal equivalente (custos anuais divididos por 12)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(monthlyFixedCosts)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Valor mensalizado para planejamento
            </p>
          </CardContent>
        </Card>
      </div>

      <FixedCostsTable />
    </div>
  );
}
