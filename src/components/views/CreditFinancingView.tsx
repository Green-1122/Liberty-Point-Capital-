import React, { useState } from 'react';
import {
  CreditCard,
  Percent,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { UserProfile, CreditApplication } from '../../types';

interface CreditFinancingViewProps {
  user: UserProfile;
  creditApplications?: CreditApplication[];
  onApplyCredit: (app: Omit<CreditApplication, 'id' | 'createdAt'>) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const CreditFinancingView: React.FC<CreditFinancingViewProps> = ({
  user,
  creditApplications = [],
  onApplyCredit,
  onShowToast,
}) => {
  const [amount, setAmount] = useState<number>(10000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [collateralAsset, setCollateralAsset] = useState<string>('Portfolio Holdings Margin');
  const [purpose, setPurpose] = useState<string>('Leveraged Trading Liquidity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestRate = 3.5; // 3.5% APR institutional promotional rate
  const monthlyInterest = (amount * (interestRate / 100)) / 12;
  const principalPerMonth = amount / durationMonths;
  const monthlyPayment = Number((principalPerMonth + monthlyInterest).toFixed(2));
  const totalRepayment = Number((monthlyPayment * durationMonths).toFixed(2));

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1000 || amount > 100000) {
      onShowToast('Loan amounts must range between $1,000 and $100,000.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onApplyCredit({
        userId: user.id,
        requestedAmount: amount,
        durationMonths,
        interestRate,
        collateralAsset,
        purpose,
        status: 'PENDING',
      });
      onShowToast(
        `Credit application for $${amount.toLocaleString()} submitted for instant underwriting review!`,
        'success'
      );
    } catch (err: any) {
      onShowToast(err?.message || 'Application failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Credit & Institutional Financing
          </h2>
          <p className="text-xs text-slate-400">
            Instant liquidity facility: Borrow against your trading portfolio with 0 credit checks and fixed 3.5% APR
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Pre-Approved Limit: $50,000
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Apply for Fast Credit</h3>
            <p className="text-xs text-slate-400">
              Funds are credited to your active trading balance immediately upon automated risk approval.
            </p>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Requested Credit Amount ($)
                </label>
                <input
                  type="number"
                  min={1000}
                  max={100000}
                  step={500}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Range: $1,000 – $100,000</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Repayment Term</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (Recommended)</option>
                  <option value={18}>18 Months</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Collateral Basis</label>
                <select
                  value={collateralAsset}
                  onChange={(e) => setCollateralAsset(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Portfolio Holdings Margin">Portfolio Holdings Margin (LTV 70%)</option>
                  <option value="Bitcoin Custody Collateral">Bitcoin Custody Collateral (LTV 80%)</option>
                  <option value="Corporate / Wire Guarantee">Corporate / Wire Guarantee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Loan Purpose</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50"
            >
              Submit Application for Instant Underwriting
            </button>
          </form>
        </div>

        {/* Calculation & Terms Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-base font-bold text-white mb-1">Loan Calculation Summary</h4>
            <p className="text-xs text-slate-400 mb-4">
              Fixed interest rate guaranteed for the entire term duration.
            </p>

            <div className="space-y-3.5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Fixed APR Rate:</span>
                <span className="font-mono font-bold text-emerald-400">{interestRate}% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Requested:</span>
                <span className="font-mono font-bold text-white">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Installment:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  ${monthlyPayment.toLocaleString()} / mo
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Total Repayment:</span>
                <span className="font-mono font-black text-white text-base">
                  ${totalRepayment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-[11px] text-indigo-300">
            <p className="leading-snug">
              Repayments are deducted automatically from your account balance or can be settled anytime with 0 early repayment penalty fees.
            </p>
          </div>
        </div>
      </div>

      {/* Credit History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Credit Facility History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-2">
                <th className="pb-3">Application ID</th>
                <th className="pb-3">Requested Amount</th>
                <th className="pb-3">Term & Rate</th>
                <th className="pb-3">Collateral Basis</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {creditApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-slate-300">{app.id}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    ${app.requestedAmount.toLocaleString()} USD
                  </td>
                  <td className="py-3 text-slate-300">
                    {app.durationMonths} Mo @ {app.interestRate}% APR
                  </td>
                  <td className="py-3 text-slate-400">{app.collateralAsset}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{app.createdAt}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {app.status}
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
