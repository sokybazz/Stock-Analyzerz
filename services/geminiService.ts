import { GoogleGenAI } from "@google/genai";
import { PredictionResponse, GroundingSource, StockCategory, PredictionDuration, StockSector } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchStockPredictions = async (
  category: StockCategory,
  duration: PredictionDuration,
  sector: StockSector
): Promise<{ data: PredictionResponse; sources: GroundingSource[] }> => {
  const modelId = 'gemini-3-pro-preview'; // Using pro-preview for high-reasoning + search

  const durationText = duration === '1 Month' ? 'upcoming month' : `upcoming ${duration.toLowerCase()}`;
  
  let typeContext = "";
  if (category === 'Penny') {
    typeContext = "Focus strictly on Indian Penny Stocks (Price generally < ₹50, Low Market Cap). These must be high-volume movers with breakout potential. NOTE: Penny stocks are high risk.";
  } else {
    typeContext = "Focus on high-potential Equity stocks (Mid-cap to Large-cap) with strong fundamentals and technical setups.";
  }

  const sectorContext = sector === 'All' 
    ? "Analyze all major sectors to find the absolute best opportunities." 
    : `Focus EXCLUSIVELY on stocks within the ${sector} sector. Do not recommend stocks from other sectors.`;

  // Adjusting logic for short durations
  const returnExpectation = duration === '7 Days' 
    ? "Identify high-momentum breakout stocks that could yield 15% or maximum possible short-term gains." 
    : "Identify stocks with the potential to generate at least 15% returns.";

  const prompt = `
    Act as a senior financial analyst for the Indian Stock Market (NSE/BSE).
    I need a prediction for the Top 10 ${sector !== 'All' ? sector : ''} ${category === 'Penny' ? 'Penny Stocks' : 'Stocks'} for the ${durationText}.
    
    ${typeContext}
    ${sectorContext}
    ${returnExpectation}
    
    You MUST use Google Search to analyze:
    1. Current market momentum, news, and volatility relevant to the ${duration} timeframe.
    2. Recent quarterly results (QoQ and YoY growth).
    3. Technical indicators (RSI, Moving Averages, Volume Breakouts) specifically for a ${duration} trade.
    4. Institutional flows (FII/DII activity) and Operator activity (especially for penny stocks).

    Output Criteria:
    - Identify 10 distinct stocks.
    - Calculate a realistic target price based on the timeframe.
    - Provide a Stop Loss to manage risk (Crucial for penny stocks).
    - Assign a Risk Level (High/Medium/Low).
    
    Format Requirements:
    You must return the result as a raw JSON object embedded in a markdown code block. 
    The JSON structure must match this interface:
    {
      "analysis": {
        "overview": "Brief 2-sentence summary of current Indian market conditions for the selected timeframe.",
        "topSector": "The most promising sector right now (or the selected sector if specific)",
        "marketSentiment": "Bullish" | "Bearish" | "Neutral"
      },
      "stocks": [
        {
          "symbol": "Ticker Symbol (e.g., TATAMOTORS)",
          "name": "Full Company Name",
          "currentPrice": Number (Current market price in INR),
          "targetPrice": Number (Projected price in ${duration}),
          "stopLoss": Number,
          "potentialUpside": Number (Percentage value, e.g., 15.5),
          "sector": "Sector Name",
          "reasoning": "Concise technical or fundamental reason for the pick (max 20 words)",
          "riskLevel": "High" | "Medium" | "Low"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });

    const text = response.text;
    
    // Extract Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        url: c.web.uri,
        title: c.web.title || new URL(c.web.uri).hostname
      }));

    // Parse JSON from Markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    let jsonString = "";
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      // Fallback: try to find the first { and last }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = text.substring(firstBrace, lastBrace + 1);
      }
    }

    if (!jsonString) {
      throw new Error("Failed to extract valid JSON from model response.");
    }

    const data = JSON.parse(jsonString) as PredictionResponse;
    
    return { data, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
