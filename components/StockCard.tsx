import React from 'react';
import { StockPrediction } from '../types';
import { TrendingUp, AlertTriangle, ShieldAlert, Target } from 'lucide-react';

interface StockCardProps {
  stock: StockPrediction;
  index: number;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, index }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
      
      {/* Rank Badge */}
      <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-slate-700/50 flex items-end justify-start pl-3 pb-2 text-xl font-bold text-slate-500 group-hover:text-brand-400 transition-colors">
        #{index + 1}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{stock.symbol}</h3>
          <p className="text-sm text-slate-400 truncate max-w-[180px]">{stock.name}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-700 text-slate-300">
            {stock.sector}
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-semibold border ${getRiskColor(stock.riskLevel)}`}>
          {stock.riskLevel} Risk
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Current Price</p>
          <p className="text-lg font-semibold text-white">₹{stock.currentPrice.toLocaleString()}</p>
        </div>
        <div className="bg-brand-900/20 rounded-lg p-3 border border-brand-500/20">
          <p className="text-xs text-brand-400 mb-1 flex items-center gap-1">
            <Target size={12} /> Target
          </p>
          <p className="text-lg font-bold text-brand-400">₹{stock.targetPrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-col">
           <span className="text-xs text-red-400 flex items-center gap-1">
             <ShieldAlert size={12} /> Stop Loss
           </span>
           <span className="font-mono text-sm text-slate-300">₹{stock.stopLoss}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-brand-400 flex items-center gap-1">
             <TrendingUp size={12} /> Potential
           </span>
           <span className="font-mono text-lg font-bold text-brand-400">+{stock.potentialUpside}%</span>
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-3 mt-2">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-brand-500 font-semibold">AI Analysis:</span> {stock.reasoning}
        </p>
      </div>
    </div>
  );
};