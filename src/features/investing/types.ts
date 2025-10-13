// Simplified types - applying YAGNI principle
export interface Asset {
  asset: string;
  target: number;
  participation: number;
  difference: number;
  // Optional fields for different asset types
  currentValue?: number;
  quantity?: number;
  price?: number;
  total?: number;
}

export interface TableConfig {
  title: string;
}
