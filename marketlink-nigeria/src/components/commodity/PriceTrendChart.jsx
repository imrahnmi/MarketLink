import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceTrendChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">7-Day Price Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tickFormatter={(tick) => `₦${(tick / 1000).toFixed(0)}k`}
            domain={['dataMin - 1000', 'dataMax + 1000']}
          />
          <Tooltip 
            formatter={(value) => [`₦${value.toLocaleString()}`, 'Price']}
          />
          <Legend />
          <Line type="monotone" dataKey="avgPrice" stroke="#16a34a" strokeWidth={2} name="Average Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceTrendChart;