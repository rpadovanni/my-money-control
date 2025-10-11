import { PORTFOLIO_DATA } from './data';
import { useAssetData } from './hooks/useAssetData';
import AssetTable from './components/AssetTable';

// Simplified FixedIncomes component - applying DRY and YAGNI principles
const FixedIncomes = () => {
  const { assets, config, totalValue, totalTarget, recommendation, isValidAllocation } = useAssetData(
    PORTFOLIO_DATA.fixedIncomes,
    {
      title: 'RENDA FIXA',
      headerColor: 'bg-blue-600',
      rowColor: 'bg-blue-50',
      recommendationColor: 'bg-blue-600',
    },
  );

  return (
    <AssetTable
      assets={assets}
      config={config}
      totalValue={totalValue}
      totalTarget={totalTarget}
      recommendation={recommendation}
      isValidAllocation={isValidAllocation}
    />
  );
};

export default FixedIncomes;
