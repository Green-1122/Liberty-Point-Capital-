import React, { useState } from 'react';
import {
  PieChart,
  Briefcase,
  LineChart,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PortfolioInvestmentsViewProps {
  user: UserProfile;
  initialSubTab?: 'plans' | 'portfolio' | 'performance';
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const PortfolioInvestmentsView: React.FC<PortfolioInvestmentsViewProps> = ({
  user,
  initialSubTab = 'plans',
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'plans' | 'portfolio' | 'performance'>(initialSubTab);

  const investmentPlans = [
    {
      id: 'plan_starter',
      name: 'Dynamic Alpha Yield',
      minDeposit: 500,
      maxDeposit: 10000,
      dailyYield: 1.2,
      durationDays: 14,
      totalRoi: '16.8%',
      risk: 'Low-Medium',
      description: 'Automated stablecoin arbitrage with capital protection guarantee.',
    },
    {
      id: 'plan_pro',
      name: 'Quant Hedging Pro',
      minDeposit: 2500,
      maxDeposit: 50000,
      dailyYield: 1.85,
      durationDays: 30,
      totalRoi: '55.5%',
      risk: 'Medium (Balanced)',
      description: 'Market-neutral algorithmic hedging across BTC, ETH, and FX majors.',
      popular: true,
    },
    {
      id: 'plan_vip',
      name: 'VIP Institutional Syndicate',
      minDeposit: 10000,
      maxDeposit: 500000,
      dailyYield: 2.4,
      durationDays: 60,
      totalRoi: '144.0%',
      risk: 'Institutional Hedge',
      description: 'Direct co-investment alongside top-tier quant trading desks.',
    },
  ];

  const holdings = [
    { asset: 'BTC (Bitcoin)', amount: '1.240 BTC', value: 110881.42, allocation: 48, pnl: '+18.4%' },
    { asset: 'USDT (Tether)', amount: '42,500.00 USDT', value: 42500.00, allocation: 28, pnl: '+0.0%' },
    { asset: 'ETH (Ethereum)', amount: '6.450 ETH', value: 21544.29, allocation: 14, pnl: '+12.6%' },
    { asset: 'Spot Gold (XAU)', amount: '4.20 oz', value: 11542.86, allocation: 10, pnl: '+7.8%' },
  ];

  const handleInvestPlan = (planName: string, minDeposit: number) => {
    if (user.balance < minDeposit) {
      onShowToast(`Insufficient balance. Minimum required for ${planName} is $${minDeposit.toLocaleString()}.`, 'error');
    } else {
      onShowToast(`Successfully allocated $${minDeposit.toLocaleString()} to ${planName}.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Portfolio & Wealth Management
          </h2>
          <p className="text-xs text-slate-400">
            High-yield automated investment vehicles, real-time custody holdings, and historical returns
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'plans' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Investment Plans
          </button>
          <button
            onClick={() => setSubTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'portfolio' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Portfolio
          </button>
          <button
            onClick={() => setSubTab('performance')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'performance' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance History
          </button>
        </div>
      </div>

      {/* Investment Plans */}
      {subTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-slate-900/90 border rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all ${
                plan.popular
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {plan.risk}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.description}</p>

                <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Daily Compounding:</span>
                    <span className="font-mono font-bold text-emerald-400">+{plan.dailyYield}% / Day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Fixed ROI:</span>
                    <span className="font-mono font-black text-amber-400 text-sm">{plan.totalRoi}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Term Duration:</span>
                    <span className="text-slate-200 font-semibold">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Min / Max Deposit:</span>
                    <span className="text-slate-200 font-mono">
                      ${plan.minDeposit.toLocaleString()} - ${plan.maxDeposit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleInvestPlan(plan.name, plan.minDeposit)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  plan.popular
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <span>Invest in {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Portfolio */}
      {subTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Asset Valuation</span>
              <p className="text-2xl font-black text-white font-mono mt-1">$186,468.57</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Unrealized P&L</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">+$24,190.20</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Daily Accrued Yield</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">+$418.50 / day</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Risk Coefficient</span>
              <p className="text-2xl font-black text-indigo-400 font-mono mt-1">A+ (Low Vol)</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Current Asset Allocations</h3>
            <div className="space-y-4">
              {holdings.map((h) => (
                <div key={h.asset} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{h.asset}</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white text-sm block">
                        ${h.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-semibold">{h.pnl}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{ width: `${h.allocation}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Balance: {h.amount}</span>
                    <span>Allocation Weight: {h.allocation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance History */}
      {subTab === 'performance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Audited Quantitative Performance</h3>
              <p className="text-xs text-slate-400">Sharpe Ratio: 2.84 • Win Rate: 88.4% • Max Drawdown: 4.1%</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Tier 1 Quantitative Fund
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">Total Return (YTD)</span>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">+148.6%</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">30-Day Trailing ROI</span>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">+24.2%</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">Profit Factor</span>
              <p className="text-xl font-bold text-amber-400 font-mono mt-1">3.42</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">Audited Trades Count</span>
              <p className="text-xl font-bold text-white font-mono mt-1">1,248 Orders</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
