import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";

type SectionCardsProps = {
  goldRingSellingPrice: number;
  goldRingBuyingPrice: number;
  goldJewelrySellingPrice: number;
  goldJewelryBuyingPrice: number;
  goldAlloySellingPrice: number;
  goldAlloyBuyingPrice: number;
  silverSellingPrice: number;
  silverBuyingPrice: number;
};

const SectionCards: FC<SectionCardsProps> = ({
  goldRingSellingPrice,
  goldRingBuyingPrice,
  goldJewelrySellingPrice,
  goldJewelryBuyingPrice,
  goldAlloySellingPrice,
  goldAlloyBuyingPrice,
  silverSellingPrice,
  silverBuyingPrice,
}) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <PriceCard
        title="Nhẫn tròn trơn"
        buyingPrice={goldRingBuyingPrice}
        sellingPrice={goldRingSellingPrice}
      />
      <PriceCard
        title="Trang sức"
        buyingPrice={goldJewelryBuyingPrice}
        sellingPrice={goldJewelrySellingPrice}
      />
      <PriceCard
        title="Vàng tây"
        buyingPrice={goldAlloyBuyingPrice}
        sellingPrice={goldAlloySellingPrice}
      />
      <PriceCard
        title="Bạc"
        buyingPrice={silverBuyingPrice}
        sellingPrice={silverSellingPrice}
      />
    </div>
  );
};

type PriceCardProps = {
  title: string;
  buyingPrice: number;
  sellingPrice: number;
};

const PriceCard: FC<PriceCardProps> = ({
  title,
  buyingPrice,
  sellingPrice,
}) => {
  return (
    <Card className="@container/card">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-3xl text-gray-500 font-medium">{title}</p>
          {/* <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            +2.3%
          </span> */}
        </div>

        {/* <div>
          <p className="text-2xl font-semibold text-gray-900">$2,350.00</p>
          <p className="text-xs text-gray-500">Per ounce (USD)</p>
        </div> */}

        <div className="mt-2 flex flex-wrap justify-between">
          <div>
            <p className="text-md text-gray-500">Giá mua</p>
            <p className="text-2xl font-medium text-green-700">
              {buyingPrice.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
          <div>
            <p className="text-md text-gray-500">Giá bán</p>
            <p className="text-2xl font-medium text-red-700">
              {sellingPrice.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500 italic">Updated 5 min ago</p>
      </CardContent>
    </Card>
  );
};

export default SectionCards;