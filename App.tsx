import React, { useState, useEffect, useCallback } from 'react';
import MarketDashboard from './components/MarketDashboard';
import ChatInterface from './components/ChatInterface';
import { MarketContext, ChatMessage, CryptoAsset } from './types';
import { getMarketContext, simulatePriceUpdate } from './services/marketService';
import { sendMessageToGemini } from './services/geminiService';

const ASSET_SYMBOLS = ['BTC', 'ETH', 'SOL'];

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chart data state
  const [priceHistory, setPriceHistory] = useState<{ time: string, price: number }[]>([]);

  // Initialize market data
  useEffect(() => {
    // Initial fetch
    const initialContext = getMarketContext(selectedSymbol, selectedSymbol === 'BTC' ? 64230 : selectedSymbol === 'ETH' ? 3450 : 145);
    setMarketContext(initialContext);
    
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 1000 * 60).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'}),
      price: initialContext.asset.price + (Math.random() * 100 - 50)
    }));
    setPriceHistory(initialHistory);
  }, [selectedSymbol]);

  // Live simulation effect
  useEffect(() => {
    if (!marketContext) return;

    const interval = setInterval(() => {
      setMarketContext(prev => {
        if (!prev) return null;
        
        // Simulate new price
        const newPrice = simulatePriceUpdate(prev.asset.price);
        
        // Update history
        setPriceHistory(prevHistory => {
          const newHistory = [...prevHistory, {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'}),
            price: newPrice
          }];
          if (newHistory.length > 30) newHistory.shift();
          return newHistory;
        });

        // Regenerate signals occasionally (or based on new price in a real app)
        // For efficiency in React, we update full context every tick here for demo smoothness
        return getMarketContext(selectedSymbol, newPrice);
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [selectedSymbol, marketContext?.asset.price]); // Dependencies might cause re-creation, but needed for `prev`

  const handleSendMessage = async (text: string) => {
    if (!marketContext) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text, marketContext);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white p-4 md:p-6 lg:p-8">
      
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        {/* Navigation Bar */}
        <header className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md border border-white/10">
                <svg className="w-6 h-6 text-crypto-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               SENTINEL <span className="text-crypto-blue font-mono text-lg">AI</span>
             </h1>
          </div>

          <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800">
            {ASSET_SYMBOLS.map(sym => (
              <button
                key={sym}
                onClick={() => {
                   setSelectedSymbol(sym);
                   setMessages([]); // Clear chat on symbol switch to avoid context confusion
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedSymbol === sym 
                    ? 'bg-gray-800 text-white shadow-lg border border-gray-700' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left: Dashboard (Charts + Signals) */}
          <div className="lg:col-span-7 h-full min-h-0 flex flex-col">
            {marketContext ? (
              <MarketDashboard context={marketContext} priceHistory={priceHistory} />
            ) : (
               <div className="flex items-center justify-center h-full text-gray-500">Loading market data...</div>
            )}
          </div>

          {/* Right: AI Chat */}
          <div className="lg:col-span-5 h-full min-h-[500px]">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
