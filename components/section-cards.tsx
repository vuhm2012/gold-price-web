import { FC } from "react";

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
  const items = [
    {
      id: "gold-ring",
      name: "Nhẫn tròn trơn",
      buyingPrice: goldRingBuyingPrice,
      sellingPrice: goldRingSellingPrice,
    },
    {
      id: "gold-jewelry",
      name: "Trang sức",
      buyingPrice: goldJewelryBuyingPrice,
      sellingPrice: goldJewelrySellingPrice,
    },
    {
      id: "gold-alloy",
      name: "Vàng tây",
      buyingPrice: goldAlloyBuyingPrice,
      sellingPrice: goldAlloySellingPrice,
    },
    {
      id: "silver",
      name: "Bạc",
      buyingPrice: silverBuyingPrice,
      sellingPrice: silverSellingPrice,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 pb-6 flex flex-col justify-center min-h-0">
      <div className="bg-red-950/30 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(234,179,8,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-left">
            <thead>
              <tr className="border-b border-yellow-500/20 bg-red-950/60">
                <th className="py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 w-2/5 align-middle">
                  Sản phẩm
                </th>
                <th className="py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 text-center w-3/10 align-middle">
                  Giá mua
                </th>
                <th className="py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 text-center w-3/10 align-middle">
                  Giá bán
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-500/10">
              {items.map((item) => {
                return (
                  <tr 
                    key={item.id}
                    className="hover:bg-red-900/20 transition-all duration-200"
                  >
                    {/* Product name cell */}
                    <td className="py-4 md:py-6 px-4 md:px-8 align-middle">
                      <span className="font-black text-amber-100 text-xl md:text-2xl tracking-wider block">
                        {item.name.toUpperCase()}
                      </span>
                    </td>

                    {/* Buying Price cell */}
                    <td className="py-4 md:py-6 px-4 md:px-8 text-center align-middle">
                      {item.buyingPrice === 0 ? (
                        <span className="text-yellow-600/40 font-medium text-xl">-</span>
                      ) : (
                        <span className="text-3xl md:text-4xl font-extrabold text-amber-300 tracking-tight block">
                          {item.buyingPrice.toLocaleString("en-us")}
                        </span>
                      )}
                    </td>

                    {/* Selling Price cell */}
                    <td className="py-4 md:py-6 px-4 md:px-8 text-center align-middle">
                      {item.sellingPrice === 0 ? (
                        <span className="text-yellow-600/40 font-medium text-xl">-</span>
                      ) : (
                        <span className="text-3xl md:text-4xl font-extrabold text-yellow-400 tracking-tight block">
                          {item.sellingPrice.toLocaleString("en-us")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectionCards;
