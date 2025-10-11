import { PORTFOLIO_DATA } from './data';
import { useAssetData } from './hooks/useAssetData';
import AssetTable from './components/AssetTable';

// Simplified FIIs component - applying DRY and YAGNI principles
const FIIs = () => {
  const { assets, config, totalValue, totalTarget, recommendation, isValidAllocation } = useAssetData(
    PORTFOLIO_DATA.fiis,
    {
      title: 'FIIs',
      headerColor: 'bg-green-600',
      rowColor: 'bg-green-50',
      recommendationColor: 'bg-green-600',
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

export default FIIs;
