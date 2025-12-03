import { DashboardSummary } from './components/DashboardSummary';
import { DashboardCharts } from './components/DashboardCharts';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardSummary />
      <DashboardCharts />
    </div>
  );
}
