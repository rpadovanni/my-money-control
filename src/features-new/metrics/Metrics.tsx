import { BurnRateCard } from './components/BurnRateCard';
import { SavingRateCard } from './components/SavingRateCard';
import { CategoryDistributionChart } from './components/CategoryDistributionChart';
import { MetricCard } from './components/MetricCard';
import { useMetrics } from './hooks';
import { formatCurrency } from './utils';
import { Wallet, TrendingUp } from 'lucide-react';

export default function Metrics() {
  const { totalMonthlyExpenses, totalMonthlyIncomes } = useMetrics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Métricas Financeiras</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Total de Receitas"
          description="Mês atual"
          value={formatCurrency(totalMonthlyIncomes)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Total de Despesas"
          description="Mês atual"
          value={formatCurrency(totalMonthlyExpenses)}
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BurnRateCard />
        <SavingRateCard />
      </div>

      <CategoryDistributionChart />
    </div>
  );
}
