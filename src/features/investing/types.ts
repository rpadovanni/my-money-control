export interface Asset {
  asset: string;
  target: number;
  participation: number;
  difference: number;
}

export interface AssetWithValue extends Asset {
  currentValue: number;
}

export interface AssetWithQuantity extends Asset {
  quantity: number;
  price: number;
  total: number;
}

export interface AssetTableConfig {
  title: string;
  headerColor: string;
  rowColor: string;
  recommendationColor: string;
  columns: {
    asset: string;
    currentValue?: string;
    quantity?: string;
    target: string;
    price?: string;
    total?: string;
    participation: string;
    difference: string;
  };
}
