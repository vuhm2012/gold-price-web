"use client";
import PriceHistoryChart from "@/components/price-history-chart";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-stone-950 p-6 md:p-12 text-amber-50 selection:bg-yellow-500 selection:text-red-950 flex flex-col justify-start">
      <div className="max-w-5xl mx-auto w-full">
        <div className="relative flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-4 px-2">
          <div className="flex w-full md:w-[144px] justify-start">
            <Button
              variant="ghost"
              size="lg"
              className="flex hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 transition-colors"
              asChild
            >
              <Link href={Routes.home}>
                <ArrowLeft className="w-6 h-6 mr-2" />
                <span className="hidden md:inline">Quay lại</span>
              </Link>
            </Button>
          </div>

          <h1 className="flex-1 text-center font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent tracking-wider drop-shadow-md uppercase leading-tight flex flex-col gap-1 md:gap-2">
            <span className="text-lg md:text-2xl lg:text-3xl font-bold">CÔNG TY TNHH VÀNG BẠC TRANG SỨC</span>
            <span className="text-3xl md:text-5xl lg:text-6xl tracking-widest font-black">HÙNG LAN</span>
          </h1>

          <div className="w-[144px] hidden md:block"></div>
        </div>
        
        <PriceHistoryChart />
      </div>
    </div>
  );
};

export default HistoryPage;
