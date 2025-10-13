import { PORTFOLIO_DATA } from '../data';
import { useAssetData } from '../hooks/useAssetData';
import AssetTable from './AssetTable';
import type { TableConfig } from '../types';

interface AssetSectionProps {
  dataKey: 'stocks' | 'fiis' | 'fixedIncomes';
  config: TableConfig;
}

// Generic asset section component - applying DRY principle
const AssetSection = ({ dataKey, config }: AssetSectionProps) => {
  const {
    assets,
    config: tableConfig,
    totalValue,
    totalTarget,
    recommendation,
    isValidAllocation,
  } = useAssetData(PORTFOLIO_DATA[dataKey], config);

  return (
    <AssetTable
      assets={assets}
      config={tableConfig}
      totalValue={totalValue}
      totalTarget={totalTarget}
      recommendation={recommendation}
      isValidAllocation={isValidAllocation}
    />
  );
};

export default AssetSection;
