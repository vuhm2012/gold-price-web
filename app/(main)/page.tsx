"use client";
import SectionCards from "@/components/section-cards";
import apiClient, { JEW001 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import { Jew001ResEntity } from "@/data/entities/jew001-res-entity";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [goldRingSellingPrice, setGoldRingSellingPrice] = useState(12345000);
  const [goldRingBuyingPrice, setGoldRingBuyingPrice] = useState(13345000);
  const [goldJewelrySellingPrice, setGoldJewelrySellingPrice] =
    useState(15345000);
  const [goldJewelryBuyingPrice, setGoldJewelryBuyingPrice] =
    useState(16345000);
  const [goldAlloySellingPrice, setGoldAlloySellingPrice] = useState(17345000);
  const [goldAlloyBuyingPrice, setGoldAlloyBuyingPrice] = useState(18345000);
  const [silverSellingPrice, setSilverSellingPrice] = useState(19345000);
  const [silverBuyingPrice, setSilverBuyingPrice] = useState(22345000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<BaseEntity<Jew001ResEntity>>(JEW001);
        if (response?.result == "OK") {
          const data = response.data as Jew001ResEntity;
          setGoldRingSellingPrice(data.gold_ring_selling_price);
          setGoldRingBuyingPrice(data.gold_ring_buying_price);
          setGoldJewelrySellingPrice(data.gold_jewelry_selling_price);
          setGoldJewelryBuyingPrice(data.gold_jewelry_buying_price);
          setGoldAlloySellingPrice(data.gold_alloy_selling_price);
          setGoldAlloyBuyingPrice(data.gold_alloy_buying_price);
          setSilverSellingPrice(data.silver_selling_price);
          setSilverBuyingPrice(data.silver_buying_price);
        }
      } catch {}
    };
    fetchData();
  });

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards
        goldRingSellingPrice={goldRingSellingPrice}
        goldRingBuyingPrice={goldRingBuyingPrice}
        goldJewelrySellingPrice={goldJewelrySellingPrice}
        goldJewelryBuyingPrice={goldJewelryBuyingPrice}
        goldAlloySellingPrice={goldAlloySellingPrice}
        goldAlloyBuyingPrice={goldAlloyBuyingPrice}
        silverSellingPrice={silverSellingPrice}
        silverBuyingPrice={silverBuyingPrice}
      />
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      {/* <DataTable data={data} /> */}
    </div>
  );
};

export default HomePage;
