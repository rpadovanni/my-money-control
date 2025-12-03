import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Dashboard from './features/dashboard';
import CreditCard from './features/credit-card';
import Expenses from './features/expenses';
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentFeature={currentFeature} onFeatureChange={setCurrentFeature} />
      <main>{renderFeature()}</main>
    </div>
  );
}

export default App;
