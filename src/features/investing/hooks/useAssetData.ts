import { useMemo } from 'react';
import { calculateParticipation, calculateDifference, getRecommendation } from '../utils';
import type { AssetWithQuantity, AssetWithValue, TableConfig } from '../types';

// Generic hook for asset data - applying DRY principle
export const useAssetData = <T extends AssetWithQuantity | AssetWithValue>(
  assets: Omit<T, 'participation' | 'difference' | 'total'>[],
  config: TableConfig,
) => {
  const processedAssets = useMemo((): T[] => {
    const totalValue = assets.reduce((sum, asset) => {
      if ('quantity' in asset && 'price' in asset) {
        return sum + asset.quantity * asset.price;
      }
      if ('currentValue' in asset) {
        return sum + asset.currentValue;
      }
      return sum;
    }, 0);

    return assets.map((asset) => {
      let value: number;
      if ('quantity' in asset && 'price' in asset) {
        value = asset.quantity * asset.price;
      } else if ('currentValue' in asset) {
        value = asset.currentValue;
      } else {
        value = 0;
      }

      const participation = calculateParticipation(value, totalValue);
      const difference = calculateDifference(participation, asset.target);

      return {
        ...asset,
        ...('quantity' in asset && 'price' in asset ? { total: value } : {}),
        participation,
        difference,
      } as T;
    });
  }, [assets]);

  const totalValue = processedAssets.reduce((sum, asset) => {
    if ('total' in asset) {
      return sum + asset.total;
    }
    if ('currentValue' in asset) {
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
