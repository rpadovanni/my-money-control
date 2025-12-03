import type { Asset, Transaction, PriceHistory, AssetFormData, TransactionFormData } from '../types';

// Service layer for investments
// Following YAGNI - implementing only what's needed now

export const investmentService = {
  // Assets
  async fetchAssets(): Promise<Asset[]> {
    // TODO: implement API call
    return [];
  },

  async createAsset(data: AssetFormData): Promise<Asset> {
    // TODO: implement API call
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    return newAsset;
  },

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    // TODO: implement API call
    return { ...data, id } as Asset;
  },

  async deleteAsset(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting asset:', id);
  },

  // Transactions
  async fetchTransactions(): Promise<Transaction[]> {
    // TODO: implement API call
    return [];
  },

  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    // TODO: implement API call
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    return newTransaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    // TODO: implement API call
    console.log('Deleting transaction:', id);
  },

  // Price tracking (mocked)
  async fetchPriceHistory(assetId: string, days: number = 30): Promise<PriceHistory[]> {
    // Mock price history - generates random price data
    const history: PriceHistory[] = [];
    const now = new Date();
    const basePrice = 50 + Math.random() * 100; // Random base price between 50-150

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate price with some volatility
      const volatility = (Math.random() - 0.5) * 0.1; // ±5% change
      const price = basePrice * (1 + volatility * (days - i) / days);
      
      history.push({
        assetId,
        date,
        price: Math.round(price * 100) / 100,
      });
    }

    return history;
  },

  async getCurrentPrice(assetId: string): Promise<number> {
    // Mock current price - returns a random price
    const history = await this.fetchPriceHistory(assetId, 1);
    return history.length > 0 ? history[history.length - 1].price : 100;
  },

  async updatePriceHistory(assetId: string): Promise<PriceHistory[]> {
    // Updates price history for an asset
    return this.fetchPriceHistory(assetId, 30);
  },
};

