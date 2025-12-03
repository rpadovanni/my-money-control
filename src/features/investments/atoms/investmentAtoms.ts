import { atom } from 'jotai';
import type { Asset, Transaction, PriceHistory, AssetPosition } from '../types';

// Base atoms
export const assetsAtom = atom<Asset[]>([]);
export const transactionsAtom = atom<Transaction[]>([]);
export const priceHistoryAtom = atom<PriceHistory[]>([]);

// Derived atoms - Asset positions
export const assetPositionsAtom = atom((get) => {
  const assets = get(assetsAtom);
  const transactions = get(transactionsAtom);
  const priceHistory = get(priceHistoryAtom);

  const positions: AssetPosition[] = assets.map((asset) => {
    const assetTransactions = transactions.filter((t) => t.assetId === asset.id);
    
    // Calculate total quantity and average price
    let totalQuantity = 0;
    let totalInvested = 0;

    assetTransactions.forEach((transaction) => {
      if (transaction.type === 'buy') {
        totalQuantity += transaction.quantity;
        totalInvested += transaction.quantity * transaction.price + (transaction.fees || 0);
      } else {
        totalQuantity -= transaction.quantity;
        totalInvested -= transaction.quantity * transaction.price - (transaction.fees || 0);
      }
    });

    const averagePrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;

    // Get latest price from price history
    const assetPrices = priceHistory
      .filter((ph) => ph.assetId === asset.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const currentPrice = assetPrices.length > 0 ? assetPrices[0].price : averagePrice;
    const currentValue = totalQuantity * currentPrice;
    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      asset,
      totalQuantity,
      averagePrice,
      totalInvested,
      currentPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
    };
  });

  return positions.filter((p) => p.totalQuantity > 0);
});

// Derived atoms - Portfolio totals
export const totalInvestedAtom = atom((get) => {
  const positions = get(assetPositionsAtom);
  return positions.reduce((acc, pos) => acc + pos.totalInvested, 0);
});

export const totalCurrentValueAtom = atom((get) => {
  const positions = get(assetPositionsAtom);
  return positions.reduce((acc, pos) => acc + pos.currentValue, 0);
});

export const totalProfitLossAtom = atom((get) => {
  const positions = get(assetPositionsAtom);
  return positions.reduce((acc, pos) => acc + pos.profitLoss, 0);
});

export const totalProfitLossPercentAtom = atom((get) => {
  const totalInvested = get(totalInvestedAtom);
  const totalProfitLoss = get(totalProfitLossAtom);
  return totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
});

// Derived atoms - Price history by asset
export const priceHistoryByAssetAtom = atom((get) => {
  const priceHistory = get(priceHistoryAtom);
  const assets = get(assetsAtom);

  return assets.reduce(
    (acc, asset) => {
      const assetPrices = priceHistory
        .filter((ph) => ph.assetId === asset.id)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      acc[asset.id] = assetPrices;
      return acc;
    },
    {} as Record<string, PriceHistory[]>
  );
});

