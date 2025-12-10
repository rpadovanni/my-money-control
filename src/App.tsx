import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PlanningPage } from './pages/planning/PlanningPage';
import { TransactionsPage } from './pages/transactions';
import { InvestmentsPage } from './pages/investments';
import { ThemeProvider } from './features-new/settings/components/ThemeProvider';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'planning' | 'transactions' | 'investments'>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'planning':
        return <PlanningPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'investments':
        return <InvestmentsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
