import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Percent,
  Sliders,
  AlertCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { MarketAsset, TradeOrder, UserProfile } from '../../types';

interface QuickTradeProps {
  assets: MarketAsset[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  user: UserProfile;
  onExecuteTrade: (trade: Omit<TradeOrder, 'id' | 'createdAt'>) => Promise<void>;
}

export const QuickTrade: React.FC<QuickTradeProps> = ({
  assets,
  selectedSymbol,
  onSelectSymbol,
  user,
  onExecuteTrade,
}) => {
  const [amount, setAmount] = useState<number>(250);
  const [leverage, setLeverage] = useState<number>(70);
  const [expirationTime, setExpirationTime] = useState<string>('15 Minutes');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const payoutPercentage = 70; // 70% standard payout as per specification

  const potentialProfit = Number(((amount * payoutPercentage) / 100).toFixed(2));
  const totalReturn = Number((amount + potentialProfit).toFixed(2));

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (amount < 50) {
      setFeedback({ type: 'error', message: 'Minimum trade amount is $50.' });
      return;
    }
    if (amount > 500000) {
      setFeedback({ type: 'error', message: 'Maximum trade amount is $500,000.' });
      return;
    }
    if (amount > user.balance) {
      setFeedback({
        type: 'error',
        message: `Insufficient balance ($${user.balance.toFixed(2)} available). Please deposit funds.`,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);
      await onExecuteTrade({
        userId: user.id,
        assetSymbol: currentAsset.symbol,
        type,
        amount,
        leverage,
        expirationTime,
        entryPrice: currentAsset.price,
        status: 'OPEN',
        payoutPercentage,
      });

      setFeedback({
        type: 'success',
        message: `Order Placed: ${type} ${currentAsset.symbol} for $${amount.toLocaleString()} (Lev 1:${leverage})`,
      });

      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to place order. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="quick-trade-module"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Order Execution ("Quick Trade")
            </h3>
            <p className="text-[11px] text-slate-400">
              High-frequency institutional execution with automated margin settlement
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            Buying Power
          </span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Asset Selector (Forex, Crypto, Stocks, Commodities) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Asset Selector
          </label>
          <div className="relative">
            <select
              id="asset-selector"
              value={selectedSymbol}
              onChange={(e) => onSelectSymbol(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
            >
              <optgroup label="Cryptocurrency">
                <option value="BTC/USDT">BTC/USDT (Bitcoin)</option>
                <option value="ETH/USDT">ETH/USDT (Ethereum)</option>
              </optgroup>
              <optgroup label="Foreign Exchange (Forex)">
                <option value="EUR/USD">EUR/USD (Euro / US Dollar)</option>
                <option value="GBP/USD">GBP/USD (British Pound / USD)</option>
              </optgroup>
              <optgroup label="Equities & Stocks">
                <option value="AAPL">AAPL (Apple Inc.)</option>
                <option value="TSLA">TSLA (Tesla Inc.)</option>
              </optgroup>
              <optgroup label="Commodities & Yield">
                <option value="GOLD (XAU/USD)">GOLD (XAU/USD - Spot Gold)</option>
                <option value="DE10Y">DE10Y (German 10Y Bund)</option>
              </optgroup>
            </select>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Market: {currentAsset.category}</span>
            <span className="text-white font-bold">${currentAsset.price.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. Trade Amount ($50 to $500,000) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-300">
              Trade Amount ($)
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Min: $50, Max: $500k</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
            <input
              id="trade-amount-input"
              type="number"
              min={50}
              max={500000}
              step={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="mt-1.5 flex items-center gap-1 overflow-x-auto">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  amount === q
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ${q}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(Math.min(user.balance, 500000))}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 hover:bg-slate-700"
            >
              MAX
            </button>
          </div>
        </div>

        {/* 3. Leverage Dropdown (1:10 to 1:100) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Leverage Dropdown
          </label>
          <select
            id="leverage-dropdown"
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value={10}>1:10 Leverage (Conservative)</option>
            <option value={20}>1:20 Leverage (Standard)</option>
            <option value={30}>1:30 Leverage (Moderate)</option>
            <option value={50}>1:50 Leverage (High Growth)</option>
            <option value={70}>1:70 Leverage (Aggressive Pro)</option>
            <option value={100}>1:100 Leverage (Maximum)</option>
          </select>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Effective Exposure:</span>
            <span className="text-amber-400 font-mono font-bold">
              ${(amount * leverage).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4. Expiration Time Dropdown (1 Minute to 7 Days) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Expiration Time
          </label>
          <select
            id="expiration-time-dropdown"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="1 Minute">1 Minute (Turbo Scalp)</option>
            <option value="5 Minutes">5 Minutes (Short Term)</option>
            <option value="15 Minutes">15 Minutes (Recommended)</option>
            <option value="30 Minutes">30 Minutes</option>
            <option value="1 Hour">1 Hour (Intraday)</option>
            <option value="4 Hours">4 Hours</option>
            <option value="1 Day">1 Day (Daily Settlement)</option>
            <option value="7 Days">7 Days (Weekly Horizon)</option>
          </select>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Fixed Payout Rate:</span>
            <span className="text-emerald-400 font-mono font-bold">+{payoutPercentage}% WIN</span>
          </div>
        </div>
      </div>

      {/* Payout & Margin Summary Bar */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">
              Trade Margin
            </span>
            <span className="font-mono font-bold text-slate-200">
              ${amount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">
              Potential Profit ({payoutPercentage}%)
            </span>
            <span className="font-mono font-bold text-emerald-400">
              +${potentialProfit.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">
              Total Payout on Win
            </span>
            <span className="font-mono font-black text-amber-400">
              ${totalReturn.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons: BUY (Long) / SELL (Short) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="quick-trade-buy-btn"
            disabled={isSubmitting}
            onClick={() => handleTrade('BUY')}
            className="flex-1 sm:flex-none sm:w-36 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <TrendingUp className="w-4 h-4" />
            <span>BUY (Long)</span>
          </button>

          <button
            id="quick-trade-sell-btn"
            disabled={isSubmitting}
            onClick={() => handleTrade('SELL')}
            className="flex-1 sm:flex-none sm:w-36 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <TrendingDown className="w-4 h-4" />
            <span>SELL (Short)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
