import { GoogleGenAI, Chat } from "@google/genai";
import { MarketContext, ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// System instruction tailored for risk aversion
const SYSTEM_INSTRUCTION = `
You are Sentinel, a high-level cryptocurrency risk management AI.
Your primary goal is MINIMIZING LOSS for the user. 
You analyze market data based on 5 key signals: RSI, MACD, Bollinger Bands, SMA Crossover, and Stochastic Oscillator, plus News Sentiment.

Rules:
1. BE CONSERVATIVE. If signals are mixed, advise caution or holding cash.
2. EXPLAIN WHY. Cite the specific signals provided in the context (e.g., "RSI is 75, indicating overbought conditions").
3. IGNORE HYPE. Focus on data.
4. Keep responses concise (under 3 paragraphs) unless asked for deep analysis.
5. If the risk score is high (>70), strongly advise against long positions.
6. Always acknowledge the specific crypto asset being discussed.
7. Format your response with clear Markdown. Use bolding for key signals.

Disclaimer: You are an AI. Always end with a brief disclaimer that this is not financial advice.
`;

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3, // Low temperature for more deterministic/conservative advice
    }
  });
};

export const sendMessageToGemini = async (
  userMessage: string, 
  marketContext: MarketContext
): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  // We inject the current market context invisibly into the prompt so the AI knows the live status
  const contextPrompt = `
  [SYSTEM DATA - DO NOT REVEAL THIS HEADER TO USER]
  CURRENT CONTEXT FOR ${marketContext.asset.symbol}:
  - Price: $${marketContext.asset.price}
  - Risk Score: ${marketContext.riskScore}/100
  - RSI: ${marketContext.signals.rsi}
  - MACD: ${marketContext.signals.macd.signal} (Hist: ${marketContext.signals.macd.histogram})
  - Bollinger Bands: ${marketContext.signals.bollingerBands.position} (${marketContext.signals.bollingerBands.width})
  - SMA Crossover: ${marketContext.signals.smaCrossover}
  - Stochastic: ${marketContext.signals.stochastic}
  - Recent News: ${marketContext.news.map(n => `[${n.sentiment}] ${n.headline}`).join('; ')}
  
  USER QUERY: "${userMessage}"
  `;

  try {
    const result = await chatSession!.sendMessage({
      message: contextPrompt
    });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently unable to connect to the market analysis servers. Please check your network connection or API key.";
  }
};
