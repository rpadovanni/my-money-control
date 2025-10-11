export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const calculateParticipation = (value: number, totalValue: number): number => {
  return totalValue > 0 ? Math.round((value / totalValue) * 100 * 100) / 100 : 0;
};

export const calculateDifference = (participation: number, target: number): number => {
  return participation - target;
};

export const getRecommendation = <T extends { difference: number; asset: string }>(assets: T[]): T => {
  return assets.reduce((min, asset) => (asset.difference < min.difference ? asset : min));
};
