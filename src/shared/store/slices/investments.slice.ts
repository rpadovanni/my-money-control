import type { StateCreator } from 'zustand';
import type {
  Asset,
  Transaction,
  PriceHistory,
  AssetFormData,
  TransactionFormData,
  InvestmentFilters,
  AssetPosition,
  DistributionItem,
  BuyRecommendation,
} from '../types/investments';

export interface InvestmentsSlice {
  // State
  assets: Asset[];
  investmentTransactions: Transaction[];
  priceHistory: PriceHistory[];
  filters: InvestmentFilters;

  // Actions
  fetchInvestments: () => Promise<void>;
  addInvestment: (data: AssetFormData) => Asset;
  updateInvestment: (id: string, data: Partial<AssetFormData>) => void;
  deleteInvestment: (id: string) => void;
  addTransaction: (data: TransactionFormData) => Transaction;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => void;
  deleteTransaction: (id: string) => void;
  updatePriceHistory: (assetId: string) => Promise<void>;
  refreshAllPrices: () => Promise<void>;
  setFilters: (filters: Partial<InvestmentFilters>) => void;
  clearFilters: () => void;

  // Selectors (computed values)
  getFilteredAssets: () => Asset[];
  getAssetPositions: () => AssetPosition[];
  getTotalInvested: () => number;
  getTotalCurrentValue: () => number;
  getTotalProfitLoss: () => number;
  getTotalProfitLossPercent: () => number;
  calcularPrecoMedio: (assetId: string) => number;
  calcularDistribuicao: () => DistributionItem[];
  recomendacaoDeCompra: (assetId: string) => BuyRecommendation | null;
}

