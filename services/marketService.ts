import { CryptoAsset, TechnicalSignals, NewsItem, SignalStatus, MarketContext } from '../types';

// Mock Data Generators
const ASSETS: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: 1.2 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.75, change24h: -0.5 },
  { symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 3.4 },
];

const NEWS_HEADLINES = [
  { text: "SEC delays decision on ETF approval", sentiment: 'NEGATIVE' },
  { text: "Institutional inflow hits record high this quarter", sentiment: 'POSITIVE' },
  { text: "Network congestion causes transaction fee spike", sentiment: 'NEGATIVE' },
  { text: "Major tech firm integrates payment solution", sentiment: 'POSITIVE' },
  { text: "Market consolidates as traders await Fed minutes", sentiment: 'NEUTRAL' },
  { text: "Whale wallet moves $500M to exchange", sentiment: 'NEGATIVE' }, // usually bearish
  { text: "Developer activity surges on the protocol", sentiment: 'POSITIVE' },
];

export const getAssets = (): CryptoAsset[] => ASSETS;

// Simulate live price changes
export const simulatePriceUpdate = (currentPrice: number): number => {
  const volatility = 0.002; // 0.2% variance
  const change = currentPrice * (Math.random() * volatility - (volatility / 2));
  return Number((currentPrice + change).toFixed(2));
};

// Generate Mock Technical Signals based on price action (randomized for demo)
export const generateSignals = (price: number): TechnicalSignals => {
  const rsi = Math.floor(Math.random() * (80 - 20 + 1) + 20); // 20 to 80
  
  const macdVal = Math.random() > 0.5 ? SignalStatus.BULLISH : SignalStatus.BEARISH;
  
  const bbPos = Math.random();
  const bbPosition = bbPos > 0.7 ? 'UPPER' : bbPos < 0.3 ? 'LOWER' : 'MIDDLE';
  
  return {
    rsi,
    macd: {
      histogram: Number((Math.random() * 10 - 5).toFixed(2)),
      signal: macdVal,
    },
    bollingerBands: {
      position: bbPosition,
      width: Math.random() > 0.5 ? 'EXPANDING' : 'CONTRACTING',
    },
    smaCrossover: Math.random() > 0.6 ? SignalStatus.BULLISH : SignalStatus.BEARISH,
    stochastic: Math.floor(Math.random() * 100),
  };
};

export const getRecentNews = (symbol: string): NewsItem[] => {
  // Pick 3 random headlines
  const shuffled = [...NEWS_HEADLINES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((item, idx) => ({
    headline: `${symbol}: ${item.text}`,
    source: 'CryptoWire',
    sentiment: item.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
    timestamp: new Date(Date.now() - idx * 1000 * 60 * 60).toISOString()
  }));
};

export const calculateRiskScore = (signals: TechnicalSignals, news: NewsItem[]): number => {
  let risk = 50;

  // RSI Factors
  if (signals.rsi > 70) risk += 15; // Overbought risk
  if (signals.rsi < 30) risk -= 10; // Oversold (opportunity but risky catch)

  // MACD
  if (signals.macd.signal === SignalStatus.BEARISH) risk += 10;

  // News Sentiment
  const negNews = news.filter(n => n.sentiment === 'NEGATIVE').length;
  risk += (negNews * 10);

  return Math.min(Math.max(risk, 0), 100);
};

export const getMarketContext = (assetSymbol: string, currentPrice: number): MarketContext => {
  const asset = ASSETS.find(a => a.symbol === assetSymbol) || ASSETS[0];
  const signals = generateSignals(currentPrice);
  const news = getRecentNews(assetSymbol);
  const riskScore = calculateRiskScore(signals, news);

  return {
    asset: { ...asset, price: currentPrice },
    signals,
    news,
    riskScore
  };
};
