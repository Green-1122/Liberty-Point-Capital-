import React, { useState } from 'react';
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Calculator,
  PlusCircle,
  ArrowUpRight,
  RefreshCw,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  Download,
  Users,
  Award,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  UserProfile,
  PensionPlan,
  PensionAccount,
  PensionContribution
} from '../../types';

interface RetirementPensionViewProps {
  user: UserProfile;
  pensionPlans: PensionPlan[];
  pensionAccounts: PensionAccount[];
  pensionContributions: PensionContribution[];
  initialSubTab?: 'overview' | 'plans' | 'calculator' | 'compliance';
  onContribute: (accountId: string, amount: number, source: string) => Promise<void>;
  onEnrollPlan: (data: {
    planId: string;
    initialDeposit: number;
    monthlyAutoDebit: number;
    targetAge: number;
    beneficiaryName: string;
    beneficiaryRelation: string;
  }) => Promise<void>;
  onToggleAutoDebit: (accountId: string, active: boolean) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const RetirementPensionView: React.FC<RetirementPensionViewProps> = ({
  user,
  pensionPlans,
  pensionAccounts,
  pensionContributions,
  initialSubTab = 'overview',
  onContribute,
  onEnrollPlan,
  onToggleAutoDebit,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'calculator' | 'compliance'>(initialSubTab);

  // Contribution Modal State
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    pensionAccounts[0]?.id || ''
  );
  const [contributeAmount, setContributeAmount] = useState<number>(500);
  const [fundingSource, setFundingSource] = useState<'CASH_BALANCE' | 'WIRE' | 'CRYPTO'>('CASH_BALANCE');
  const [isSubmittingContribute, setIsSubmittingContribute] = useState(false);

  // Enrollment Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollPlanId, setEnrollPlanId] = useState<string>(pensionPlans[0]?.id || '');
  const [enrollInitialDeposit, setEnrollInitialDeposit] = useState<number>(1000);
  const [enrollMonthlyDebit, setEnrollMonthlyDebit] = useState<number>(350);
  const [enrollTargetAge, setEnrollTargetAge] = useState<number>(65);
  const [enrollBeneficiary, setEnrollBeneficiary] = useState<string>('Sophia Lowe');
  const [enrollBeneficiaryRelation, setEnrollBeneficiaryRelation] = useState<string>('Spouse');
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Calculator State
  const [calcCurrentAge, setCalcCurrentAge] = useState<number>(34);
  const [calcRetirementAge, setCalcRetirementAge] = useState<number>(62);
  const [calcInitialCapital, setCalcInitialCapital] = useState<number>(48650);
  const [calcMonthlySavings, setCalcMonthlySavings] = useState<number>(750);
  const [calcExpectedApy, setCalcExpectedApy] = useState<number>(11.5);

  // Aggregate Metrics
  const totalPensionBalance = pensionAccounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const totalContributions = pensionAccounts.reduce((acc, a) => acc + a.totalContributed, 0);
  const totalAccruedYield = pensionAccounts.reduce((acc, a) => acc + a.accumulatedYield, 0);
  const weightedApy = totalPensionBalance > 0
    ? pensionAccounts.reduce((acc, a) => acc + (a.apy * a.currentBalance), 0) / totalPensionBalance
    : 10.5;

  // Retirement Calculator Computation
  const yearsToRetire = Math.max(1, calcRetirementAge - calcCurrentAge);
  const monthsToRetire = yearsToRetire * 12;
  const monthlyRate = (calcExpectedApy / 100) / 12;

  // Compound future value: FV = P*(1+r)^n + PMT * [((1+r)^n - 1) / r]
  const compoundFactor = Math.pow(1 + monthlyRate, monthsToRetire);
  const futureCapitalFromSeed = calcInitialCapital * compoundFactor;
  const futureCapitalFromMonthly = monthlyRate > 0
    ? calcMonthlySavings * ((compoundFactor - 1) / monthlyRate)
    : calcMonthlySavings * monthsToRetire;
  const projectedNestEgg = Math.round(futureCapitalFromSeed + futureCapitalFromMonthly);
  const totalPrincipalDeposited = calcInitialCapital + (calcMonthlySavings * monthsToRetire);
  const totalCompoundEarnings = Math.max(0, projectedNestEgg - totalPrincipalDeposited);
  
  // Safe 25-year monthly annuity in retirement (assuming continued 5% conservative yield)
  const safeMonthlyRetirementPayout = Math.round((projectedNestEgg * 0.05) / 12);

  // Handlers
  const handleOpenContribute = (accountId?: string) => {
    if (accountId) setSelectedAccountId(accountId);
    else if (pensionAccounts.length > 0) setSelectedAccountId(pensionAccounts[0].id);
    setIsContributeModalOpen(true);
  };

  const handleExecuteContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contributeAmount <= 0) {
      onShowToast('Please enter a valid contribution amount.', 'error');
      return;
    }
    if (fundingSource === 'CASH_BALANCE' && user.balance < contributeAmount) {
      onShowToast(`Insufficient cash balance ($${user.balance.toLocaleString()}). Please deposit or choose another method.`, 'error');
      return;
    }

    setIsSubmittingContribute(true);
    try {
      await onContribute(
        selectedAccountId,
        contributeAmount,
        fundingSource === 'CASH_BALANCE' ? 'Account Cash Balance' : 'Direct Clearing Wire'
      );
      onShowToast(`Successfully contributed $${contributeAmount.toLocaleString()} to Pension Account.`, 'success');
      setIsContributeModalOpen(false);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to submit contribution.', 'error');
    } finally {
      setIsSubmittingContribute(false);
    }
  };

  const handleOpenEnroll = (planId?: string) => {
    if (planId) {
      setEnrollPlanId(planId);
      const plan = pensionPlans.find((p) => p.id === planId);
      if (plan) {
        setEnrollInitialDeposit(plan.minInitialDeposit);
        setEnrollMonthlyDebit(plan.minMonthlyContribution);
      }
    }
    setIsEnrollModalOpen(true);
  };

  const handleExecuteEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    const plan = pensionPlans.find((p) => p.id === enrollPlanId);
    if (!plan) return;

    if (enrollInitialDeposit < plan.minInitialDeposit) {
      onShowToast(`Minimum initial seed for ${plan.name} is $${plan.minInitialDeposit.toLocaleString()}.`, 'error');
      return;
    }

    if (user.balance < enrollInitialDeposit) {
      onShowToast(`Insufficient cash balance ($${user.balance.toLocaleString()}) for initial seed.`, 'error');
      return;
    }

    setIsSubmittingEnroll(true);
    try {
      await onEnrollPlan({
        planId: enrollPlanId,
        initialDeposit: enrollInitialDeposit,
        monthlyAutoDebit: enrollMonthlyDebit,
        targetAge: enrollTargetAge,
        beneficiaryName: enrollBeneficiary,
        beneficiaryRelation: enrollBeneficiaryRelation,
      });
      onShowToast(`Enrolled in ${plan.name}! Initial seed of $${enrollInitialDeposit.toLocaleString()} allocated.`, 'success');
      setIsEnrollModalOpen(false);
      setActiveTab('overview');
    } catch (err: any) {
      onShowToast(err?.message || 'Enrollment failed.', 'error');
    } finally {
      setIsSubmittingEnroll(false);
    }
  };

  const handleExportPensionStatement = (format: 'PDF' | 'CSV') => {
    onShowToast(`Generating official Liberty Point Capital Pension Ledger (${format})...`, 'info');
    setTimeout(() => {
      onShowToast(`Pension Tax & Custody Statement successfully exported.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Liberty Point Capital • Retirement & Savings Pension Division</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Retirement & Savings Pension
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Institutional tax-advantaged retirement wealth building, guaranteed sovereign yield annuities, and compound savings custody managed under fiduciary ERISA & Trust standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-open-contribute-pension"
              onClick={() => handleOpenContribute()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Make Contribution</span>
            </button>
            <button
              id="btn-open-enroll-pension"
              onClick={() => handleOpenEnroll()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Enroll In New Plan</span>
            </button>
            <button
              id="btn-export-pension-statement"
              onClick={() => handleExportPensionStatement('PDF')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all"
              title="Download Official Pension Statement"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total Pension Value
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              ${totalPensionBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{weightedApy.toFixed(1)}% Avg. Annual Yield
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Accrued Compound Yield
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              +${totalAccruedYield.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Direct dividend reinvestment active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total Contributed Capital
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-200">
              ${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Principal protected under custody
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Projected At Age 62
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              ${projectedNestEgg.toLocaleString()}
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium mt-1 block">
              ~${safeMonthlyRetirementPayout.toLocaleString()}/mo annuity
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'My Pension Portfolio & Ledger', icon: PiggyBank },
          { id: 'plans', label: 'Institutional Pension Plans', icon: Landmark },
          { id: 'calculator', label: 'Retirement Growth Simulator', icon: Calculator },
          { id: 'compliance', label: 'Tax Shield & Fiduciary Protections', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-pension-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY PENSION PORTFOLIO & LEDGER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Pension Accounts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-amber-400" />
                <span>Active Pension & Savings Accounts ({pensionAccounts.length})</span>
              </h2>
              <button
                onClick={() => handleOpenEnroll()}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>+ Open Another Pension Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pensionAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {account.accountNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {account.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mt-1.5">{account.planName}</h3>
                      <p className="text-xs text-slate-400">
                        Beneficiary: <strong className="text-slate-200">{account.beneficiaryName}</strong> ({account.beneficiaryRelation})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">Annual APY</span>
                      <span className="text-lg font-black text-amber-400">{account.apy}%</span>
                    </div>
                  </div>

                  {/* Financial Balances Breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Balance</span>
                      <span className="text-sm font-bold text-white">
                        ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Contributed</span>
                      <span className="text-sm font-medium text-slate-300">
                        ${account.totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Yield Earned</span>
                      <span className="text-sm font-bold text-emerald-400">
                        +${account.accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Auto-Debit & Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleAutoDebit(account.id, !account.isAutoDebitActive)}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 border transition-all ${
                          account.isAutoDebitActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Toggle monthly auto-debit"
                      >
                        <RefreshCw className={`w-3 h-3 ${account.isAutoDebitActive ? 'text-emerald-400 animate-spin-slow' : ''}`} />
                        <span>
                          {account.isAutoDebitActive
                            ? `Auto-Debit: $${account.monthlyAutoDebit}/mo`
                            : 'Auto-Debit Paused'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenContribute(account.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold border border-amber-500/30 transition-all flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Funds</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributions & Yield Distribution Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pension Contribution & Yield History</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified auditing record of deposits, monthly allocations, and compound dividend settlements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportPensionStatement('CSV')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Plan / Account</th>
                    <th className="py-3 px-3">Source Method</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {pensionContributions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-400">{tx.date}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            tx.type === 'YIELD_PAYOUT'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-white">{tx.planName}</td>
                      <td className="py-3 px-3 text-slate-400">{tx.source}</td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-white">
                        +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTITUTIONAL PENSION PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Available Retirement & Pension Plans</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Choose from capital-guaranteed sovereign yield programs, balanced corporate growth portfolios, and high-yield executive trusts crafted by Liberty Point Capital actuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pensionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-800 text-amber-400 rounded border border-slate-700">
                          {plan.code}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
                          {plan.taxAdvantage}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
                      <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">Target APY</span>
                      <span className="text-2xl font-black text-amber-400">{plan.apy}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Asset Allocation Bars */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Portfolio Asset Allocation</span>
                      <span>Risk: <strong className="text-amber-300">{plan.riskRating}</strong></span>
                    </div>
                    
                    <div className="h-2 rounded-full overflow-hidden flex bg-slate-800">
                      {plan.allocation.treasuries > 0 && (
                        <div
                          style={{ width: `${plan.allocation.treasuries}%` }}
                          className="bg-amber-400 h-full"
                          title={`Treasuries: ${plan.allocation.treasuries}%`}
                        />
                      )}
                      {plan.allocation.bonds > 0 && (
                        <div
                          style={{ width: `${plan.allocation.bonds}%` }}
                          className="bg-blue-400 h-full"
                          title={`Bonds: ${plan.allocation.bonds}%`}
                        />
                      )}
                      {plan.allocation.equities > 0 && (
                        <div
                          style={{ width: `${plan.allocation.equities}%` }}
                          className="bg-emerald-400 h-full"
                          title={`Equities: ${plan.allocation.equities}%`}
                        />
                      )}
                      {plan.allocation.realEstate > 0 && (
                        <div
                          style={{ width: `${plan.allocation.realEstate}%` }}
                          className="bg-purple-400 h-full"
                          title={`Real Estate: ${plan.allocation.realEstate}%`}
                        />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                      {plan.allocation.treasuries > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" /> Treasuries ({plan.allocation.treasuries}%)
                        </span>
                      )}
                      {plan.allocation.bonds > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400" /> Sovereign Bonds ({plan.allocation.bonds}%)
                        </span>
                      )}
                      {plan.allocation.equities > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Equities ({plan.allocation.equities}%)
                        </span>
                      )}
                      {plan.allocation.realEstate > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400" /> Real Estate ({plan.allocation.realEstate}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements & Features */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Min. Initial Seed</span>
                      <span className="font-bold text-white">${plan.minInitialDeposit.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Min. Monthly</span>
                      <span className="font-bold text-white">${plan.minMonthlyContribution.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenEnroll(plan.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10"
                  >
                    <span>Enroll In {plan.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RETIREMENT GROWTH SIMULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Actuarial Retirement & Compound Pension Simulator</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Model your future nest egg, monthly pension disbursement, and compound growth trajectory based on institutional yield rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls Column */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Pension Parameters</span>
              </h3>

              {/* Ages Slider */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Current Age</span>
                    <span className="font-mono text-amber-400 font-bold">{calcCurrentAge} years old</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={calcCurrentAge}
                    onChange={(e) => setCalcCurrentAge(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Target Retirement Age</span>
                    <span className="font-mono text-amber-400 font-bold">{calcRetirementAge} years old</span>
                  </div>
                  <input
                    type="range"
                    min={calcCurrentAge + 2}
                    max="75"
                    value={calcRetirementAge}
                    onChange={(e) => setCalcRetirementAge(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Compounding timeline: <strong className="text-slate-200">{yearsToRetire} years</strong> ({monthsToRetire} monthly contributions)
                  </div>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Initial Starting Seed Capital</span>
                    <span className="font-mono text-white font-bold">${calcInitialCapital.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      value={calcInitialCapital}
                      onChange={(e) => setCalcInitialCapital(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Monthly Savings Contribution</span>
                    <span className="font-mono text-white font-bold">${calcMonthlySavings.toLocaleString()}/mo</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      value={calcMonthlySavings}
                      onChange={(e) => setCalcMonthlySavings(Math.max(50, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold">Expected Annual Compound APY (%)</span>
                    <span className="font-mono text-emerald-400 font-bold">{calcExpectedApy}%</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.2"
                    value={calcExpectedApy}
                    onChange={(e) => setCalcExpectedApy(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>6% (Conservative)</span>
                    <span>11.5% (Liberty Avg)</span>
                    <span>18% (Aggressive Pro)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Projection Visuals Column */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Actuarial Projection Results
                </span>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center space-y-2">
                  <span className="text-xs text-slate-400 font-semibold block">Total Estimated Nest Egg at Age {calcRetirementAge}</span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ${projectedNestEgg.toLocaleString()}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold mt-2">
                    <span>Estimated Monthly Annuity: ~${safeMonthlyRetirementPayout.toLocaleString()} / mo</span>
                  </div>
                </div>

                {/* Capital Composition Bar */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Capital Growth Breakdown</span>
                    <span className="text-emerald-400 font-bold">
                      {((totalCompoundEarnings / (projectedNestEgg || 1)) * 100).toFixed(1)}% Compounded Yield
                    </span>
                  </div>

                  <div className="h-4 rounded-xl overflow-hidden flex bg-slate-800">
                    <div
                      style={{ width: `${Math.min(100, (totalPrincipalDeposited / (projectedNestEgg || 1)) * 100)}%` }}
                      className="bg-blue-500 h-full"
                      title="Principal Contributed"
                    />
                    <div
                      style={{ width: `${Math.min(100, (totalCompoundEarnings / (projectedNestEgg || 1)) * 100)}%` }}
                      className="bg-amber-400 h-full"
                      title="Compound Yield Earned"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-slate-400 text-[11px]">Your Personal Deposits</span>
                      </div>
                      <span className="font-bold text-white text-sm">
                        ${totalPrincipalDeposited.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-slate-400 text-[11px]">Compound Interest Earned</span>
                      </div>
                      <span className="font-bold text-amber-400 text-sm">
                        +${totalCompoundEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestones Preview */}
                <div className="mt-6 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Projected Portfolio Milestones</span>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40">
                      <span>In 5 Years (Age {calcCurrentAge + 5}):</span>
                      <strong className="text-white font-mono">
                        ${Math.round(calcInitialCapital * Math.pow(1 + monthlyRate, 60) + calcMonthlySavings * ((Math.pow(1 + monthlyRate, 60) - 1) / monthlyRate)).toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40">
                      <span>In 15 Years (Age {calcCurrentAge + 15}):</span>
                      <strong className="text-white font-mono">
                        ${Math.round(calcInitialCapital * Math.pow(1 + monthlyRate, 180) + calcMonthlySavings * ((Math.pow(1 + monthlyRate, 180) - 1) / monthlyRate)).toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40">
                      <span>At Retirement (Age {calcRetirementAge}):</span>
                      <strong className="text-amber-400 font-mono font-bold">
                        ${projectedNestEgg.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenEnroll()}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>Lock In This Compounding Strategy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TAX SHIELD & FIDUCIARY PROTECTIONS */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Liberty Point Capital Institutional Custody Standards</span>
              </div>
              <h2 className="text-xl font-bold text-white">Tax Advantages & Fiduciary Safeguards</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Retirement assets held with Liberty Point Capital benefit from institutional bankruptcy-remote custodial trusts, qualified ERISA tax deferral status, and primary asset protection shielding your wealth from external volatility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Asset Segregation & Custody</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All pension capital is segregated in bankruptcy-remote statutory trust facilities, never comingled with broker operations or proprietary trading desks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Tax-Advantaged Growth</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compounding dividends and interest yields accrue completely tax-deferred or tax-free (Roth Hybrid accounts), maximizing exponential velocity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Direct Beneficiary Transfer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Designate primary and contingent beneficiaries for probate-free instant estate transfer under private statutory inheritance instructions.
                </p>
              </div>
            </div>

            {/* Hardship and Early Access Rules */}
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Hardship & Emergency Early Access Provisions</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                While pension accounts are designed for multi-year compounding to ensure retirement security, Liberty Point Capital offers verified clients liquidity protections including:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-amber-400 block mb-1">1. Pension-Backed Margin Facility</strong>
                  Borrow up to 70% of your pension account value at 3.5% interest without triggering tax events or liquidating your positions.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-amber-400 block mb-1">2. Statutory Hardship Release</strong>
                  Penalty-free emergency withdrawal provisions for qualifying medical, primary residential purchase, or certified economic hardship.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: MAKE CONTRIBUTION */}
      {isContributeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Make Pension Contribution</h3>
              </div>
              <button
                onClick={() => setIsContributeModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteContribution} className="space-y-4">
              {/* Select Pension Account */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Pension Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  {pensionAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.planName} ({acc.accountNumber}) - ${acc.currentBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Contribution Amount</span>
                  <span className="text-slate-400">
                    Available Balance: <strong className="text-amber-400">${user.balance.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                {/* Preset Chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[250, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setContributeAmount(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Source */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment / Allocation Source
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFundingSource('CASH_BALANCE')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      fundingSource === 'CASH_BALANCE'
                        ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block text-[11px] text-amber-400">Instant Transfer</span>
                    Account Cash Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => setFundingSource('WIRE')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      fundingSource === 'WIRE'
                        ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block text-[11px] text-blue-400">Institutional Wire</span>
                    Bank Clearing Wire
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingContribute}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmittingContribute ? 'Processing...' : 'Confirm Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ENROLL IN NEW PLAN */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Enroll In Pension Plan</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteEnroll} className="space-y-4">
              {/* Select Plan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selected Pension Program
                </label>
                <select
                  value={enrollPlanId}
                  onChange={(e) => {
                    setEnrollPlanId(e.target.value);
                    const p = pensionPlans.find((plan) => plan.id === e.target.value);
                    if (p) {
                      setEnrollInitialDeposit(p.minInitialDeposit);
                      setEnrollMonthlyDebit(p.minMonthlyContribution);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  {pensionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({plan.apy}% APY) - Min ${plan.minInitialDeposit.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Deposit & Monthly Auto-Debit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Initial Seed Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={enrollInitialDeposit}
                    onChange={(e) => setEnrollInitialDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Cash balance: ${user.balance.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={enrollMonthlyDebit}
                    onChange={(e) => setEnrollMonthlyDebit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Can be paused anytime
                  </span>
                </div>
              </div>

              {/* Target Retirement Age */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Target Retirement Age</span>
                  <span className="font-mono text-amber-400 font-bold">{enrollTargetAge} years</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="75"
                  value={enrollTargetAge}
                  onChange={(e) => setEnrollTargetAge(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Beneficiary Designation */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Beneficiary Full Name
                  </label>
                  <input
                    type="text"
                    value={enrollBeneficiary}
                    onChange={(e) => setEnrollBeneficiary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={enrollBeneficiaryRelation}
                    onChange={(e) => setEnrollBeneficiaryRelation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEnroll}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmittingEnroll ? 'Activating Account...' : 'Open Pension Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
