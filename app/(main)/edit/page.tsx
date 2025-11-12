"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient, { AUT00, JEW000, JEW001 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import { Jew001ResEntity } from "@/data/entities/jew001-res-entity";
import { Banknote, DollarSign, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const EditPage: FC = () => {
  const router = useRouter();
  const [prices, setPrices] = useState({
    goldRingSellingPrice: "",
    goldRingBuyingPrice: "",
    goldJewelrySellingPrice: "",
    goldJewelryBuyingPrice: "",
    goldAlloySellingPrice: "",
    goldAlloyBuyingPrice: "",
    silverSellingPrice: "",
    silverBuyingPrice: "",
  });

  useEffect(() => {
    try {
      const checkToken = async () => {
        await apiClient.post<BaseEntity<null>>(AUT00, {});
      };

      checkToken();
    } catch {}
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<BaseEntity<Jew001ResEntity>>(
          JEW001
        );
        if (response?.result == "OK") {
          const data = response.data as Jew001ResEntity;
          console.log(`DATA: ${JSON.stringify(data)}`);
          setPrices({
            goldRingSellingPrice:
              data.gold_ring_selling_price.toLocaleString("en-us"),
            goldRingBuyingPrice:
              data.gold_ring_buying_price.toLocaleString("en-us"),
            goldJewelrySellingPrice:
              data.gold_jewelry_selling_price.toLocaleString("en-us"),
            goldJewelryBuyingPrice:
              data.gold_jewelry_buying_price.toLocaleString("en-us"),
            goldAlloySellingPrice:
              data.gold_alloy_selling_price.toLocaleString("en-us"),
            goldAlloyBuyingPrice:
              data.gold_alloy_buying_price.toLocaleString("en-us"),
            silverSellingPrice:
              data.silver_selling_price.toLocaleString("en-us"),
            silverBuyingPrice: data.silver_buying_price.toLocaleString("en-us"),
          });
        }
      } catch {}
    };
    fetchData();
  }, []);

  const priceItems = [
    {
      key: "goldRingSellingPrice",
      label: "Giá bán nhẫn tròn trơn",
      color: "text-green-700",
    },
    {
      key: "goldRingBuyingPrice",
      label: "Giá mua nhẫn tròn trơn",
      color: "text-red-700",
    },
    {
      key: "goldJewelrySellingPrice",
      label: "Giá mua vàng trang sức",
      color: "text-green-700",
    },
    {
      key: "goldJewelryBuyingPrice",
      label: "Giá bán vàng trang sức",
      color: "text-red-700",
    },
    {
      key: "goldAlloySellingPrice",
      label: "Giá mua vàng tây",
      color: "text-green-700",
    },
    {
      key: "goldAlloyBuyingPrice",
      label: "Giá bán vàng tây",
      color: "text-red-700",
    },
    {
      key: "silverSellingPrice",
      label: "Giá mua bạc",
      color: "text-green-700",
    },
    {
      key: "silverBuyingPrice",
      label: "Giá bán bạc",
      color: "text-red-700",
    },
  ];

  const handlePriceChange = (key: string, value: string) => {
    // Allow only numbers and decimal point
    // if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
    //   setPrices(prev => ({ ...prev, [key]: value }));
    //   setSaved(false);
    // }
    if (/^\d+$/.test(value.replace(/,/g, ""))) {
      setPrices((prev) => ({
        ...prev,
        [key]: Number(value.replace(/,/g, "")).toLocaleString("en-us"),
      }));
    } else if (value === "") {
      setPrices((prev) => ({
        ...prev,
        [key]: "0",
      }));
    }
  };

  const handleSave = () => {
    const updateData = async () => {
      try {
        const response = await apiClient.post<BaseEntity<null>>(JEW000, {
          gold_ring_selling_price: Number(
            prices["goldRingSellingPrice"].replace(/,/g, "")
          ),
          gold_ring_buying_price: Number(
            prices["goldRingBuyingPrice"].replace(/,/g, "")
          ),
          gold_jewelry_selling_price: Number(
            prices["goldJewelrySellingPrice"].replace(/,/g, "")
          ),
          gold_jewelry_buying_price: Number(
            prices["goldJewelryBuyingPrice"].replace(/,/g, "")
          ),
          gold_alloy_selling_price: Number(
            prices["goldAlloySellingPrice"].replace(/,/g, "")
          ),
          gold_alloy_buying_price: Number(
            prices["goldAlloyBuyingPrice"].replace(/,/g, "")
          ),
          silver_selling_price: Number(
            prices["silverSellingPrice"].replace(/,/g, "")
          ),
          silver_buying_price: Number(
            prices["silverBuyingPrice"].replace(/,/g, "")
          ),
        });
        if (response?.result == "OK") {
          router.back();
        }
      } catch {}
    };
    updateData();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Quản lý giá
          </h1>
          <p className="text-lg text-gray-600">Điều chỉnh và cập nhật giá</p>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {priceItems.map((item) => {
            const Icon = Banknote;
            return (
              <div
                key={item.key}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className={`font-semibold ${item.color}`}>
                    {item.label}
                  </h3>
                </div>

                <div>
                  <Input
                    type="text"
                    value={prices[item.key]}
                    onChange={(e) =>
                      handlePriceChange(item.key, e.target.value)
                    }
                    className="w-full px-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="1,000,000"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleSave}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Save className="w-5 h-5" />
            Cập nhật gia
          </Button>

          <Button
            onClick={handleBack}
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-3 border border-gray-200"
          >
            <RotateCcw className="w-5 h-5" />
            Quay về trang chủ
          </Button>
        </div>

        {/* Info Banner */}
        {/* <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Pricing Tips</h4>
              <p className="text-gray-600 text-sm">
                Keep your prices competitive and clear. Round numbers or .99
                endings often perform better. Remember to save your changes
                before leaving the page.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EditPage;
