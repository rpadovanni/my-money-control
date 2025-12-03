import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Dashboard from './features-new/dashboard';
import Transactions from './features-new/transactions';
import CreditCard from './features-new/credit-card';
import FixedCosts from './features-new/fixed-costs';
import Budget from './features-new/budget';
import Metrics from './features-new/metrics';
import Checklist from './features-new/checklist';
import Settings from './features-new/settings';
import Investments from './features/investments';
import { ThemeProvider } from './features-new/settings/components/ThemeProvider';
import './App.css';

function App() {
  const [currentFeature, setCurrentFeature] = useState('dashboard');

  const renderFeature = () => {
    switch (currentFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'credit-card':
        return <CreditCard />;
      case 'fixed-costs':
        return <FixedCosts />;
      case 'budget':
        return <Budget />;
      case 'metrics':
        return <Metrics />;
      case 'checklist':
        return <Checklist />;
      case 'settings':
        return <Settings />;
      case 'investments':
        return <Investments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar currentFeature={currentFeature} onFeatureChange={setCurrentFeature} />
        <main>{renderFeature()}</main>
      </div>
    </ThemeProvider>
  );
}

export default App;
