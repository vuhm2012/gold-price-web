export interface PriceValue {
  min: number;
  max: number;
  latest: number;
}

export interface PriceHistoryDataPoint {
  time: string;
  startDate: string;
  endDate: string;
  timestamp: string;
  gold_ring_selling_price?: PriceValue;
  gold_ring_buying_price?: PriceValue;
  gold_jewelry_selling_price?: PriceValue;
  gold_jewelry_buying_price?: PriceValue;
  gold_alloy_selling_price?: PriceValue;
  gold_alloy_buying_price?: PriceValue;
  silver_selling_price?: PriceValue;
  silver_buying_price?: PriceValue;
}

export interface PriceHistoryResponse {
  startDate: string;
  endDate: string;
  data: PriceHistoryDataPoint[];
}
