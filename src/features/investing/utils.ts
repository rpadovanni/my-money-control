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
  return Math.round((value / totalValue) * 100 * 100) / 100;
};

export const calculateDifference = (participation: number, objective: number): number => {
  return (participation - objective) / 100;
};

export const validateAllocation = (assets: { target: number }[]): boolean => {
  const totalTarget = assets.reduce((sum, asset) => sum + asset.target, 0);
  return totalTarget <= 100;
};

export const getTotalTarget = (assets: { target: number }[]): number => {
  return assets.reduce((sum, asset) => sum + asset.target, 0);
};

export const getRecommendation = <T extends { difference: number; asset: string }>(assets: T[]): T => {
  return assets.reduce((min, asset) => (asset.difference < min.difference ? asset : min));
};
