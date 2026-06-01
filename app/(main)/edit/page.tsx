'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient, { AUT00, JEW000, JEW001 } from '@/data/api-client';
import { BaseEntity } from '@/data/entities/base-entity';
import { Jew001ResEntity } from '@/data/entities/jew001-res-entity';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const EditPage: FC = () => {
  const router = useRouter();
  const [prices, setPrices] = useState({
    goldRingSellingPrice: '',
    goldRingBuyingPrice: '',
    goldJewelrySellingPrice: '',
    goldJewelryBuyingPrice: '',
    goldAlloySellingPrice: '',
    goldAlloyBuyingPrice: '',
    silverSellingPrice: '',
    silverBuyingPrice: '',
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
        if (response?.result == 'OK') {
          const data = response.data as Jew001ResEntity;
          console.log(`DATA: ${JSON.stringify(data)}`);
          setPrices({
            goldRingSellingPrice:
              data.gold_ring_selling_price.toLocaleString('en-us'),
            goldRingBuyingPrice:
              data.gold_ring_buying_price.toLocaleString('en-us'),
            goldJewelrySellingPrice:
              data.gold_jewelry_selling_price.toLocaleString('en-us'),
            goldJewelryBuyingPrice:
              data.gold_jewelry_buying_price.toLocaleString('en-us'),
            goldAlloySellingPrice:
              data.gold_alloy_selling_price.toLocaleString('en-us'),
            goldAlloyBuyingPrice:
              data.gold_alloy_buying_price.toLocaleString('en-us'),
            silverSellingPrice:
              data.silver_selling_price.toLocaleString('en-us'),
            silverBuyingPrice: data.silver_buying_price.toLocaleString('en-us'),
          });
        }
      } catch {}
    };
    fetchData();
  }, []);

  type ProductItem = {
    id: string;
    name: string;
    buyingKey: keyof typeof prices;
    sellingKey: keyof typeof prices;
  };

  const products: ProductItem[] = [
    {
      id: 'gold-ring',
      name: 'Nhẫn tròn trơn',
      buyingKey: 'goldRingBuyingPrice',
      sellingKey: 'goldRingSellingPrice',
    },
    {
      id: 'gold-jewelry',
      name: 'Trang sức',
      buyingKey: 'goldJewelryBuyingPrice',
      sellingKey: 'goldJewelrySellingPrice',
    },
    {
      id: 'gold-alloy',
      name: 'Vàng tây',
      buyingKey: 'goldAlloyBuyingPrice',
      sellingKey: 'goldAlloySellingPrice',
    },
    {
      id: 'silver',
      name: 'Bạc',
      buyingKey: 'silverBuyingPrice',
      sellingKey: 'silverSellingPrice',
    },
  ];

  const handlePriceChange = (key: keyof typeof prices, value: string) => {
    const cleanValue = value.replace(/,/g, '');
    if (cleanValue === '') {
      setPrices((prev) => ({
        ...prev,
        [key]: '',
      }));
    } else if (/^\d+$/.test(cleanValue)) {
      setPrices((prev) => ({
        ...prev,
        [key]: Number(cleanValue).toLocaleString('en-us'),
      }));
    }
  };

  const handleSave = () => {
    const updateData = async () => {
      try {
        const response = await apiClient.post<BaseEntity<null>>(JEW000, {
          gold_ring_selling_price: Number(
            (prices['goldRingSellingPrice'] || '0').replace(/,/g, '')
          ),
          gold_ring_buying_price: Number(
            (prices['goldRingBuyingPrice'] || '0').replace(/,/g, '')
          ),
          gold_jewelry_selling_price: Number(
            (prices['goldJewelrySellingPrice'] || '0').replace(/,/g, '')
          ),
          gold_jewelry_buying_price: Number(
            (prices['goldJewelryBuyingPrice'] || '0').replace(/,/g, '')
          ),
          gold_alloy_selling_price: Number(
            (prices['goldAlloySellingPrice'] || '0').replace(/,/g, '')
          ),
          gold_alloy_buying_price: Number(
            (prices['goldAlloyBuyingPrice'] || '0').replace(/,/g, '')
          ),
          silver_selling_price: Number(
            (prices['silverSellingPrice'] || '0').replace(/,/g, '')
          ),
          silver_buying_price: Number(
            (prices['silverBuyingPrice'] || '0').replace(/,/g, '')
          ),
        });
        if (response?.result == 'OK') {
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
    <div className='min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-stone-950 p-6 md:p-12 text-amber-50 selection:bg-yellow-500 selection:text-red-950 flex flex-col justify-start'>
      <div className='max-w-5xl mx-auto w-full'>
        {/* Header */}
        <div className='flex items-center justify-between w-full mb-8 gap-4 px-2'>
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant='ghost'
            size='lg'
            className='hover:bg-red-900/40 text-amber-300 hover:text-yellow-200 transition-colors cursor-pointer gap-2 font-bold uppercase tracking-wider px-3 md:px-4'
          >
            <ArrowLeft className='w-6 h-6' />
            <span className='hidden md:inline'>Quay về</span>
          </Button>

          {/* Title */}
          <h1 className='text-2xl md:text-4xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-sm text-center flex-1'>
            Quản lý giá
          </h1>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            variant='ghost'
            size='lg'
            className='hover:bg-red-900/40 text-yellow-400 hover:text-yellow-200 transition-colors cursor-pointer gap-2 font-black uppercase tracking-wider px-3 md:px-4'
          >
            <Save className='w-6 h-6' />
            <span className='hidden md:inline'>Cập nhật</span>
          </Button>
        </div>

        {/* Price Table */}
        <div className='bg-red-950/30 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(234,179,8,0.08)] mb-8'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[500px] border-collapse text-left'>
              <thead>
                <tr className='border-b border-yellow-500/20 bg-red-950/60'>
                  <th className='py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 w-2/5 align-middle'>
                    Sản phẩm
                  </th>
                  <th className='py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 text-center w-3/10 align-middle'>
                    Giá mua
                  </th>
                  <th className='py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-black uppercase tracking-wider text-yellow-300 text-center w-3/10 align-middle'>
                    Giá bán
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-yellow-500/10'>
                {products.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className='hover:bg-red-900/20 transition-all duration-200'
                    >
                      {/* Product name cell */}
                      <td className='py-4 md:py-6 px-4 md:px-8 align-middle'>
                        <span className='font-black text-amber-100 text-xl md:text-2xl tracking-wider block'>
                          {item.name.toUpperCase()}
                        </span>
                      </td>

                      {/* Buying Price cell with Input */}
                      <td className='py-4 md:py-6 px-4 md:px-8 align-middle'>
                        <Input
                          type='text'
                          value={prices[item.buyingKey]}
                          onChange={(e) =>
                            handlePriceChange(item.buyingKey, e.target.value)
                          }
                          className='w-full px-4 py-3 text-2xl md:text-3xl font-extrabold text-amber-300 bg-red-950/40 border-2 border-yellow-500/20 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all text-center placeholder:text-amber-300/30'
                          placeholder='0'
                        />
                      </td>

                      {/* Selling Price cell with Input */}
                      <td className='py-4 md:py-6 px-4 md:px-8 align-middle'>
                        <Input
                          type='text'
                          value={prices[item.sellingKey]}
                          onChange={(e) =>
                            handlePriceChange(item.sellingKey, e.target.value)
                          }
                          className='w-full px-4 py-3 text-2xl md:text-3xl font-extrabold text-yellow-400 bg-red-950/40 border-2 border-yellow-500/20 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all text-center placeholder:text-yellow-400/30'
                          placeholder='0'
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