export const createInvestmentsSlice: StateCreator<InvestmentsSlice> = (set, get) => ({
  assets: [],
  investmentTransactions: [],
  priceHistory: [],
  filters: {},

  fetchInvestments: async () => {
    // TODO: implement API call
    // For now, load from localStorage if needed
    const storedAssets = localStorage.getItem('my-money-control-assets');
    const storedTransactions = localStorage.getItem('my-money-control-investment-transactions');
    const storedPriceHistory = localStorage.getItem('my-money-control-price-history');

    if (storedAssets) {
      try {
        const assets = JSON.parse(storedAssets);
        set({ assets: assets.map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) })) });
      } catch (error) {
        console.error('Failed to load assets from storage', error);
      }
    }

    if (storedTransactions) {
      try {
        const transactions = JSON.parse(storedTransactions);
        set({ investmentTransactions: transactions.map((t: any) => ({ ...t, date: new Date(t.date) })) });
      } catch (error) {
        console.error('Failed to load transactions from storage', error);
      }
    }

    if (storedPriceHistory) {
      try {
        const priceHistory = JSON.parse(storedPriceHistory);
        set({ priceHistory: priceHistory.map((ph: any) => ({ ...ph, date: new Date(ph.date) })) });
      } catch (error) {
        console.error('Failed to load price history from storage', error);
      }
    }
  },

  addInvestment: (data) => {
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    set((s) => ({ assets: [...s.assets, newAsset] }));

    // Persist to localStorage
    const updated = [...get().assets, newAsset];
    localStorage.setItem('my-money-control-assets', JSON.stringify(updated));

    // Initialize price history
    const mockPriceHistory: PriceHistory[] = [];
    const now = new Date();
    const basePrice = 50 + Math.random() * 100;
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const volatility = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + volatility * (30 - i) / 30);
      mockPriceHistory.push({
        assetId: newAsset.id,
        date,
        price: Math.round(price * 100) / 100,
      });
    }
    set((s) => ({ priceHistory: [...s.priceHistory, ...mockPriceHistory] }));

    return newAsset;
  },

  updateInvestment: (id, data) => {
    set((s) => ({
      assets: s.assets.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));

    // Persist to localStorage
    const updated = get().assets.map((a) => (a.id === id ? { ...a, ...data } : a));
    localStorage.setItem('my-money-control-assets', JSON.stringify(updated));
  },

  deleteInvestment: (id) => {
    set((s) => ({
      assets: s.assets.filter((a) => a.id !== id),
      investmentTransactions: s.investmentTransactions.filter((t) => t.assetId !== id),
      priceHistory: s.priceHistory.filter((ph) => ph.assetId !== id),
    }));

    // Persist to localStorage
    const updatedAssets = get().assets.filter((a) => a.id !== id);
    const updatedTransactions = get().investmentTransactions.filter((t) => t.assetId !== id);
    const updatedPriceHistory = get().priceHistory.filter((ph) => ph.assetId !== id);
    localStorage.setItem('my-money-control-assets', JSON.stringify(updatedAssets));
    localStorage.setItem('my-money-control-investment-transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('my-money-control-price-history', JSON.stringify(updatedPriceHistory));
  },

  addTransaction: (data) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    set((s) => ({ investmentTransactions: [...s.investmentTransactions, newTransaction] }));

    // Persist to localStorage
    const updated = [...get().investmentTransactions, newTransaction];
    localStorage.setItem('my-money-control-investment-transactions', JSON.stringify(updated));

    return newTransaction;
  },

  updateTransaction: (id, data) => {
    set((s) => ({
      investmentTransactions: s.investmentTransactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));

    // Persist to localStorage
    const updated = get().investmentTransactions.map((t) => (t.id === id ? { ...t, ...data } : t));
    localStorage.setItem('my-money-control-investment-transactions', JSON.stringify(updated));
  },

  deleteTransaction: (id) => {
    set((s) => ({
      investmentTransactions: s.investmentTransactions.filter((t) => t.id !== id),
    }));

    // Persist to localStorage
    const updated = get().investmentTransactions.filter((t) => t.id !== id);
    localStorage.setItem('my-money-control-investment-transactions', JSON.stringify(updated));
  },

  updatePriceHistory: async (assetId) => {
    // Mock price update
    const now = new Date();
    const basePrice = 50 + Math.random() * 100;
    const newPrice: PriceHistory = {
      assetId,
      date: now,
      price: Math.round(basePrice * 100) / 100,
    };

    set((s) => {
      const filtered = s.priceHistory.filter((ph) => ph.assetId !== assetId);
      return { priceHistory: [...filtered, newPrice] };
    });

    // Persist to localStorage
    const updated = get().priceHistory.filter((ph) => ph.assetId !== assetId);
    updated.push(newPrice);
    localStorage.setItem('my-money-control-price-history', JSON.stringify(updated));
  },

  refreshAllPrices: async () => {
    const { assets } = get();
    const updates: PriceHistory[] = [];
    const now = new Date();

    for (const asset of assets) {
      const basePrice = 50 + Math.random() * 100;
      updates.push({
        assetId: asset.id,
        date: now,
        price: Math.round(basePrice * 100) / 100,
      });
    }

    set((s) => {
      const filtered = s.priceHistory.filter((ph) => !assets.some((a) => a.id === ph.assetId));
      return { priceHistory: [...filtered, ...updates] };
    });

    // Persist to localStorage
    const updated = get().priceHistory.filter((ph) => !assets.some((a) => a.id === ph.assetId));
    updated.push(...updates);
    localStorage.setItem('my-money-control-price-history', JSON.stringify(updated));
  },

  setFilters: (newFilters) => {
    set((s) => ({
      filters: { ...s.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // Selectors
  getFilteredAssets: () => {
    const { assets, filters } = get();
    return assets.filter((asset) => {
      if (filters.type && asset.type !== filters.type) return false;
      // Sector filter would need to be added to Asset type if needed
      return true;
    });
  },

  getAssetPositions: () => {
    const { assets, investmentTransactions, priceHistory } = get();

    const positions: AssetPosition[] = assets.map((asset) => {
      const assetTransactions = investmentTransactions.filter((t) => t.assetId === asset.id);

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
  },

  getTotalInvested: () => {
    return get()
      .getAssetPositions()
      .reduce((acc, pos) => acc + pos.totalInvested, 0);
  },

  getTotalCurrentValue: () => {
    return get()
      .getAssetPositions()
      .reduce((acc, pos) => acc + pos.currentValue, 0);
  },

  getTotalProfitLoss: () => {
    return get()
      .getAssetPositions()
      .reduce((acc, pos) => acc + pos.profitLoss, 0);
  },

  getTotalProfitLossPercent: () => {
    const totalInvested = get().getTotalInvested();
    const totalProfitLoss = get().getTotalProfitLoss();
    return totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  },

  calcularPrecoMedio: (assetId) => {
    const position = get()
      .getAssetPositions()
      .find((p) => p.asset.id === assetId);
    return position?.averagePrice || 0;
  },

  calcularDistribuicao: () => {
    const positions = get().getAssetPositions();
    const totalValue = get().getTotalCurrentValue();

    const distributionMap = new Map<string, { type: AssetType; amount: number }>();

    positions.forEach((position) => {
      const current = distributionMap.get(position.asset.type) || {
        type: position.asset.type,
        amount: 0,
      };
      current.amount += position.currentValue;
      distributionMap.set(position.asset.type, current);
    });

    const distribution: DistributionItem[] = Array.from(distributionMap.values()).map((item) => ({
      type: item.type,
      amount: item.amount,
      percentage: totalValue > 0 ? (item.amount / totalValue) * 100 : 0,
    }));

    return distribution.sort((a, b) => b.amount - a.amount);
  },

  recomendacaoDeCompra: (assetId) => {
    const position = get()
      .getAssetPositions()
      .find((p) => p.asset.id === assetId);

    if (!position) {
      // If no position, recommend buy if price is reasonable
      const asset = get().assets.find((a) => a.id === assetId);
      if (!asset) return null;

      const assetPrices = get().priceHistory
        .filter((ph) => ph.assetId === assetId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      const currentPrice = assetPrices.length > 0 ? assetPrices[0].price : 0;

      return {
        asset,
        currentPrice,
        averagePrice: currentPrice,
        recommendation: currentPrice > 0 ? 'buy' : 'hold',
        reason: currentPrice > 0 ? 'Ativo disponível para compra' : 'Preço não disponível',
      };
    }

    const priceDiff = ((position.currentPrice - position.averagePrice) / position.averagePrice) * 100;

    let recommendation: 'buy' | 'hold' | 'sell';
    let reason: string;

    if (priceDiff < -10) {
      recommendation = 'buy';
      reason = `Preço ${Math.abs(priceDiff).toFixed(1)}% abaixo da média - boa oportunidade`;
    } else if (priceDiff > 20) {
      recommendation = 'sell';
      reason = `Preço ${priceDiff.toFixed(1)}% acima da média - considere realizar lucro`;
    } else {
      recommendation = 'hold';
      reason = `Preço próximo da média (${priceDiff > 0 ? '+' : ''}${priceDiff.toFixed(1)}%)`;
    }

    return {
      asset: position.asset,
      currentPrice: position.currentPrice,
      averagePrice: position.averagePrice,
      recommendation,
      reason,
    };
  },
});
