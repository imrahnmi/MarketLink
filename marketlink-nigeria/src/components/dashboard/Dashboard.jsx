import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import PriceCard from './PriceCard';
import { Search } from 'lucide-react';

const Dashboard = () => {
  const { commodities, markets, getLatestPrice, calculatePriceChange } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const latestPrices = useMemo(() => {
    // For the dashboard, let's show a variety of commodities from different markets
    // This logic can be enhanced to show most relevant prices to the user
    const priceInfos = [];
    const displayed = new Set();

    commodities.forEach(commodity => {
      // Try to find a price in a major market first
      const majorMarket = markets.find(m => m.name.includes('Mile 12') || m.name.includes('Dawanau')) || markets[0];
      const price = getLatestPrice(commodity.id, majorMarket.id);

      if (price && !displayed.has(commodity.id)) {
        priceInfos.push({
          commodity,
          market: majorMarket,
          latestPrice: price,
          trend: calculatePriceChange(commodity.id, majorMarket.id),
        });
        displayed.add(commodity.id);
      }
    });
    return priceInfos;
  }, [commodities, markets, getLatestPrice, calculatePriceChange]);

  const filteredPrices = latestPrices.filter(p => {
    const matchesSearch = p.commodity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.commodity.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(commodities.map(c => c.category).map(c => c.charAt(0).toUpperCase() + c.slice(1)))];

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to MarketLink</h1>
        <p className="text-gray-600">Your source for real-time agricultural commodity prices in Nigeria.</p>
      </div>

      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a commodity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPrices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrices.map(priceInfo => (
            <PriceCard key={`${priceInfo.commodity.id}-${priceInfo.market.id}`} priceInfo={priceInfo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No commodities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;