import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import PriceTrendChart from './PriceTrendChart';
import MarketComparison from './MarketComparison';
import { ArrowLeft, Bell } from 'lucide-react';

const CommodityDetail = () => {
  const { id } = useParams();
  const { commodities, markets, getPriceTrend, getLatestPrice, calculatePriceChange } = useAppContext();

  const commodity = useMemo(() => commodities.find(c => c.id === parseInt(id)), [id, commodities]);

  // For demonstration, we'll show trends from a primary market. 
  // A real app might let the user select the market.
  const primaryMarket = markets[0];
  
  const priceTrendData = useMemo(() => {
    return getPriceTrend(parseInt(id), primaryMarket.id, 7);
  }, [id, primaryMarket.id, getPriceTrend]);

  const latestPriceInfo = useMemo(() => {
    const price = getLatestPrice(parseInt(id), primaryMarket.id);
    if (!price) return null;
    const trend = calculatePriceChange(parseInt(id), primaryMarket.id);
    return { price, trend };
  }, [id, primaryMarket.id, getLatestPrice, calculatePriceChange]);

  if (!commodity) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Commodity not found</h2>
        <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{commodity.name}</h1>
          <p className="text-gray-500">{commodity.unit}</p>
        </div>
        <button className="mt-4 md:mt-0 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 flex items-center gap-2 transition-colors">
          <Bell className="h-5 w-5" />
          Set Price Alert
        </button>
      </div>
      
      {latestPriceInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-gray-600">Current Price at {primaryMarket.name}</p>
            <div className="flex items-baseline gap-4 mt-2">
                <p className="text-5xl font-bold text-green-700">₦{latestPriceInfo.price.pricePerUnit.toLocaleString()}</p>
                <span className={`text-xl font-semibold ${latestPriceInfo.trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {latestPriceInfo.trend.percentage}%
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(latestPriceInfo.price.reportedAt).toLocaleString()}
            </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <PriceTrendChart data={priceTrendData} />
        <MarketComparison commodityId={parseInt(id)} />
      </div>
    </div>
  );
};

export default CommodityDetail;