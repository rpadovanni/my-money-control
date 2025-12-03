// Types for investments feature

export type AssetType = 'stock' | 'bond' | 'fund' | 'crypto' | 'other';

export const ASSET_TYPES: Record<AssetType, string> = {
  stock: 'Ação',
  bond: 'Título',
  fund: 'Fundo',
  crypto: 'Criptomoeda',
  other: 'Outro',
};

export type TransactionType = 'buy' | 'sell';

export const TRANSACTION_TYPES: Record<TransactionType, string> = {
  buy: 'Compra',
  sell: 'Venda',
};

export interface Asset {
  id: string;
  name: string;
  code: string; // Ticker/símbolo
  type: AssetType;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  date: Date;
  fees?: number; // Taxas/corretagem
  notes?: string;
}

export interface PriceHistory {
  assetId: string;
  date: Date;
  price: number;
}

export interface AssetPosition {
  asset: Asset;
  totalQuantity: number;
  averagePrice: number;
  totalInvested: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface AssetFormData {
  name: string;
  code: string;
  type: AssetType;
}

export interface TransactionFormData {
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  date: Date;
  fees?: number;
  notes?: string;
}

