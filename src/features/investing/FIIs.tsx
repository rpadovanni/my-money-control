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

const FIIs = () => {
  const [fiisInput] = useState<Omit<AssetWithQuantity, 'participation' | 'difference' | 'total'>[]>([
    { asset: 'ALZR11', quantity: 160, target: 10, price: 10.54 },
    { asset: 'BTCI11', quantity: 150, target: 10, price: 9.93 },
    { asset: 'CPTS11', quantity: 196, target: 10, price: 7.6 },
    { asset: 'HGLG11', quantity: 6, target: 7, price: 160.0 },
    { asset: 'HGRU11', quantity: 8, target: 7, price: 126.3 },
    { asset: 'HSML11', quantity: 10, target: 6, price: 84.25 },
    { asset: 'KNCR11', quantity: 14, target: 10, price: 104.7 },
    { asset: 'KNRI11', quantity: 8, target: 8, price: 145.76 },
    { asset: 'MXRF11', quantity: 150, target: 10, price: 9.55 },
    { asset: 'OUJP11', quantity: 20, target: 10, price: 75.6 },
    { asset: 'XPLG11', quantity: 9, target: 6, price: 100.87 },
    { asset: 'XPML11', quantity: 9, target: 6, price: 105.65 },
  ]);

  const fiis = useMemo((): AssetWithQuantity[] => {
    const totalValue = fiisInput.reduce((sum, fii) => sum + fii.quantity * fii.price, 0);

    return fiisInput.map((fii) => {
      const total = fii.quantity * fii.price;
      const participation = calculateParticipation(total, totalValue);
      const difference = calculateDifference(participation, fii.target);

      return {
        ...fii,
        total,
        participation,
        difference,
      };
    });
  }, [fiisInput]);

  const totalValue = fiis.reduce((sum, fii) => sum + fii.total, 0);
  const totalTarget = getTotalTarget(fiis);
  const isValidAllocation = validateAllocation(fiis);
  const recommendation = getRecommendation(fiis);

  const config = {
    title: 'FIIs',
    headerColor: 'bg-green-600',
    rowColor: 'bg-green-50',
    recommendationColor: 'bg-green-600',
    columns: {
      asset: 'ATIVO',
      quantity: 'QTD.',
      target: 'OBJ.',
      price: 'COTAÇÃO',
      total: 'TOTAL',
      participation: '% PARTICIP.',
      difference: '% DIFERENÇA',
    },
  };

  return (
    <AssetTable
      assets={fiis}
      config={config}
      totalValue={totalValue}
      totalTarget={totalTarget}
      recommendation={recommendation}
      isValidAllocation={isValidAllocation}
    />
  );
};

export default FIIs;
