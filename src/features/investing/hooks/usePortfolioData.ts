import { useMemo } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { calculateParticipation, calculateDifference, getRecommendation } from '../utils';
import type { AssetWithValue, TableConfig } from '../types';

// Simplified hook - applying DRY and YAGNI principles
export const usePortfolioData = () => {
  const portfolioData = useMemo(() => {
    const stocksTotal = PORTFOLIO_DATA.stocks.reduce((sum, stock) => sum + stock.quantity * stock.price, 0);
    const fiisTotal = PORTFOLIO_DATA.fiis.reduce((sum, fii) => sum + fii.quantity * fii.price, 0);
    const fixedIncomesTotal = PORTFOLIO_DATA.fixedIncomes.reduce((sum, asset) => sum + asset.currentValue, 0);
    const cashTotal = PORTFOLIO_DATA.cash.value;
    const totalPortfolio = stocksTotal + fiisTotal + fixedIncomesTotal + cashTotal;

    const stocksParticipation = calculateParticipation(stocksTotal, totalPortfolio);
    const fiisParticipation = calculateParticipation(fiisTotal, totalPortfolio);
    const variableIncomeParticipation = stocksParticipation + fiisParticipation;
    const fixedIncomeParticipation = calculateParticipation(fixedIncomesTotal, totalPortfolio);
    const cashParticipation = calculateParticipation(cashTotal, totalPortfolio);

    return {
      categories: [
        {
          type: 'RENDA FIXA',
          participation: fixedIncomeParticipation,
          value: fixedIncomesTotal,
          difference: calculateDifference(fixedIncomeParticipation, 55),
        },
        {
          type: 'RENDA VARIÁVEL',
          participation: variableIncomeParticipation,
          value: stocksTotal + fiisTotal,
          difference: calculateDifference(variableIncomeParticipation, 40),
        },
        {
          type: 'CAIXA',
          participation: cashParticipation,
          value: cashTotal,
          difference: calculateDifference(cashParticipation, 5),
        },
      ],
      totalValue: totalPortfolio,
    };
  }, []);

  const assets: AssetWithValue[] = portfolioData.categories.map((category) => ({
    asset: category.type,
    currentValue: category.value,
    target: category.type === 'RENDA FIXA' ? 55 : category.type === 'RENDA VARIÁVEL' ? 40 : 5,
    participation: category.participation,
    difference: category.difference,
  }));

  const config: TableConfig = {
    title: 'CARTEIRA IDEAL vs STATUS ATUAL',
    headerColor: 'bg-blue-800',
    rowColor: 'bg-gray-50',
    recommendationColor: 'bg-green-600',
  };

  return {
    assets,
    config,
    totalValue: portfolioData.totalValue,
    totalTarget: 100,
    recommendation: getRecommendation(assets),
    isValidAllocation: true,
  };
};
