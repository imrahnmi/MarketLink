import { commodities } from '../data/commodities';
import { markets } from '../data/markets';
import { demoUsers } from '../data/users';

const getBasePrice = (commodity) => {
  switch (commodity.name) {
    case 'Rice (Local)': return 85000;
    case 'Rice (Foreign)': return 50000;
    case 'Maize (Yellow)': return 52000;
    case 'Beans (White)': return 120000;
    case 'Millet': return 47000;
    case 'Sorghum': return 50000;
    case 'Groundnuts': return 105000;
    default: return 70000;
  }
};

export const generatePriceHistory = (commodity, market, days = 30) => {
  const basePrice = getBasePrice(commodity);
  const history = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const variance = (Math.random() - 0.5) * 0.1 * basePrice;
    const price = basePrice + variance;

    history.push({
      id: crypto.randomUUID(),
      commodityId: commodity.id,
      marketId: market.id,
      pricePerUnit: Math.round(price),
      qualityGrade: ['premium', 'standard', 'low'][Math.floor(Math.random() * 3)],
      reportedBy: demoUsers[Math.floor(Math.random() * demoUsers.length)].id,
      reportedAt: date.toISOString(),
      verified: Math.random() > 0.2,
    });
  }

  return history;
};

export const generateInitialPrices = () => {
  let prices = [];
  commodities.forEach(commodity => {
    markets.forEach(market => {
      prices = prices.concat(generatePriceHistory(commodity, market, 30));
    });
  });
  return prices;
};