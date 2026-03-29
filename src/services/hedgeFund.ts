import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface AgentReport {
  agentName: string;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

export interface HedgeFundDecision {
  ticker: string;
  decision: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  reports: AgentReport[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  priceTarget: string;
}

export async function runHedgeFundAnalysis(ticker: string): Promise<HedgeFundDecision> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the stock ${ticker} as an AI Hedge Fund Team. 
    Provide a detailed report from the following agents:
    1. Market Data Agent (Current price, volume, trends)
    2. Technical Analysis Agent (RSI, Moving Averages, Support/Resistance)
    3. Fundamental Analysis Agent (P/E, Revenue, Earnings, Debt)
    4. Sentiment Analysis Agent (News, Social Media, Analyst ratings)
    5. Risk Manager Agent (Volatility, Beta, Macro risks)
    
    Finally, as the Portfolio Manager, provide a final decision (BUY, SELL, or HOLD) with a price target and overall reasoning.
    
    Format the output as a JSON object matching this structure:
    {
      "ticker": "${ticker}",
      "decision": "BUY" | "SELL" | "HOLD",
      "reasoning": "...",
      "priceTarget": "$...",
      "riskLevel": "LOW" | "MEDIUM" | "HIGH",
      "reports": [
        {
          "agentName": "...",
          "analysis": "...",
          "sentiment": "bullish" | "bearish" | "neutral",
          "confidence": 0-100
        }
      ]
    }`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ticker: { type: Type.STRING },
          decision: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
          reasoning: { type: Type.STRING },
          priceTarget: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          reports: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                agentName: { type: Type.STRING },
                analysis: { type: Type.STRING },
                sentiment: { type: Type.STRING, enum: ["bullish", "bearish", "neutral"] },
                confidence: { type: Type.NUMBER }
              },
              required: ["agentName", "analysis", "sentiment", "confidence"]
            }
          }
        },
        required: ["ticker", "decision", "reasoning", "priceTarget", "riskLevel", "reports"]
      }
    }
  });

  return JSON.parse(response.text);
}
