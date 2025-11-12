"use client";
import SectionCards from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import apiClient, { AUT00, JEW001 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import { Jew001ResEntity } from "@/data/entities/jew001-res-entity";
import { Routes } from "@/lib/routes";
import { DollarSign, Key, Pencil, RefreshCcw } from "lucide-react";
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
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Bảng giá
        </h1>
      </div>
      <div className="flex w-full justify-end px-4">
        <Button variant="ghost" size="lg" className="flex" asChild>
          <Link href={Routes.changePassword} className="dark:text-foreground">
            <Key />
          </Link>
        </Button>

        <Button
          onClick={onRefresh}
          variant="ghost"
          size="lg"
          className="flex"
          asChild
        >
          <div className="dark:text-foreground">
            <RefreshCcw />
          </div>
        </Button>

        <Button variant="ghost" size="lg" className="flex" asChild>
          <Link href={Routes.edit} className="dark:text-foreground">
            <Pencil />
          </Link>
        </Button>
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
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      {/* <DataTable data={data} /> */}
    </div>
  );
};

export default HomePage;
