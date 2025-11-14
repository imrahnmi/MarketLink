import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import MarketCard from './MarketCard';
import { Search } from 'lucide-react';

const MarketFinder = () => {
  const { markets, prices, getDistance } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Assume user is at the first market for distance calculation
  const userLocation = { lat: markets[0].lat, lng: markets[0].lng };

  const marketData = useMemo(() => {
    return markets.map(market => {
      const commodityCount = new Set(prices.filter(p => p.marketId === market.id).map(p => p.commodityId)).size;
      const distance = getDistance(userLocation.lat, userLocation.lng, market.lat, market.lng);
      return { ...market, commodityCount, distance };
    });
  }, [markets, prices, getDistance, userLocation]);

  const filteredMarkets = useMemo(() => {
    return marketData.filter(market => {
      const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) || market.lga.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = selectedState === 'All' || market.state === selectedState;
      return matchesSearch && matchesState;
    });
  }, [marketData, searchTerm, selectedState]);

  const allStates = ['All', ...new Set(markets.map(m => m.state).sort())];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a Market</h1>
      <p className="text-gray-600 mb-6">Discover agricultural markets across Nigeria.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by market name or LGA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {allStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredMarkets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map(market => (
            <MarketCard 
              key={market.id} 
              market={market}
              commodityCount={market.commodityCount}
              distance={market.distance}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No markets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MarketFinder;