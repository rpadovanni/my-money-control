import { PORTFOLIO_DATA } from './data';
import { useAssetData } from './hooks/useAssetData';
import AssetTable from './components/AssetTable';

// Simplified Stocks component - applying DRY and YAGNI principles
const Stocks = () => {
  const { assets, config, totalValue, totalTarget, recommendation, isValidAllocation } = useAssetData(
    PORTFOLIO_DATA.stocks,
    {
      title: 'AÇÕES',
      headerColor: 'bg-gray-100',
      rowColor: 'bg-white',
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

export default Stocks;
