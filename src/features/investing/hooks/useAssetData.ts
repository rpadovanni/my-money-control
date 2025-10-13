import { useMemo } from 'react';
import { calculateParticipation, calculateDifference, getRecommendation } from '../utils';
import type { Asset, TableConfig } from '../types';

// Unified hook for all asset types - applying DRY principle
export const useAssetData = (
  assets: readonly Omit<Asset, 'participation' | 'difference' | 'total'>[],
  config: TableConfig,
) => {
  const processedAssets = useMemo((): Asset[] => {
    const totalValue = assets.reduce((sum, asset) => {
      if (asset.quantity && asset.price) {
        return sum + asset.quantity * asset.price;
      }
      if (asset.currentValue) {
        return sum + asset.currentValue;
      }
      return sum;
    }, 0);

    return assets.map((asset) => {
      let value: number;
      if (asset.quantity && asset.price) {
        value = asset.quantity * asset.price;
      } else if (asset.currentValue) {
        value = asset.currentValue;
      } else {
        value = 0;
      }

      const participation = calculateParticipation(value, totalValue);
      const difference = calculateDifference(participation, asset.target);

      return {
        ...asset,
        ...(asset.quantity && asset.price ? { total: value } : {}),
        participation,
        difference,
      };
    });
  }, [assets]);

  const totalValue = processedAssets.reduce((sum, asset) => {
    if (asset.total) {
      return sum + asset.total;
    }
    if (asset.currentValue) {
      return sum + asset.currentValue;
    }
    return sum;
  }, 0);

  const totalTarget = processedAssets.reduce((sum, asset) => sum + asset.target, 0);
  const isValidAllocation = totalTarget <= 100;
  const recommendation = getRecommendation(processedAssets);

  return {
    assets: processedAssets,
    config,
    totalValue,
    totalTarget,
    recommendation,
    isValidAllocation,
  };
};
