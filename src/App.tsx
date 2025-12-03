import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Dashboard from './features/dashboard';
import CreditCard from './features/credit-card';
import Expenses from './features/expenses';
import Checklist from './features/checklist';
import Income from './features/income';
import FixedCosts from './features/fixed-costs';
import Health from './features/health';
import Budgets from './features/budgets';
import SavingsGoals from './features/savings-goals';
import Settings from './features/settings';
import { ThemeProvider } from './features/settings/components/ThemeProvider';
import './App.css';

function App() {
  const [currentFeature, setCurrentFeature] = useState('dashboard');

  const renderFeature = () => {
    switch (currentFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'credit-card':
        return <CreditCard />;
      case 'expenses':
        return <Expenses />;
      case 'checklist':
        return <Checklist />;
      case 'income':
        return <Income />;
      case 'fixed-costs':
        return <FixedCosts />;
      case 'health':
        return <Health />;
      case 'budgets':
        return <Budgets />;
      case 'savings-goals':
        return <SavingsGoals />;
      case 'settings':
        return <Settings />;
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
