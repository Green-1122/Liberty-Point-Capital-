import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TradeOrder } from '../../types';

interface TradeHistoryProps {
  trades?: TradeOrder[];
  onNavigate?: (tab: any) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades = [], onNavigate }) => {
  const [filter, setFilter] = useState<'ALL' | 'WIN' | 'OPEN'>('ALL');

  const filteredTrades = (trades || []).filter((t) => {
    if (filter === 'WIN') return t.status === 'WIN';
    if (filter === 'OPEN') return t.status === 'OPEN';
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Trade History ("Latest Trades")
            </h3>
            <p className="text-[11px] text-slate-400">
              Audit log of executed orders, leverage ratios, and real-time PnL settlements
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'WIN', 'OPEN'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filter === f
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f === 'ALL' ? 'All Orders' : f === 'WIN' ? 'Wins Only' : 'Active Open'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
              <th className="pb-3 font-semibold">Details (Asset & Timestamp)</th>
              <th className="pb-3 font-semibold">Type & Leverage</th>
              <th className="pb-3 font-semibold">Amount ($)</th>
              <th className="pb-3 font-semibold">Entry / Settlement</th>
              <th className="pb-3 font-semibold text-right">Status & Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredTrades.slice(0, 8).map((trade) => {
              const isWin = trade.status === 'WIN';
              const isOpen = trade.status === 'OPEN';
              const isBuy = trade.type === 'BUY';
              const payoutProfit = (trade.amount * (trade.payoutPercentage || 70)) / 100;

              return (
                <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Asset & Timestamp */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isBuy
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {isBuy ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">
                          {trade.assetSymbol}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {trade.createdAt}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Leverage (e.g. Buy Leverage: 1:70 or Sell Leverage: 1:30) */}
                  <td className="py-3">
                    <span className="font-semibold text-slate-200 block">
                      {trade.type === 'BUY' ? 'Buy (Long)' : 'Sell (Short)'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {trade.type === 'BUY' ? 'Buy' : 'Sell'} Leverage: 1:{trade.leverage}
                    </span>
                  </td>

                  {/* Amount ($) */}
                  <td className="py-3 font-mono">
                    <span className="font-bold text-white text-xs block">
                      ${trade.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Exp: {trade.expirationTime}
                    </span>
                  </td>

                  {/* Entry / Settlement */}
                  <td className="py-3 font-mono text-[11px]">
                    <div className="text-slate-300">
                      Entry: <span className="font-bold">{trade.entryPrice}</span>
                    </div>
                    {trade.closePrice && (
                      <div className="text-slate-400 text-[10px]">
                        Exit: <span className="font-bold">{trade.closePrice}</span>
                      </div>
                    )}
                  </td>

                  {/* Status (e.g. WIN +70%, OPEN) */}
                  <td className="py-3 text-right">
                    {isWin && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold tracking-wide">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          WIN +{trade.payoutPercentage}%
                        </span>
                        <span className="block text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
                          +${payoutProfit.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {isOpen && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          ACTIVE OPEN
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          In-Flight
                        </span>
                      </div>
                    )}

                    {trade.status === 'LOSS' && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          LOSS -100%
                        </span>
                        <span className="block text-[10px] text-rose-400 font-mono font-bold mt-0.5">
                          -${trade.amount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Displaying latest {filteredTrades.length} audited trade transactions</span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('statement')}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            View Complete Account Statement <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
