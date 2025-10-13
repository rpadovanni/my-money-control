import AssetSection from './components/AssetSection';
import { ASSET_CONFIGS } from './data';

// Simplified FIIs component - applying DRY and YAGNI principles
const FIIs = () => {
  return <AssetSection dataKey="fiis" config={ASSET_CONFIGS.fiis} />;
};

export default FIIs;
