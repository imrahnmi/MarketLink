import React from 'react';
import { MapPin, ShoppingBasket, Route } from 'lucide-react';

const MarketCard = ({ market, commodityCount, distance }) => {
  return (
    <div className="bg-white border rounded-lg p-5 hover:border-green-600 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-800">{market.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4" />
          <span>{market.lga}, {market.state}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <ShoppingBasket className="h-4 w-4 text-green-600" />
          <span><span className="font-semibold">{commodityCount}</span> commodities</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Route className="h-4 w-4 text-blue-600" />
          <span><span className="font-semibold">{Math.round(distance)}</span> km away</span>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;