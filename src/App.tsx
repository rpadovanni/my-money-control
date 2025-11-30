import { useState } from 'react';
import { Navbar } from './components/Navbar';
import CreditCard from './features/credit-card';
import './App.css';

function App() {
  const [currentFeature, setCurrentFeature] = useState('credit-card');

  const renderFeature = () => {
    switch (currentFeature) {
      case 'credit-card':
        return <CreditCard />;
      default:
        return <CreditCard />;
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
