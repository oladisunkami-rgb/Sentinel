export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export enum SignalStatus {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL',
  VOLATILE = 'VOLATILE'
}

export interface TechnicalSignals {
  rsi: number; // Relative Strength Index (0-100)
  macd: {
    histogram: number;
    signal: SignalStatus;
  };
  bollingerBands: {
    position: 'UPPER' | 'LOWER' | 'MIDDLE';
    width: 'EXPANDING' | 'CONTRACTING';
  };
  smaCrossover: SignalStatus; // 50/200 Day Moving Average
  stochastic: number; // 0-100
}

export interface NewsItem {
  headline: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  timestamp: string;
}

export interface MarketContext {
  asset: CryptoAsset;
  signals: TechnicalSignals;
  news: NewsItem[];
  riskScore: number; // 0-100 (100 is high risk)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}
