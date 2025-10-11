import FixedIncomes from './FixedIncomes';
import Stocks from './Stocks';
import FIIs from './FIIs';

const Wallet = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Carteira</h2>

      <Stocks />
      <FIIs />
      <FixedIncomes />
    </div>
  );
};

export default Wallet;
