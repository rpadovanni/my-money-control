import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  assetsAtom,
  transactionsAtom,
  priceHistoryAtom,
  assetPositionsAtom,
  totalInvestedAtom,
  totalCurrentValueAtom,
  totalProfitLossAtom,
  totalProfitLossPercentAtom,
  priceHistoryByAssetAtom,
} from '../atoms';
import type { Asset, Transaction, AssetFormData, TransactionFormData, PriceHistory } from '../types';
import { investmentService } from '../services/investmentService';

export function useInvestments() {
  const [assets, setAssets] = useAtom(assetsAtom);
  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const [priceHistory, setPriceHistory] = useAtom(priceHistoryAtom);
  
  const positions = useAtomValue(assetPositionsAtom);
  const totalInvested = useAtomValue(totalInvestedAtom);
  const totalCurrentValue = useAtomValue(totalCurrentValueAtom);
  const totalProfitLoss = useAtomValue(totalProfitLossAtom);
  const totalProfitLossPercent = useAtomValue(totalProfitLossPercentAtom);
  const priceHistoryByAsset = useAtomValue(priceHistoryByAssetAtom);

  const addAsset = async (data: AssetFormData) => {
    const newAsset = await investmentService.createAsset(data);
    setAssets((prev) => [...prev, newAsset]);
    
    // Initialize price history for new asset
    const history = await investmentService.fetchPriceHistory(newAsset.id, 30);
    setPriceHistory((prev) => [...prev, ...history]);
    
    return newAsset;
  };

  const updateAsset = async (id: string, data: Partial<Asset>) => {
    const updated = await investmentService.updateAsset(id, data);
    setAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, ...updated } : asset)));
    return updated;
  };

  const deleteAsset = async (id: string) => {
    await investmentService.deleteAsset(id);
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    setTransactions((prev) => prev.filter((t) => t.assetId !== id));
    setPriceHistory((prev) => prev.filter((ph) => ph.assetId !== id));
  };

  const addTransaction = async (data: TransactionFormData) => {
    const newTransaction = await investmentService.createTransaction(data);
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  const deleteTransaction = async (id: string) => {
    await investmentService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updatePriceHistory = async (assetId: string) => {
    const history = await investmentService.updatePriceHistory(assetId);
    setPriceHistory((prev) => {
      const filtered = prev.filter((ph) => ph.assetId !== assetId);
      return [...filtered, ...history];
    });
  };

  const refreshAllPrices = async () => {
    const updates: PriceHistory[] = [];
    for (const asset of assets) {
      const history = await investmentService.updatePriceHistory(asset.id);
      updates.push(...history);
    }
    setPriceHistory(updates);
  };

  const getPriceHistory = (assetId: string): PriceHistory[] => {
    return priceHistoryByAsset[assetId] || [];
  };

  return {
    // Data
    assets,
    transactions,
    positions,
    priceHistoryByAsset,
    
    // Totals
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,
    
    // Actions
    addAsset,
    updateAsset,
    deleteAsset,
    addTransaction,
    deleteTransaction,
    updatePriceHistory,
    refreshAllPrices,
    getPriceHistory,
  };
}

