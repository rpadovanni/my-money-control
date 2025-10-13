import FIIs from './FIIs';
import FixedIncomes from './FixedIncomes';
import IdealPortfolio from './IdealPortfolio';
import Stocks from './Stocks';

const Wallet = () => {
  return (
    <div className="rounded-lg p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-200">Carteira</h2>

      <IdealPortfolio />

      <Stocks />
      <FIIs />
      <FixedIncomes />
    </div>
  );
};

export default Wallet;
