import { useState, useMemo } from 'react';
import type { AssetWithQuantity } from './types';
import {
  calculateParticipation,
  calculateDifference,
  validateAllocation,
  getTotalTarget,
  getRecommendation,
} from './utils';
import AssetTable from './components/AssetTable';

const Stocks = () => {
  const [stocksInput] = useState<Omit<AssetWithQuantity, 'participation' | 'difference' | 'total'>[]>([
    { asset: 'BBAS3', quantity: 70, target: 8, price: 20.61 },
    { asset: 'BPAC11', quantity: 50, target: 6, price: 47.14 },
    { asset: 'CXSE3', quantity: 138, target: 10, price: 14.92 },
    { asset: 'EALT4', quantity: 40, target: 3, price: 11.22 },
    { asset: 'ITSA4', quantity: 368, target: 15, price: 10.95 },
    { asset: 'KLBN11', quantity: 102, target: 10, price: 17.37 },
    { asset: 'NEOE3', quantity: 105, target: 10, price: 27.4 },
    { asset: 'PSSA3', quantity: 35, target: 10, price: 46.34 },
    { asset: 'RDOR3', quantity: 40, target: 8, price: 39.79 },
    { asset: 'SAPR4', quantity: 430, target: 15, price: 6.83 },
    { asset: 'WEGE3', quantity: 23, target: 5, price: 36.69 },
  ]);

  const stocks = useMemo((): AssetWithQuantity[] => {
    const totalValue = stocksInput.reduce((sum, stock) => sum + stock.quantity * stock.price, 0);

    return stocksInput.map((stock) => {
      const total = stock.quantity * stock.price;
      const participation = calculateParticipation(total, totalValue);
      const difference = calculateDifference(participation, stock.target);

      return {
        ...stock,
        total,
        participation,
        difference,
      };
    });
  }, [stocksInput]);

  const totalValue = stocks.reduce((sum, stock) => sum + stock.total, 0);
  const totalTarget = getTotalTarget(stocks);
  const isValidAllocation = validateAllocation(stocks);
  const recommendation = getRecommendation(stocks);

  const config = {
    title: 'AÇÕES',
    headerColor: 'bg-gray-100',
    rowColor: 'bg-white',
    recommendationColor: 'bg-green-600',
    columns: {
      asset: 'ATIVO',
      quantity: 'QUANTIDADE',
      target: 'OBJETIVO (%)',
      price: 'COTAÇÃO (R$)',
      total: 'TOTAL',
      participation: 'PARTICIP. (%)',
      difference: 'DIFERENÇA',
    },
  };

  return (
    <AssetTable
      assets={stocks}
      config={config}
      totalValue={totalValue}
      totalTarget={totalTarget}
      recommendation={recommendation}
      isValidAllocation={isValidAllocation}
    />
  );
};

export default Stocks;
