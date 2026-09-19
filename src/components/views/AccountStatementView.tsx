import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, TradeOrder, FundingRequest } from '../../types';

interface AccountStatementViewProps {
  user: UserProfile;
  trades?: TradeOrder[];
  fundingRequests?: FundingRequest[];
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AccountStatementView: React.FC<AccountStatementViewProps> = ({
  user,
  trades = [],
  fundingRequests = [],
  onShowToast,
}) => {
  const [statementFilter, setStatementFilter] = useState<'ALL' | 'TRADES' | 'DEPOSITS' | 'WITHDRAWALS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = (format: 'CSV' | 'PDF') => {
    onShowToast(`Exporting official Liberty Point Capital Statement (${format})...`, 'info');
    setTimeout(() => {
      onShowToast(`Account Statement ${user.accountNumber} successfully downloaded.`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Official Account Statement</h2>
              <p className="text-xs text-slate-400">
                Ledger audit record for account: <strong className="text-amber-400 font-mono">{user.accountNumber}</strong> ({user.name})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Current Ledger Balance</span>
          <p className="text-xl font-black text-white font-mono mt-1">
            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Cumulative Deposits</span>
          <p className="text-xl font-black text-sky-400 font-mono mt-1">
            ${user.totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Cumulative Realized Profit</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">
            +${user.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Total Outflow (Withdrawals)</span>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">
            ${user.totalWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {(['ALL', 'TRADES', 'DEPOSITS', 'WITHDRAWALS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatementFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statementFilter === tab
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Statement Period: <strong className="text-slate-200">All-Time (Year to Date)</strong>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-2">
                <th className="pb-3">Reference / ID</th>
                <th className="pb-3">Type & Description</th>
                <th className="pb-3">Gross Amount</th>
                <th className="pb-3">Net Impact</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trades.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-300 font-bold">{tr.id}</td>
                  <td className="py-3">
                    <span className="font-bold text-white block">
                      Trade Order: {tr.type} {tr.assetSymbol}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Lev 1:{tr.leverage} • {tr.createdAt}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-200">${tr.amount.toFixed(2)}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    {tr.status === 'WIN' ? `+$${((tr.amount * tr.payoutPercentage) / 100).toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      SETTLED ({tr.status})
                    </span>
                  </td>
                </tr>
              ))}

              {fundingRequests.map((fr) => (
                <tr key={fr.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-300 font-bold">{fr.id}</td>
                  <td className="py-3">
                    <span className="font-bold text-white block">{fr.type}</span>
                    <span className="text-[10px] text-slate-400">{fr.method || 'Crypto / Wire'}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-200">${fr.amount.toFixed(2)}</td>
                  <td className="py-3 font-mono font-bold text-sky-400">
                    {fr.type === 'DEPOSIT' ? `+$${fr.amount.toFixed(2)}` : `-$${fr.amount.toFixed(2)}`}
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px]">
                      {fr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
