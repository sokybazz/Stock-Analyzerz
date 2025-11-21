import React from 'react';
import { StockPrediction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MarketChartProps {
  stocks: StockPrediction[];
}

export const MarketChart: React.FC<MarketChartProps> = ({ stocks }) => {
  const data = stocks.map(s => ({
    name: s.symbol,
    Upside: s.potentialUpside,
    Price: s.currentPrice
  }));

  return (
    <div className="h-[350px] w-full bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        Predicted Growth Potential (%)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            tick={{ fontSize: 10 }} 
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#334155', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#4ade80' }}
          />
          <Bar dataKey="Upside" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.Upside > 20 ? '#22c55e' : '#4ade80'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};