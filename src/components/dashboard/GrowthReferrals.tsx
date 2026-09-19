import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  ExternalLink,
  Award
} from 'lucide-react';
import { UserProfile } from '../../types';

interface GrowthReferralsProps {
  user: UserProfile;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onClaimCommission: () => void;
}

export const GrowthReferrals: React.FC<GrowthReferralsProps> = ({
  user,
  onShowToast,
  onClaimCommission,
}) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://platform.dds.io/ref/${user.referralCode || 'real12'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onShowToast('Personal referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Growth & Affiliate Program (5% Tier)
            </h3>
            <p className="text-[11px] text-slate-400">
              Invite active traders and earn lifetime 5% commission on every trade spread and deposit
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
          <Award className="w-3.5 h-3.5" /> 5% Commission Active
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Referral Link Input Field & Copy Button */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Personal Referral Link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="personal-referral-link-input"
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-200 select-all focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              id="copy-referral-link-btn"
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Your unique affiliate code is <strong className="text-white font-mono">{user.referralCode || 'real12'}</strong>. Share across Telegram, Twitter, or Discord communities.
          </p>
        </div>

        {/* Commission Counter & Stats */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Commission Counter</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Settled Instantly</span>
          </div>
          <div className="my-2">
            <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              ${(user.referralEarnings || 425.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400">
              Generated from 14 registered active referrals
            </span>
          </div>
          <button
            onClick={onClaimCommission}
            className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors text-center"
          >
            Transfer to Main Balance
          </button>
        </div>
      </div>
    </div>
  );
};
