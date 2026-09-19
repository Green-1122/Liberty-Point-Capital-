import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  ArrowDownToLine,
  CreditCard,
  Sliders,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Edit3,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  Percent,
  Check,
  X,
  Landmark
} from 'lucide-react';
import {
  UserProfile,
  TradeOrder,
  FundingRequest,
  CreditApplication,
  AdminSettings,
  MarketAsset,
  PensionAccount
} from '../../types';

interface AdminDashboardProps {
  user: UserProfile;
  trades?: TradeOrder[];
  fundingRequests?: FundingRequest[];
  creditApplications?: CreditApplication[];
  marketAssets?: MarketAsset[];
  pensionAccounts?: PensionAccount[];
  adminSettings: AdminSettings;
  onUpdateUserFinances: (updates: Partial<UserProfile>) => Promise<void>;
  onToggleAccountLock: () => Promise<void>;
  onUpdateKycStatus: (status: UserProfile['kycStatus']) => Promise<void>;
  onUpdateTradeOutcome: (tradeId: string, status: TradeOrder['status'], payoutPct: number) => Promise<void>;
  onApproveFunding: (requestId: string, approved: boolean) => Promise<void>;
  onApproveCredit: (applicationId: string, approved: boolean) => Promise<void>;
  onUpdateMarketSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  onUpdatePensionAccount?: (accountId: string, updates: Partial<PensionAccount>) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  trades = [],
  fundingRequests = [],
  creditApplications = [],
  marketAssets = [],
  pensionAccounts = [],
  adminSettings,
  onUpdateUserFinances,
  onToggleAccountLock,
  onUpdateKycStatus,
  onUpdateTradeOutcome,
  onApproveFunding,
  onApproveCredit,
  onUpdateMarketSettings,
  onUpdatePensionAccount,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'user_kyc' | 'finances' | 'trade_control' | 'funding' | 'credit' | 'market_settings' | 'pension'
  >('user_kyc');

  // Override forms
  const [balanceInput, setBalanceInput] = useState(user.balance);
  const [depositInput, setDepositInput] = useState(user.totalDeposit);
  const [profitInput, setProfitInput] = useState(user.totalProfit);
  const [bonusInput, setBonusInput] = useState(user.totalBonus);

  // Market settings form
  const [minTrade, setMinTrade] = useState(adminSettings.minTradeAmount);
  const [maxTrade, setMaxTrade] = useState(adminSettings.maxTradeAmount);
  const [winRate, setWinRate] = useState(adminSettings.winRateOverride);
  const [forceMode, setForceMode] = useState(adminSettings.forceOutcomeMode);

