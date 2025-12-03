import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFixedCosts } from '../hooks';
import { formatCurrency, calculateSummary } from '../utils';
import { FIXED_COST_TYPES } from '../types';
import { DollarSign, Home, Heart, CreditCard } from 'lucide-react';

export function FixedCostsSummary() {
  const { fixedCosts, totalFixedCosts, fixedCostsByType, fixedCostsByTypeTotal } = useFixedCosts();
  const summary = calculateSummary(fixedCosts);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalFixedCosts)}</div>
          <CardDescription className="mt-1">
            {summary.activeCount} custo{summary.activeCount !== 1 ? 's' : ''} ativo{summary.activeCount !== 1 ? 's' : ''}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moradia</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(fixedCostsByTypeTotal.housing)}</div>
          <CardDescription className="mt-1">
            {fixedCostsByType.housing.length > 0
              ? `${fixedCostsByType.housing.length} custo${fixedCostsByType.housing.length !== 1 ? 's' : ''}`
              : 'Nenhum custo'}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saúde</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(fixedCostsByTypeTotal.health)}</div>
          <CardDescription className="mt-1">
            {fixedCostsByType.health.length > 0
              ? `${fixedCostsByType.health.length} custo${fixedCostsByType.health.length !== 1 ? 's' : ''}`
              : 'Nenhum custo'}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assinaturas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(fixedCostsByTypeTotal.subscriptions)}</div>
          <CardDescription className="mt-1">
            {fixedCostsByType.subscriptions.length > 0
              ? `${fixedCostsByType.subscriptions.length} custo${fixedCostsByType.subscriptions.length !== 1 ? 's' : ''}`
              : 'Nenhum custo'}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

