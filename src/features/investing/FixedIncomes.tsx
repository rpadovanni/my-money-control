import AssetSection from './components/AssetSection';
import { ASSET_CONFIGS } from './data';

// Simplified FixedIncomes component - applying DRY and YAGNI principles
const FixedIncomes = () => {
  return <AssetSection dataKey="fixedIncomes" config={ASSET_CONFIGS.fixedIncomes} />;
};

export default FixedIncomes;