  const handleSaveFinances = async () => {
    try {
      await onUpdateUserFinances({
        balance: Number(balanceInput),
        totalDeposit: Number(depositInput),
        totalProfit: Number(profitInput),
        totalBonus: Number(bonusInput),
      });
      onShowToast('Financial overrides saved successfully to user profile', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Error updating balances', 'error');
    }
  };

  const handleSaveMarketSettings = async () => {
    try {
      await onUpdateMarketSettings({
        minTradeAmount: Number(minTrade),
        maxTradeAmount: Number(maxTrade),
        winRateOverride: Number(winRate),
        forceOutcomeMode: forceMode,
      });
      onShowToast('Market & Asset risk settings committed', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update settings', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-800/40 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Direct Backend Admin Dashboard
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Staff Override Authority
              </span>
            </h2>
            <p className="text-xs text-purple-200/70">
              Administer Section 4 requirements: KYC review, financial overrides, trade outcome manipulation, and credit approvals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Account Target:</span>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300">
            {user.accountNumber} ({user.name.split(' ')[0]})
          </span>
        </div>
      </div>

      {/* Admin Module Tabs (The 7 capabilities) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          { id: 'user_kyc', label: '1. User & KYC', icon: Users },
          { id: 'finances', label: '2. Balance Overrides', icon: DollarSign },
          { id: 'trade_control', label: '3. Trade Outcome', icon: TrendingUp },
          { id: 'funding', label: '4. Funding Approvals', icon: ArrowDownToLine },
          { id: 'credit', label: '5. Credit & Loans', icon: CreditCard },
          { id: 'market_settings', label: '6. Asset Settings', icon: Sliders },
          { id: 'pension', label: '7. Pension Custody', icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. User & KYC Management */}
      {activeSubTab === 'user_kyc' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 1: User & KYC Management</h3>
              <p className="text-xs text-slate-400">
                Approve or reject identity verification documents, update profile details, or lock user accounts.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">User ID: {user.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">KYC Verification State</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">Current:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.kycStatus === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : user.kycStatus === 'PENDING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {user.kycStatus}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onUpdateKycStatus('VERIFIED')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve KYC (Verified)
                </button>
                <button
                  onClick={() => onUpdateKycStatus('REJECTED')}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject KYC
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Account Security & Lock Status</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    {user.isLocked ? 'Account LOCKED' : 'Account ACTIVE (Normal)'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user.isLocked
                      ? 'User is blocked from placing trades or requesting funds.'
                      : 'User has unrestricted standard trading access.'}
                  </p>
                </div>
                <button
                  onClick={onToggleAccountLock}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    user.isLocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{user.isLocked ? 'Unlock Account' : 'Lock Account'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Balance & Financial Overrides */}
      {activeSubTab === 'finances' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 2: Balance & Financial Overrides</h3>
              <p className="text-xs text-slate-400">
                Manually credit or debit user balance, total deposit, profit, or bonus balance fields.
              </p>
            </div>
            <button
              onClick={handleSaveFinances}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Check className="w-4 h-4" /> Save Financial Overrides
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Account Balance ($)
              </label>
              <input
                type="number"
                step={10}
                value={balanceInput}
                onChange={(e) => setBalanceInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Current: ${user.balance}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Total Profit ($)
              </label>
              <input
                type="number"
                step={10}
                value={profitInput}
                onChange={(e) => setProfitInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Current: ${user.totalProfit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Total Deposit ($)
              </label>
              <input
                type="number"
                step={100}
                value={depositInput}
                onChange={(e) => setDepositInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-sky-400 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Current: ${user.totalDeposit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Total Bonus Balance ($)
              </label>
              <input
                type="number"
                step={10}
                value={bonusInput}
                onChange={(e) => setBonusInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-purple-400 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Current: ${user.totalBonus}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Trade Outcome Control */}
      {activeSubTab === 'trade_control' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 3: Trade Outcome Control</h3>
              <p className="text-xs text-slate-400">
                View active trades, set win/loss rates, or manually adjust order results (e.g. force win percentage like WIN +70%).
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold font-mono">
              Global Win Target: {adminSettings.winRateOverride}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-2">
                  <th className="pb-2">Trade ID</th>
                  <th className="pb-2">Asset & Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Leverage</th>
                  <th className="pb-2">Current Status</th>
                  <th className="pb-2 text-right">Force Outcome Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-300">{trade.id}</td>
                    <td className="py-3">
                      <span className="font-bold text-white">{trade.assetSymbol}</span>
                      <span
                        className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          trade.type === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-white">${trade.amount}</td>
                    <td className="py-3 font-mono text-amber-400">1:{trade.leverage}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trade.status === 'WIN'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : trade.status === 'LOSS'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => onUpdateTradeOutcome(trade.id, 'WIN', 70)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                      >
                        Force WIN (+70%)
                      </button>
                      <button
                        onClick={() => onUpdateTradeOutcome(trade.id, 'LOSS', 0)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                      >
                        Force LOSS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Funding Approvals */}
      {activeSubTab === 'funding' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 4: Funding Approvals</h3>
              <p className="text-xs text-slate-400">
                Process incoming deposit proofs, manage withdrawal requests, and process internal transfers.
              </p>
            </div>
            <span className="text-xs text-slate-400">{fundingRequests.length} Pending Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-2">
                  <th className="pb-2">Request ID</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount ($)</th>
                  <th className="pb-2">Method / Address</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {fundingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-300">{req.id}</td>
                    <td className="py-3 font-bold text-white">{req.type}</td>
                    <td className="py-3 font-mono font-bold text-emerald-400">
                      ${req.amount.toLocaleString()} {req.currency}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {req.method || req.walletAddress || 'Bank Wire Transfer'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {req.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => onApproveFunding(req.id, true)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onApproveFunding(req.id, false)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Credit & Loan Requests */}
      {activeSubTab === 'credit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 5: Credit & Loan Requests</h3>
              <p className="text-xs text-slate-400">
                Review and approve fast credit applications submitted under the "Credit & Financing" tab.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {creditApplications.length} Applications Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-2">
                  <th className="pb-2">App ID</th>
                  <th className="pb-2">Requested Amount</th>
                  <th className="pb-2">Term & Rate</th>
                  <th className="pb-2">Collateral / Purpose</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {creditApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-300">{app.id}</td>
                    <td className="py-3 font-mono font-bold text-emerald-400 text-sm">
                      ${app.requestedAmount.toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-300">
                      {app.durationMonths} Months @ {app.interestRate}% APR
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {app.collateralAsset} ({app.purpose})
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {app.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => onApproveCredit(app.id, true)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                          >
                            Approve Loan
                          </button>
                          <button
                            onClick={() => onApproveCredit(app.id, false)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500">Decision Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Market & Asset Settings */}
      {activeSubTab === 'market_settings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Capability 6: Market & Asset Settings</h3>
              <p className="text-xs text-slate-400">
                Configure min/max trade amounts, allowable leverage options (1:10-1:100), and available asset pairs.
              </p>
            </div>
            <button
              onClick={handleSaveMarketSettings}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Check className="w-4 h-4" /> Save Asset Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Minimum Trade Amount ($)
                </label>
                <input
                  type="number"
                  value={minTrade}
                  onChange={(e) => setMinTrade(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Maximum Trade Amount ($)
                </label>
                <input
                  type="number"
                  value={maxTrade}
                  onChange={(e) => setMaxTrade(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Global Win Rate Override (%)
                </label>
                <input
                  type="number"
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Automated Settlement Mode
                </label>
                <select
                  value={forceMode}
                  onChange={(e) => setForceMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="auto">Auto (Market Fair-Play 50/50)</option>
                  <option value="force_win">Force WIN (+70% Guarantee)</option>
                  <option value="force_loss">Force LOSS (-100% Margin)</option>
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-300 mb-2">
                Supported Asset Pairs ({marketAssets.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {marketAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <span className="font-bold text-white">{asset.symbol}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Enabled (1:100)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Pension & Retirement Custody Administration */}
      {activeSubTab === 'pension' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                Capability 7: Pension & Retirement Custody Oversight
              </h3>
              <p className="text-xs text-slate-400">
                Oversee Liberty Point Capital ERISA trust accounts, adjust APY rates, disburse institutional dividends, or override vesting status.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pensionAccounts.length} Registered Accounts
            </span>
          </div>

          {pensionAccounts.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400">
              <p className="text-sm">No active retirement or savings accounts currently enrolled for this user.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pensionAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {account.accountNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {account.planName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        {account.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>Balance: <strong className="text-white">${account.currentBalance.toLocaleString()}</strong></span>
                      <span>Contributed: <strong className="text-slate-300">${account.totalContributed.toLocaleString()}</strong></span>
                      <span>APY: <strong className="text-amber-400">{account.apy}%</strong></span>
                      <span>Target Age: <strong className="text-slate-300">{account.targetRetirementAge}</strong></span>
                      <span>Beneficiary: <strong className="text-slate-300">{account.beneficiaryName} ({account.beneficiaryRelation})</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        const bonusYield = Math.round(account.currentBalance * 0.02);
                        if (onUpdatePensionAccount) {
                          await onUpdatePensionAccount(account.id, {
                            currentBalance: account.currentBalance + bonusYield,
                            accumulatedYield: (account.accumulatedYield || 0) + bonusYield,
                          });
                        }
                        onShowToast(`Disbursed +$${bonusYield.toLocaleString()} institutional dividend to ${account.accountNumber}`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                    >
                      + Disburse 2% Yield
                    </button>
                    <button
                      onClick={async () => {
                        const newStatus = account.status === 'ACTIVE' ? 'MATURED' : 'ACTIVE';
                        if (onUpdatePensionAccount) {
                          await onUpdatePensionAccount(account.id, { status: newStatus as any });
                        }
                        onShowToast(`Account ${account.accountNumber} status toggled to ${newStatus}`, 'info');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
