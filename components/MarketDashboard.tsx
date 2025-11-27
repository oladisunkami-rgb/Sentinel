import React from 'react';
import { MarketContext, SignalStatus } from '../types';
import SignalCard from './SignalCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MarketDashboardProps {
  context: MarketContext;
  priceHistory: { time: string, price: number }[];
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ context, priceHistory }) => {
  const { signals, riskScore, asset, news } = context;

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'POSITIVE') return 'text-green-400';
    if (sentiment === 'NEGATIVE') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2">
      {/* Header Stats */}
      <div className="glass-panel p-6 rounded-2xl border-t-4 border-crypto-blue shadow-lg shadow-blue-900/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <img src={`https://placehold.co/40x40/111827/FFF?text=${asset.symbol}`} className="rounded-full w-8 h-8" alt={asset.symbol} />
              {asset.name}
              <span className="text-sm font-normal text-gray-400 bg-gray-800 px-2 py-0.5 rounded ml-2">{asset.symbol}</span>
            </h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-mono text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`text-sm font-bold px-2 py-1 rounded ${asset.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
              </span>
            </div>
          </div>
          
          <div className="text-right">
             <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Risk Score</div>
             <div className={`text-4xl font-black ${riskScore > 70 ? 'text-red-500' : riskScore < 30 ? 'text-green-500' : 'text-yellow-500'}`}>
               {riskScore}
               <span className="text-lg text-gray-500">/100</span>
             </div>
             <div className="text-xs text-gray-500 mt-1">
                {riskScore > 70 ? 'Extreme Caution' : riskScore < 30 ? 'Low Risk' : 'Moderate Risk'}
             </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 mt-6 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SignalCard 
          name="RSI (14)" 
          value={signals.rsi} 
          status={signals.rsi > 70 ? 'negative' : signals.rsi < 30 ? 'positive' : 'neutral'}
          description={signals.rsi > 70 ? 'Overbought' : signals.rsi < 30 ? 'Oversold' : 'Neutral Zone'}
        />
        <SignalCard 
          name="MACD" 
          value={signals.macd.signal === SignalStatus.BULLISH ? 'BULL' : 'BEAR'} 
          status={signals.macd.signal === SignalStatus.BULLISH ? 'positive' : 'negative'}
          description={`Histogram: ${signals.macd.histogram}`}
        />
        <SignalCard 
          name="SMA 50/200" 
          value={signals.smaCrossover === SignalStatus.BULLISH ? 'GOLDEN' : 'DEATH'} 
          status={signals.smaCrossover === SignalStatus.BULLISH ? 'positive' : 'negative'}
          description={signals.smaCrossover === SignalStatus.BULLISH ? 'Bullish Crossover' : 'Bearish Cross'}
        />
        <SignalCard 
          name="Bollinger" 
          value={signals.bollingerBands.position} 
          status={signals.bollingerBands.position === 'UPPER' ? 'negative' : signals.bollingerBands.position === 'LOWER' ? 'positive' : 'neutral'}
          description={`Volatility: ${signals.bollingerBands.width}`}
        />
        <SignalCard 
          name="Stochastic" 
          value={signals.stochastic} 
          status={signals.stochastic > 80 ? 'negative' : signals.stochastic < 20 ? 'positive' : 'neutral'}
          description="Momentum Osc"
        />
      </div>

      {/* News Feed */}
      <div className="glass-panel p-4 rounded-xl flex-1 min-h-[200px]">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
          Latest Intelligence
        </h3>
        <div className="space-y-3">
          {news.map((item, idx) => (
            <div key={idx} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800 ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
                <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-sm text-gray-300 leading-snug">{item.headline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
