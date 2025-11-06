export class Jew001ResEntity {
  gold_ring_selling_price: number;
  gold_ring_buying_price: number;
  gold_jewelry_selling_price: number;
  gold_jewelry_buying_price: number;
  gold_alloy_selling_price: number;
  gold_alloy_buying_price: number;
  silver_selling_price: number;
  silver_buying_price: number;

  constructor(
    goldRingSellingPrice: number,
    goldRingBuyingPrice: number,
    goldJewelrySellingPrice: number,
    goldJewelryBuyingPrice: number,
    goldSlloySellingPrice: number,
    goldSlloyBuyingPrice: number,
    silverSellingPrice: number,
    silverBuyingPrice: number
  ) {
    this.gold_ring_selling_price = goldRingSellingPrice;
    this.gold_ring_buying_price = goldRingBuyingPrice;
    this.gold_jewelry_selling_price = goldJewelrySellingPrice;
    this.gold_jewelry_buying_price = goldJewelryBuyingPrice;
    this.gold_alloy_selling_price = goldSlloySellingPrice;
    this.gold_alloy_buying_price = goldSlloyBuyingPrice;
    this.silver_selling_price = silverSellingPrice;
    this.silver_buying_price = silverBuyingPrice;
  }
}
