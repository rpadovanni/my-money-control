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

export interface TableConfig {
  title: string;
  headerColor: string;
  rowColor: string;
  recommendationColor: string;
}
