
import React, { useState } from 'react';
import { fetchStockPredictions } from './services/geminiService';
import { PredictionResponse, GroundingSource, StockCategory, PredictionDuration, StockSector, User } from './types';
import { StockCard } from './components/StockCard';
import { MarketChart } from './components/MarketChart';
import { AuthScreen } from './components/AuthScreen';
import { 
  Rocket, 
  Search, 
  AlertCircle, 
  BarChart2, 
  TrendingUp, 
  ExternalLink, 
  RefreshCw, 
  Zap,
  Clock,
  Layers,
  LogOut,
  PieChart,
  User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // App State
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Configuration State
  const [category, setCategory] = useState<StockCategory>('Growth');
  const [duration, setDuration] = useState<PredictionDuration>('1 Month');
  const [sector, setSector] = useState<StockSector>('All');

  const sectors: StockSector[] = ['All', 'Banking', 'IT', 'Auto', 'Pharma', 'FMCG', 'Energy', 'Metal', 'Infra', 'Realty'];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setSources([]);
    
    try {
      const result = await fetchStockPredictions(category, duration, sector);
      setData(result.data);
      setSources(result.sources);
    } catch (err: any) {
      setError("AI Model is busy or encountered an error parsing market data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setData(null);
    setSources([]);
  };

  // If not logged in, show Auth Screen
  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-dark-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              IndiEquity AI
            </span>
            <span className="text-xl font-bold text-white sm:hidden">IndiEquity</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 mr-4">
              <span className="hover:text-white cursor-pointer transition-colors">Market Analysis</span>
              <span className="hover:text-white cursor-pointer transition-colors">Top Picks</span>
            </div>

            {/* User Profile Dropdown/Display */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user.provider} Account</span>
              </div>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-9 w-9 rounded-full border border-slate-600 bg-slate-800"
              />
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wide mb-4">
            <Zap size={14} /> Welcome back, {user.name.split(' ')[0]}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Predict <span className="text-brand-500">High-Growth</span> Indian Stocks
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Leverage advanced AI to analyze NSE/BSE market trends, institutional flows, and technical patterns. 
            Identify stocks with high upside potential for your selected timeframe.
          </p>
          
          {/* Controls Panel */}
          {!loading && !data && (
            <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8 animate-fade-in-up shadow-xl">
              
              <div className="flex flex-col gap-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Stock Category Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      <Layers size={14} /> Stock Category
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-dark-900 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setCategory('Growth')}
                        className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          category === 'Growth' 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Growth
                      </button>
                      <button
                        onClick={() => setCategory('Penny')}
                        className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          category === 'Penny' 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Penny
                      </button>
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      <Clock size={14} /> Prediction Duration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['7 Days', '15 Days', '1 Month'] as PredictionDuration[]).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                            duration === d
                              ? 'bg-slate-800 border-brand-500/50 text-brand-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                              : 'bg-dark-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sector Selection */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    <PieChart size={14} /> Target Sector
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSector(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                          sector === s
                            ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {!data && !loading && (
            <button 
              onClick={handleGenerate}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 active:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 skew-x-12 -translate-x-full" />
              <Rocket className="h-5 w-5 group-hover:animate-pulse" />
              Generate {sector !== 'All' ? sector : ''} {category} Picks
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-8 w-8 text-slate-500 animate-pulse" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">Scanning Market...</h3>
            <p className="text-slate-400 mt-2 text-center max-w-md">
              Analyzing {category.toLowerCase()} stocks in {sector === 'All' ? 'all sectors' : `the ${sector} sector`} for the next {duration.toLowerCase()}. Checking technical indicators, volume breakouts, and market sentiment.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-200 font-medium">{error}</p>
            <button 
              onClick={handleGenerate}
              className="mt-6 flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              <RefreshCw size={16} /> Retry Analysis
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {data && !loading && (
          <div className="animate-fade-in-up space-y-8">
            
            {/* Market Summary Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">Market Overview</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">
                      {duration} Outlook
                    </span>
                  </div>
                  <p className="text-slate-400 max-w-3xl">{data.analysis.overview}</p>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Sentiment</p>
                    <p className={`text-lg font-bold ${data.analysis.marketSentiment === 'Bullish' ? 'text-green-400' : data.analysis.marketSentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {data.analysis.marketSentiment}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Top Sector</p>
                    <p className="text-lg font-bold text-brand-400">{data.analysis.topSector}</p>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="relative z-10">
                <MarketChart stocks={data.stocks} />
              </div>
            </div>

            {/* Stock Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-brand-500" />
                  <h2 className="text-2xl font-bold text-white">Top {category} Picks ({sector})</h2>
                </div>
                {category === 'Penny' && (
                  <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 font-medium animate-pulse">
                    High Risk Alert
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.stocks.map((stock, index) => (
                  <StockCard key={stock.symbol} stock={stock} index={index} />
                ))}
              </div>
            </div>

            {/* Sources & Disclaimers */}
            <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
              
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Search size={14} /> Information Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sources.length > 0 ? sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-400 hover:text-brand-400 transition-colors truncate max-w-[200px]"
                    >
                      {source.title} <ExternalLink size={10} />
                    </a>
                  )) : (
                    <span className="text-xs text-slate-600">Sources aggregated from Google Search Grounding</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertCircle size={12} /> Disclaimer
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed text-justify">
                  This application uses Artificial Intelligence to analyze publicly available market data. 
                  The predictions are generated by an AI model and <strong>do not constitute financial advice</strong>. 
                  {category === 'Penny' && <span className="text-red-400 font-semibold"> Penny stocks are extremely volatile and high-risk assets. </span>}
                  Stock market investments are subject to market risks. Past performance is not indicative of future results.
                  Please consult a SEBI registered financial advisor before making any investment decisions.
                </p>
              </div>

            </div>
            
            {/* Regenerate Button at bottom */}
            <div className="flex justify-center pt-10">
               <button 
                  onClick={() => setData(null)}
                  className="text-sm text-slate-500 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={14} /> New Analysis
                </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
