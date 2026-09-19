export type NavigationTab =
  | 'dashboard'
  | 'statement'
  | 'investment_plans'
  | 'portfolio'
  | 'performance'
  | 'pension'
  | 'pension_calculator'
  | 'live_markets'
  | 'copy_trading'
  | 'ai_bots'
  | 'signals'
  | 'deposit'
  | 'withdraw'
  | 'internal_transfer'
  | 'apply_credit'
  | 'credit_history'
  | 'profile_settings'
  | 'verification'
  | 'referral'
  | 'support'
  | 'tasks'
  | 'admin_panel';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accountNumber: string;
  language: string;
  avatar: string;
  balance: number;
  pensionBalance?: number;
  pensionAnnualYield?: number;
  totalProfit: number;
  totalDeposit: number;
  totalWithdrawal: number;
  totalBonus: number;
  signalStrength: number;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  referralCode: string;
  referralEarnings: number;
  isLocked: boolean;
  isWeb3Connected?: boolean;
  web3Address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeOrder {
  id: string;
  userId: string;
  assetSymbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  leverage: number;
  expirationTime: string;
  entryPrice: number;
  closePrice?: number;
  status: 'OPEN' | 'WIN' | 'LOSS' | 'CLOSED';
  payoutPercentage: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FundingRequest {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  proofUrl?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreditApplication {
  id: string;
  userId: string;
  requestedAmount: number;
  durationMonths: number;
  interestRate: number;
  collateralAsset: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  purpose: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'COMPLIANCE' | 'TRADING' | 'REWARD' | 'SECURITY';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  reward?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'Crypto' | 'Forex' | 'Stocks' | 'Commodities';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  ohlc: { o: number; h: number; l: number; c: number };
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  category: string;
}

export interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  return30d: number;
  followers: number;
  riskScore: number;
  isCopying?: boolean;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'ACTIVE' | 'PAUSED';
  totalReturn: number;
  winRate: number;
  runtime: string;
  pairs: string[];
}

export interface SignalItem {
  id: string;
  asset: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  timeframe: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'trade' | 'funding' | 'security' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AdminSettings {
  minTradeAmount: number;
  maxTradeAmount: number;
  winRateOverride: number;
  allowableLeverage?: number[];
  defaultLeverage?: number;
  forceOutcomeMode: 'auto' | 'force_win' | 'force_loss';
}

export interface PensionPlan {
  id: string;
  name: string;
  code: string;
  tier: 'GUARANTEED_FIXED' | 'BALANCED_GROWTH' | 'EXECUTIVE_HIGH_YIELD' | 'ROTH_HYBRID';
  apy: number;
  minInitialDeposit: number;
  minMonthlyContribution: number;
  lockupYears: number;
  riskRating: 'Very Low (Treasuries)' | 'Balanced Moderate' | 'Institutional Prime' | 'Tax-Exempt Yield';
  taxAdvantage: string;
  description: string;
  allocation: {
    bonds: number;
    equities: number;
    realEstate: number;
    treasuries: number;
  };
  features: string[];
}

export interface PensionAccount {
  id: string;
  userId: string;
  accountNumber: string;
  planId: string;
  planName: string;
  currentBalance: number;
  totalContributed: number;
  accumulatedYield: number;
  apy: number;
  monthlyAutoDebit: number;
  isAutoDebitActive: boolean;
  targetRetirementAge: number;
  currentAge: number;
  beneficiaryName: string;
  beneficiaryRelation: string;
  startDate: string;
  maturityYear: number;
  status: 'ACTIVE' | 'VESTING' | 'MATURED';
}

export interface PensionContribution {
  id: string;
  pensionAccountId: string;
  planName: string;
  amount: number;
  type: 'INITIAL_SEED' | 'MONTHLY_CONTRIBUTION' | 'YIELD_PAYOUT' | 'BONUS_MATCH';
  source: string;
  date: string;
  status: 'COMPLETED' | 'PROCESSING';
  notes?: string;
}
