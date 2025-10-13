import AssetSection from './components/AssetSection';
import { ASSET_CONFIGS } from './data';

// Simplified Stocks component - applying DRY and YAGNI principles
const Stocks = () => {
  return <AssetSection dataKey="stocks" config={ASSET_CONFIGS.stocks} />;
};

export default Stocks;
