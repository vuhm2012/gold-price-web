"use client";

import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import SectionCards from "@/components/section-cards";
import apiClient, { JEW001 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import { Jew001ResEntity } from "@/data/entities/jew001-res-entity";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [goldRingSellingPrice, setGoldRingSellingPrice] = useState(0);
  const [goldRingBuyingPrice, setGoldRingBuyingPrice] = useState(0);
  const [goldJewelrySellingPrice, setGoldJewelrySellingPrice] = useState(0);
  const [goldJewelryBuyingPrice, setGoldJewelryBuyingPrice] = useState(0);
  const [goldAlloySellingPrice, setGoldAlloySellingPrice] = useState(0);
  const [goldAlloyBuyingPrice, setGoldAlloyBuyingPrice] = useState(0);
  const [silverSellingPrice, setSilverSellingPrice] = useState(0);
  const [silverBuyingPrice, setSilverBuyingPrice] = useState(0);

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

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds to keep the data live on display
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-stone-950 p-6 md:p-12 text-amber-50 selection:bg-yellow-500 selection:text-red-950 flex flex-col justify-start">
      <div className="max-w-5xl mx-auto w-full">
        <div className="relative flex items-center justify-center w-full mb-8 gap-4 px-2">
          <h1 className="text-center font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent tracking-wider drop-shadow-md uppercase leading-tight flex flex-col gap-1 md:gap-2">
            <span className="text-lg md:text-2xl lg:text-3xl font-bold">CÔNG TY TNHH VÀNG BẠC TRANG SỨC</span>
            <span className="text-3xl md:text-5xl lg:text-6xl tracking-widest font-black">HÙNG LAN</span>
          </h1>
        </div>
        
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

        <div className="flex justify-center mt-8">
          <Button
            className="bg-gradient-to-r from-amber-500/20 to-yellow-600/15 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-amber-900/20 hover:bg-red-900/30 transition-all duration-200 px-8 py-6 text-lg font-bold rounded-xl cursor-pointer"
            asChild
          >
            <Link href={Routes.history}>
              <BarChart3 className="w-6 h-6 mr-2" />
              Xem biểu đồ lịch sử giá
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

