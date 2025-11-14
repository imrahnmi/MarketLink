import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

const PriceCard = ({ priceInfo }) => {
  const { commodity, market, latestPrice, trend } = priceInfo;

  const trendIcon =
    trend.direction === 'up' ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : trend.direction === 'down' ? (
      <TrendingDown className="h-5 w-5 text-red-500" />
    ) : (
      <Minus className="h-5 w-5 text-gray-500" />
    );
  
  const trendColor =
    trend.direction === 'up'
      ? 'text-green-500'
      : trend.direction === 'down'
      ? 'text-red-500'
      : 'text-gray-500';

  return (
    <Link 
      to={`/commodity/${commodity.id}`} 
      className="bg-white border rounded-lg p-4 hover:border-green-600 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <h3 className="font-bold text-lg text-gray-800">{commodity.name}</h3>
        <p className="text-sm text-gray-500">{commodity.unit}</p>
        <p className="text-2xl font-bold text-green-700 my-2">
          ₦{latestPrice.pricePerUnit.toLocaleString()}
        </p>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{market.name}</span>
          </div>
          <div className={`flex items-center gap-1 font-semibold ${trendColor}`}>
            {trendIcon}
            <span>{trend.percentage}%</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Updated {new Date(latestPrice.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </Link>
  );
};

export default PriceCard;