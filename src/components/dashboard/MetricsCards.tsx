import React from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  ShieldCheck,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  Gauge,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface MetricsCardsProps {
  user: UserProfile;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onConnectWeb3: () => void;
  onNavigate: (tab: any) => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  user,
  onDepositClick,
  onWithdrawClick,
  onConnectWeb3,
  onNavigate,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner Row: Signal Strength Gauge + KYC Status + Web3 Integration Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Signal Strength Indicator (50% - Strong Signal) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Signal Strength Indicator</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                {user.signalStrength}%
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Strong Signal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              AI Market Sentiment: Bullish divergence detected across majors.
            </p>
          </div>

          {/* Visual Gauge Meter */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400 stroke-current"
                strokeDasharray={`${user.signalStrength}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* KYC Status Card */}
        <div
          onClick={() => onNavigate('verification')}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all shadow-lg group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>KYC Identity Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-400 tracking-tight">
                {user.kycStatus === 'VERIFIED' ? 'Account Verified' : user.kycStatus}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Tier 2 Limit: Unrestricted fiat & crypto withdrawals enabled.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Web3 Integration Card */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="space-y-1 z-10 max-w-[200px]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Web3 DeFi Integration</span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              {user.isWeb3Connected ? 'Wallet Synchronized' : 'Connect Wallet for Daily Yield'}
            </p>
            <p className="text-[10px] text-indigo-200/70">
              Earn 8.4% APY compounding yield distributed every 24h.
            </p>
          </div>

          <button
            id="connect-web3-btn"
            onClick={onConnectWeb3}
            className={`z-10 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              user.isWeb3Connected
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {user.isWeb3Connected ? 'Connected (0x8F..4B)' : 'Connect Web3'}
          </button>
        </div>
      </div>

      {/* Retirement & Pension Custody Summary Ribbon */}
      <div
        id="pension-custody-ribbon"
        onClick={() => onNavigate('pension')}
        className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 hover:border-amber-400/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer transition-all shadow-lg group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Retirement & Savings Pension Custody
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Tax-Advantaged
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active ERISA Trust • Liberty Sovereign & Balanced Annuities Compounding at <strong className="text-amber-400">10.5% APY</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Pension Value</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              ${(user.pensionBalance || 48650).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
            <span>Manage Pension</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Balances & Totals Cards (Exact values from specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Account Balance ($2,060.00) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Account Balance</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-emerald-400">
                Available for trading
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={onDepositClick}
              className="flex-1 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-bold text-center transition-colors"
            >
              Deposit
            </button>
            <button
              onClick={onWithdrawClick}
              className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold text-center transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* 2. Total Profit ($18,777.70) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Profit</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                +${user.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">
                +14.8% all-time ROI
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400">Settled from 84 closed orders</span>
          </div>
        </div>

        {/* 3. Total Deposit ($110,150.00) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Deposit</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <ArrowDownCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-tight">
                ${user.totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">
                Cumulative Inflow
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <span className="text-[10px] text-sky-400 font-medium">Bank Wire & BTC/USDT</span>
          </div>
        </div>

        {/* 4. Total Withdrawal ($1,000.00) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Withdrawal</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <ArrowUpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-tight">
                ${user.totalWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">
                Processed to bank
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400">Last: 2026-08-28 (Completed)</span>
          </div>
        </div>

        {/* 5. Total Bonus ($0.00) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Bonus</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Gift className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-tight">
                ${user.totalBonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium text-purple-400">
                Bonus Credits
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('referral')}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              Claim Affiliate Rewards →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
