import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Headphones,
  User,
  UploadCloud,
  CheckCircle2,
  Lock,
  Mail,
  Globe,
  MessageSquare,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsSupportViewProps {
  user: UserProfile;
  initialSubTab?: 'settings' | 'verification' | 'support';
  onUpdateKycStatus: (status: UserProfile['kycStatus']) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsSupportView: React.FC<SettingsSupportViewProps> = ({
  user,
  initialSubTab = 'settings',
  onUpdateKycStatus,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'settings' | 'verification' | 'support'>(initialSubTab);

  // Settings State
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency || 'USD');
  const [twoFactor, setTwoFactor] = useState(true);

  // KYC state
  const [docType, setDocType] = useState('Passport');
  const [fileUploaded, setFileUploaded] = useState(false);

  // Support ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Profile preferences updated successfully.', 'success');
  };

  const handleUploadKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateKycStatus('VERIFIED');
      setFileUploaded(true);
      onShowToast('KYC Identity Documents uploaded and approved under Level 2 Tier!', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to submit documents', 'error');
    }
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      onShowToast('Please provide a ticket subject.', 'error');
      return;
    }
    onShowToast(`Support ticket created (#${Math.floor(Math.random() * 90000 + 10000)}). Our desk will respond shortly.`, 'success');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Security, Verification & Concierge Support
          </h2>
          <p className="text-xs text-slate-400">
            Manage your account security credentials, Tier 2 KYC verification documents, and dedicated desk concierge
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setSubTab('verification')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'verification' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Verification Status (KYC)
          </button>
          <button
            onClick={() => setSubTab('support')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'support' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support Center
          </button>
        </div>
      </div>

      {/* 1. Profile Settings */}
      {subTab === 'settings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl">
          <h3 className="text-base font-bold text-white">Account Preferences</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  disabled
                  value={user.accountNumber}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-400">
                  Enforce hardware security key or TOTP authenticator code on withdrawals
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  twoFactor ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {twoFactor ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
            >
              Save Profile Preferences
            </button>
          </form>
        </div>
      )}

      {/* 2. Verification Status (KYC) */}
      {subTab === 'verification' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Identity Verification (KYC Level 2)</h3>
              <p className="text-xs text-slate-400">
                Tier 2 status unlocks unlimited crypto withdrawals, higher leverage (up to 1:100), and fiat wire transfers.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {user.kycStatus === 'VERIFIED' ? 'Verified Account' : user.kycStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Current Tier Capabilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>24-Hour Withdrawal Limit: <strong>$500,000.00 USD</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Available Leverage: <strong>Up to 1:100 Max</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fast Credit Facility: <strong>Pre-Approved</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Private Account Manager</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleUploadKyc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Passport">International Passport</option>
                  <option value="NationalID">Government National Identity Card</option>
                  <option value="DriversLicense">Driver's License</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-950/40">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Click to upload document photo or drag & drop</p>
                <p className="text-[10px] text-slate-500 mt-1">JPEG, PNG or PDF (Max 15MB)</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <FileCheck className="w-4 h-4" /> Re-Submit Identity Documents
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Support Center */}
      {subTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">24/7 Institutional Support Desk</h3>
            <p className="text-xs text-slate-400">
              Submit a support inquiry or request urgent assistance from our 24/7 financial risk desk.
            </p>

            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deposit confirmation, leverage limit increase"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide transaction hashes, order IDs, or detailed questions..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Submit Support Ticket
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-white mb-2">Dedicated Account Officer</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-sm font-bold text-amber-400">Marcus Sterling</p>
                <p className="text-xs text-slate-400">Senior Quantitative Portfolio Advisor</p>
                <p className="text-xs text-slate-300 font-mono">desk@dds-institutional.com</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Chat Available
              </p>
              <p className="text-[11px] text-slate-400">Average response latency: &lt; 45 seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
