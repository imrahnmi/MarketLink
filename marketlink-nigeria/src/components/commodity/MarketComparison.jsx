import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketComparison = ({ commodityId }) => {
  const { markets, getLatestPrice } = useAppContext();

  const priceData = useMemo(() => {
    return markets.map(market => ({
      market,
      price: getLatestPrice(commodityId, market.id)?.pricePerUnit,
    }))
    .filter(item => item.price)
    .sort((a, b) => a.price - b.price);
  }, [markets, commodityId, getLatestPrice]);

  if (priceData.length === 0) {
    return <p>No price data available for comparison.</p>;
  }

  const cheapest = priceData[0].price;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Price Across Markets</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Market</th>
              <th className="p-3 text-right">Price (₦)</th>
              <th className="p-3 text-right">Difference</th>
            </tr>
          </thead>
          <tbody>
            {priceData.map(({ market, price }, index) => (
              <tr key={market.id} className={`border-b ${index === 0 ? 'bg-green-50' : ''}`}>
                <td className="p-3">
                  <p className="font-semibold">{market.name}</p>
                  <p className="text-sm text-gray-500">{market.state}</p>
                </td>
                <td className="p-3 text-right font-mono font-semibold text-lg">
                  {price.toLocaleString()}
                </td>
                <td className="p-3 text-right">
                  {index === 0 ? (
                    <span className="font-semibold text-green-600">Best Deal</span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-end gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +₦{(price - cheapest).toLocaleString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketComparison;