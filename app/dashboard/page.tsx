"use client";
import SectionCards from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import apiClient, { AUT00, JEW001 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import { Jew001ResEntity } from "@/data/entities/jew001-res-entity";
import { Routes } from "@/lib/routes";
import { Key, Pencil, RefreshCcw } from "lucide-react";
import Link from "next/link";
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

  useEffect(() => {
    try {
      const checkToken = async () => {
        await apiClient.post<BaseEntity<null>>(AUT00, {});
      };

      checkToken();
    } catch {}
  }, []);

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

  const onRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-2 py-4 bg-gradient-to-b from-red-950 via-red-900 to-stone-950 h-screen max-h-screen overflow-hidden text-amber-50 selection:bg-yellow-500 selection:text-red-950">
      <div className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto px-4 md:px-8 gap-4 mb-2">
        {/* Invisible spacer to perfectly center the title on desktop screens */}
        <div className="w-[144px] hidden md:block"></div>

        <h1 className="flex-1 text-center font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent tracking-wider drop-shadow-md uppercase leading-tight flex flex-col gap-1 md:gap-2">
          <span className="text-lg md:text-2xl lg:text-3xl font-bold">CÔNG TY TNHH VÀNG BẠC TRANG SỨC</span>
          <span className="text-3xl md:text-5xl lg:text-6xl tracking-widest font-black">HÙNG LAN</span>
        </h1>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="lg" className="flex hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 transition-colors" asChild>
            <Link href={Routes.changePassword}>
              <Key className="w-6 h-6" />
            </Link>
          </Button>

          <Button
            onClick={onRefresh}
            variant="ghost"
            size="lg"
            className="flex hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-6 h-6" />
          </Button>

          <Button variant="ghost" size="lg" className="flex hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 transition-colors" asChild>
            <Link href={Routes.edit}>
              <Pencil className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center min-h-0">
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
      </div>
    </div>
  );
};

export default HomePage;
