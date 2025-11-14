import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Scale, Map, ArrowRight } from 'lucide-react';

const PriceComparison = () => {
  const { commodities, markets, getMarketComparison, calculateTransportCost } = useAppContext();
  
  const [selectedCommodity, setSelectedCommodity] = useState(commodities[0]?.id || '');
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);

  // Assuming user is at the first market for transport calculation
  const userMarket = markets[0]; 

  const handleMarketChange = (marketId) => {
    setSelectedMarkets(prev =>
      prev.includes(marketId)
        ? prev.filter(id => id !== marketId)
        : [...prev, marketId]
    );
  };

  const handleCompare = () => {
    const results = getMarketComparison(parseInt(selectedCommodity), selectedMarkets);
    const calculatedResults = results.map(result => {
        const transportCost = calculateTransportCost(userMarket, result.market);
        return {
            ...result,
            transportCost,
            totalCost: result.price ? result.price + transportCost : null,
        }
    });
    setComparisonResults(calculatedResults);
  };

  const bestDeal = useMemo(() => {
    if (comparisonResults.length === 0) return null;
    return comparisonResults
        .filter(r => r.totalCost)
        .sort((a,b) => a.totalCost - b.totalCost)[0];
  }, [comparisonResults]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare Prices</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Commodity Selection */}
          <div>
            <label htmlFor="commodity" className="block text-sm font-medium text-gray-700 mb-2">1. Select Commodity</label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                id="commodity"
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                {commodities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Market Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">2. Select Markets (up to 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {markets.map(market => (
                <label key={market.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${selectedMarkets.includes(market.id) ? 'bg-green-100 border-green-500' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedMarkets.includes(market.id)}
                    onChange={() => handleMarketChange(market.id)}
                    className="h-4 w-4 rounded text-green-600 focus:ring-green-500"
                    disabled={selectedMarkets.length >= 4 && !selectedMarkets.includes(market.id)}
                  />
                  <span>{market.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
            <button
                onClick={handleCompare}
                disabled={!selectedCommodity || selectedMarkets.length < 2}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Compare Prices
            </button>
        </div>
      </div>

      {comparisonResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comparison Results</h2>
          {bestDeal && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6">
                  <p className="font-bold">Best Deal: {bestDeal.market.name}</p>
                  <p>Save up to ₦{(comparisonResults.sort((a,b) => b.totalCost - a.totalCost)[0].totalCost - bestDeal.totalCost).toLocaleString()} when transport is considered.</p>
              </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparisonResults.map(result => (
              <div key={result.market.id} className={`p-5 rounded-lg shadow-md ${bestDeal?.market.id === result.market.id ? 'bg-white border-2 border-green-500' : 'bg-white'}`}>
                <h3 className="font-bold text-lg">{result.market.name}</h3>
                <p className="text-sm text-gray-500">{result.market.state}</p>
                {result.price ? (
                    <>
                        <div className="my-3">
                            <p className="text-sm text-gray-600">Market Price</p>
                            <p className="text-3xl font-bold text-gray-800">₦{result.price.toLocaleString()}</p>
                        </div>
                        <div className="my-3">
                            <p className="text-sm text-gray-600">Est. Transport</p>
                            <p className="text-xl font-semibold text-gray-700">₦{Math.round(result.transportCost).toLocaleString()}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t">
                            <p className="text-sm text-gray-600">Total Cost</p>
                            <p className="text-2xl font-bold text-green-700">₦{Math.round(result.totalCost).toLocaleString()}</p>
                        </div>
                    </>
                ) : (
                    <p className="mt-8 text-center text-gray-500">No price data available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceComparison;