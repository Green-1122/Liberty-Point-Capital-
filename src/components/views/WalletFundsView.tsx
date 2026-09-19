import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  QrCode,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserProfile, FundingRequest } from '../../types';

interface WalletFundsViewProps {
  user: UserProfile;
  initialSubTab?: 'deposit' | 'withdraw' | 'transfer';
  onRequestFunding: (request: Omit<FundingRequest, 'id' | 'createdAt'>) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const WalletFundsView: React.FC<WalletFundsViewProps> = ({
  user,
  initialSubTab = 'deposit',
  onRequestFunding,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'deposit' | 'withdraw' | 'transfer'>(initialSubTab);

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState<'BTC' | 'USDT_TRC20' | 'USDT_ERC20' | 'BANK_WIRE'>('USDT_TRC20');
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [txHash, setTxHash] = useState<string>('');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Withdraw Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'BTC' | 'USDT' | 'BANK'>('USDT');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200);

  // Transfer Form State
  const [transferAmount, setTransferAmount] = useState<number>(100);
  const [transferDirection, setTransferDirection] = useState<'SPOT_TO_YIELD' | 'YIELD_TO_SPOT'>('SPOT_TO_YIELD');

  const cryptoAddresses: Record<string, string> = {
    BTC: 'bc1q9d7a2f5k4m8e3g1h7j0x8l6n4p2r5t9w3v7z1',
    USDT_TRC20: 'TYD4xQ9vPz7K8m2N1b5vC3xR6yE8wA0pL9',
    USDT_ERC20: '0x8fB32C19c52cD8B124B5eD08b4F34A6A4E2F198b',
    BANK_WIRE: 'Liberty Point Capital Clearing, IBAN: GB29LPCB60161331926819',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(true);
    onShowToast('Address copied to clipboard!', 'success');
    setTimeout(() => setCopiedAddr(false), 2500);
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount < 50) {
      onShowToast('Minimum deposit is $50.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onRequestFunding({
        userId: user.id,
        type: 'DEPOSIT',
        amount: depositAmount,
        currency: 'USD',
        status: 'PENDING',
        method: depositMethod,
        walletAddress: cryptoAddresses[depositMethod],
        notes: txHash ? `TxHash: ${txHash}` : 'Manual confirmation pending proof',
      });
      onShowToast(`Deposit request for $${depositAmount.toLocaleString()} submitted for blockchain confirmation!`, 'success');
      setTxHash('');
    } catch (err: any) {
      onShowToast(err?.message || 'Deposit failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 50) {
      onShowToast('Minimum withdrawal is $50.', 'error');
      return;
    }
    if (withdrawAmount > user.balance) {
      onShowToast(`Insufficient balance ($${user.balance.toFixed(2)} available).`, 'error');
      return;
    }
    if (!withdrawAddress.trim()) {
      onShowToast('Please enter your destination wallet or IBAN address.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onRequestFunding({
        userId: user.id,
        type: 'WITHDRAWAL',
        amount: withdrawAmount,
        currency: 'USD',
        status: 'PENDING',
        method: withdrawMethod,
        walletAddress: withdrawAddress.trim(),
        notes: 'Awaiting admin automated batch settlement',
      });
      onShowToast(`Withdrawal request for $${withdrawAmount.toLocaleString()} submitted successfully!`, 'success');
      setWithdrawAddress('');
    } catch (err: any) {
      onShowToast(err?.message || 'Withdrawal failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount > user.balance) {
      onShowToast('Insufficient trading balance to transfer.', 'error');
      return;
    }
    onShowToast(`Transferred $${transferAmount.toLocaleString()} internally between Spot & Yield balances.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            Wallet Custody & Capital Treasury
          </h2>
          <p className="text-xs text-slate-400">
            Secure multi-chain cryptocurrency deposits, lightning withdrawals, and internal sub-account transfers
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('deposit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'deposit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deposit Funds
          </button>
          <button
            onClick={() => setSubTab('withdraw')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'withdraw' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Withdraw Funds
          </button>
          <button
            onClick={() => setSubTab('transfer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'transfer' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Internal Transfer
          </button>
        </div>
      </div>

      {/* Available Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Spot Trading Balance</span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Deposited Inflow</span>
          <p className="text-2xl font-black text-sky-400 font-mono mt-1">
            ${user.totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Settled Withdrawals</span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">
            ${user.totalWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 1. Deposit Funds */}
      {subTab === 'deposit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Add Capital to Account</h3>
            <p className="text-xs text-slate-400">
              Select your payment method below. Crypto deposits are credited automatically after 2 network confirmations.
            </p>
          </div>

          <form onSubmit={handleSubmitDeposit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Deposit Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'USDT_TRC20', label: 'USDT (TRC-20)', sub: 'Fast & Zero Fee' },
                  { id: 'USDT_ERC20', label: 'USDT (ERC-20)', sub: 'Ethereum Network' },
                  { id: 'BTC', label: 'Bitcoin (BTC)', sub: 'Native SegWit' },
                  { id: 'BANK_WIRE', label: 'Bank Wire', sub: 'USD/EUR Swift' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDepositMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      depositMethod === m.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{m.label}</span>
                    <span className="text-[10px] text-slate-400">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Official Treasury Custody Address ({depositMethod})
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={cryptoAddresses[depositMethod]}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(cryptoAddresses[depositMethod])}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedAddr ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Send only specified assets to this address. Credits apply automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Deposit Amount ($ USD Equivalent)
                </label>
                <input
                  type="number"
                  min={50}
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Blockchain Transaction Hash / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 0x4a92... or bank payment reference"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Confirm Deposit Request & Transmit Proof
            </button>
          </form>
        </div>
      )}

      {/* 2. Withdraw Funds */}
      {subTab === 'withdraw' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Withdraw Capital</h3>
            <p className="text-xs text-slate-400">
              Submit a withdrawal request directly to your crypto wallet or personal bank account.
            </p>
          </div>

          <form onSubmit={handleSubmitWithdraw} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="USDT">Tether USDT (TRC-20 / ERC-20)</option>
                  <option value="BTC">Bitcoin (BTC Address)</option>
                  <option value="BANK">Bank Wire (SWIFT / SEPA / ACH)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Amount ($)</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Available: ${user.balance.toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  min={50}
                  max={user.balance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Destination Address / Bank Account Details
              </label>
              <textarea
                rows={2}
                required
                placeholder="Enter your USDT TRC20 address or Bank IBAN / Routing info..."
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Network Processing Fee:</span>
                <span className="text-white font-mono">$0.00 (Tier 2 Zero Fee)</span>
              </div>
              <div className="flex justify-between">
                <span>Net Transfer Amount:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  ${withdrawAmount.toLocaleString()} USD
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Submit Secure Withdrawal Request
            </button>
          </form>
        </div>
      )}

      {/* 3. Internal Transfer */}
      {subTab === 'transfer' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Instant Internal Balance Transfer</h3>
            <p className="text-xs text-slate-400">
              Move funds friction-free between your Active Spot Margin and High-Yield Savings ledger.
            </p>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Transfer Route</label>
              <select
                value={transferDirection}
                onChange={(e) => setTransferDirection(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SPOT_TO_YIELD">Spot Trading Balance → Yield Vault Account</option>
                <option value="YIELD_TO_SPOT">Yield Vault Account → Spot Trading Balance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                min={10}
                required
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Execute Instant Internal Transfer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
