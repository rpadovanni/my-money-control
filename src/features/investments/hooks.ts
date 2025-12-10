import { useStore } from '@/shared/store';
import { useMemo } from 'react';

export function useInvestments() {
  const assets = useStore((state) => state.assets);
  const transactions = useStore((state) => state.investmentTransactions);
  const priceHistory = useStore((state) => state.priceHistory);
  const filters = useStore((state) => state.filters);
  const fetchInvestments = useStore((state) => state.fetchInvestments);
  const addInvestment = useStore((state) => state.addInvestment);
  const updateInvestment = useStore((state) => state.updateInvestment);
  const deleteInvestment = useStore((state) => state.deleteInvestment);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const updatePriceHistory = useStore((state) => state.updatePriceHistory);
  const refreshAllPrices = useStore((state) => state.refreshAllPrices);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = useStore((state) => state.clearFilters);

  // Computed values - recalculate when data changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredAssets = useMemo(() => useStore.getState().getFilteredAssets(), [assets, filters]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const positions = useMemo(() => useStore.getState().getAssetPositions(), [assets, transactions, priceHistory]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalInvested = useMemo(() => useStore.getState().getTotalInvested(), [assets, transactions, priceHistory]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalCurrentValue = useMemo(() => useStore.getState().getTotalCurrentValue(), [assets, transactions, priceHistory]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalProfitLoss = useMemo(() => useStore.getState().getTotalProfitLoss(), [assets, transactions, priceHistory]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalProfitLossPercent = useMemo(() => useStore.getState().getTotalProfitLossPercent(), [assets, transactions, priceHistory]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const distribution = useMemo(() => useStore.getState().calcularDistribuicao(), [assets, transactions, priceHistory]);

  // Helper to get price history by asset
  const priceHistoryByAsset = useMemo(() => {
    const historyMap: Record<string, typeof priceHistory> = {};
    assets.forEach((asset) => {
      historyMap[asset.id] = priceHistory
        .filter((ph) => ph.assetId === asset.id)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    });
    return historyMap;
  }, [assets, priceHistory]);

  return {
    // Data
    assets: filteredAssets,
    allAssets: assets,
    transactions,
    positions,
    priceHistoryByAsset,
    distribution,

    // Totals
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,

    // Filters
    filters,
    setFilters,
    clearFilters,

    // Actions
    fetchInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updatePriceHistory,
    refreshAllPrices,

    // Calculations
    calcularPrecoMedio: (assetId: string) => useStore.getState().calcularPrecoMedio(assetId),
    calcularDistribuicao: () => useStore.getState().calcularDistribuicao(),
    recomendacaoDeCompra: (assetId: string) => useStore.getState().recomendacaoDeCompra(assetId),
  };
}

