import { usePortfolioData } from './hooks/usePortfolioData';
import AssetTable from './components/AssetTable';

const IdealPortfolio = () => {
  const { assets, config, totalValue, totalTarget, recommendation, isValidAllocation } = usePortfolioData();

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

export default IdealPortfolio;
