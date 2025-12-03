import { DashboardSummaryCards } from './components/DashboardSummaryCards';
import { MonthlySpendingChart } from './components/MonthlySpendingChart';
import { CategorySummaryChart } from './components/CategorySummaryChart';
import { MonthForecastCard } from './components/MonthForecastCard';
import { WeeklySpendingCard } from './components/WeeklySpendingCard';
import { useDashboard } from './hooks';

export default function Dashboard() {
  // Initialize dashboard data
  useDashboard();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardSummaryCards />

      <div className="grid gap-6 md:grid-cols-2">
        <MonthlySpendingChart />
        <CategorySummaryChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MonthForecastCard />
        <WeeklySpendingCard />
      </div>
    </div>
  );
}

