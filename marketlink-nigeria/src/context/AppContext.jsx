import React, { createContext, useState, useContext } from 'react';
import { commodities as initialCommodities } from '../data/commodities';
import { markets as initialMarkets } from '../data/markets';
import { initialPrices } from '../data/initialPrices';
import { demoUsers } from '../data/users';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [commodities] = useState(initialCommodities);
  const [markets] = useState(initialMarkets);
  const [prices, setPrices] = useState(initialPrices);
  const [users, setUsers] = useState(demoUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (phone, password) => {
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid phone number or password' };
  };

  const register = (userData) => {
    const existingUser = users.find(u => u.phone === userData.phone);
    if (existingUser) {
      return { success: false, message: 'Phone number already registered' };
    }
    const newUser = { ...userData, id: users.length + 1 };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const submitPrice = (priceData) => {
    const newPrice = {
      ...priceData,
      id: crypto.randomUUID(),
      reportedBy: currentUser.id,
      reportedAt: new Date().toISOString(),
      verified: false,
    };
    setPrices([newPrice, ...prices]);
    return { success: true, message: 'Price submitted successfully!' };
  };

  // --- Data Computation and Filtering Functions ---

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const calculateTransportCost = (fromMarket, toMarket) => {
    if (!fromMarket || !toMarket) return 0;
    const distance = getDistance(fromMarket.lat, fromMarket.lng, toMarket.lat, toMarket.lng);
    const costPerKm = 150; // Simplified rate: ₦150 per km
    return distance * costPerKm;
  };
  
  const getLatestPrice = (commodityId, marketId) => {
    return prices
      .filter(p => p.commodityId === commodityId && p.marketId === marketId)
      .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))[0];
  };

  const getPriceTrend = (commodityId, marketId, days = 7) => {
    const history = prices
      .filter(p => p.commodityId === commodityId && p.marketId === marketId)
      .sort((a, b) => new Date(a.reportedAt) - new Date(b.reportedAt));
    
    // Group by date and calculate average
    const trend = history.reduce((acc, price) => {
      const date = new Date(price.reportedAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, prices: [] };
      }
      acc[date].prices.push(price.pricePerUnit);
      return acc;
    }, {});
  
    return Object.values(trend)
      .map(d => ({
        date: d.date,
        avgPrice: d.prices.reduce((a, b) => a + b, 0) / d.prices.length,
      }))
      .slice(-days);
  };

  const calculatePriceChange = (commodityId, marketId) => {
    const priceHistory = prices
      .filter(p => p.commodityId === commodityId && p.marketId === marketId)
      .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

    if (priceHistory.length < 2) {
      return { percentage: 0, direction: 'neutral' };
    }
    const [currentPrice, previousPrice] = [priceHistory[0].pricePerUnit, priceHistory[1].pricePerUnit];
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    return {
      percentage: change.toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  };

  const getMarketComparison = (commodityId, marketIds) => {
    return marketIds.map(marketId => {
        const market = markets.find(m => m.id === marketId);
        const latestPrice = getLatestPrice(commodityId, marketId);
        return {
            market,
            price: latestPrice ? latestPrice.pricePerUnit : null,
        };
    });
  };

  const value = {
    currentUser,
    isAuthenticated,
    commodities,
    markets,
    prices,
    login,
    register,
    logout,
    submitPrice,
    getLatestPrice,
    getPriceTrend,
    calculatePriceChange,
    calculateTransportCost,
    getMarketComparison,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};