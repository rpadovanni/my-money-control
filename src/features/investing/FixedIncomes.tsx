import { useState, useMemo } from 'react';
import type { AssetWithValue } from './types';
import {
  calculateParticipation,
  calculateDifference,
  validateAllocation,
  getTotalTarget,
  getRecommendation,
} from './utils';
import AssetTable from './components/AssetTable';

const FixedIncomes = () => {
  const [fixedIncomesInput] = useState<Omit<AssetWithValue, 'participation' | 'difference'>[]>([
    { asset: 'CDB Mercado Pago', currentValue: 40000.0, target: 80 },
    { asset: 'MP - Tesouro Direto', currentValue: 1246.52, target: 5 },
    { asset: 'MP - Fundos', currentValue: 0.0, target: 0 },
    { asset: 'LP - Fundos', currentValue: 2652.63, target: 5 },
    { asset: 'AP - Previdência', currentValue: 0.0, target: 5 },
    { asset: 'AP - IPCA+ 2045', currentValue: 514.22, target: 5 },
  ]);

  const fixedIncomes = useMemo((): AssetWithValue[] => {
    const totalValue = fixedIncomesInput.reduce((sum, asset) => sum + asset.currentValue, 0);

    return fixedIncomesInput.map((asset) => {
      const participation = calculateParticipation(asset.currentValue, totalValue);
      const difference = calculateDifference(participation, asset.target);

      return {
        ...asset,
        participation,
        difference,
      };
    });
  }, [fixedIncomesInput]);

  const totalValue = fixedIncomes.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalTarget = getTotalTarget(fixedIncomes);
  const isValidAllocation = validateAllocation(fixedIncomes);
  const recommendation = getRecommendation(fixedIncomes);

  const config = {
    title: 'RENDA FIXA',
    headerColor: 'bg-blue-600',
    rowColor: 'bg-blue-50',
    recommendationColor: 'bg-blue-600',
    columns: {
      asset: 'ATIVO',
      currentValue: 'VALOR ATUAL',
      target: 'OBJETIVO (%)',
      participation: '% PARTICIP.',
      difference: '% DIFERENÇA',
    },
  };

  return (
    <AssetTable
      assets={fixedIncomes}
      config={config}
      totalValue={totalValue}
      totalTarget={totalTarget}
      recommendation={recommendation}
      isValidAllocation={isValidAllocation}
    />
  );
};

export default FixedIncomes;
