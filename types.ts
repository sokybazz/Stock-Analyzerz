
export interface StockPrediction {
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  potentialUpside: number; // Percentage
  sector: string;
  reasoning: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface MarketAnalysis {
  overview: string;
  topSector: string;
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface PredictionResponse {
  analysis: MarketAnalysis;
  stocks: StockPrediction[];
}

export interface GroundingSource {
  url: string;
  title: string;
}

export type StockCategory = 'Growth' | 'Penny';
export type PredictionDuration = '7 Days' | '15 Days' | '1 Month';
export type StockSector = 'All' | 'Banking' | 'IT' | 'Auto' | 'Pharma' | 'FMCG' | 'Energy' | 'Metal' | 'Infra' | 'Realty';
export type RiskLevel = 'All' | 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  provider: 'google' | 'phone';
}