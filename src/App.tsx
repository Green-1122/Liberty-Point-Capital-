import React, { useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_MARKET_ASSETS,
  INITIAL_TRADES,
  INITIAL_TASKS,
  MARKET_NEWS,
  INITIAL_PENSION_PLANS,
  INITIAL_PENSION_ACCOUNTS,
  INITIAL_PENSION_CONTRIBUTIONS,
} from './data/mockData';
import {
  UserProfile,
  TradeOrder,
  TaskItem,
  FundingRequest,
  CreditApplication,
  AdminSettings,
  MarketAsset,
  ToastMessage,
  NotificationItem,
  PensionPlan,
  PensionAccount,
  PensionContribution,
} from './types';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';

import { MetricsCards } from './components/dashboard/MetricsCards';
import { TradingChart } from './components/dashboard/TradingChart';
import { QuickTrade } from './components/dashboard/QuickTrade';
import { TradeHistory } from './components/dashboard/TradeHistory';
import { GrowthReferrals } from './components/dashboard/GrowthReferrals';

import { TaskManager } from './components/tasks/TaskManager';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { AccountStatementView } from './components/views/AccountStatementView';
import { PortfolioInvestmentsView } from './components/views/PortfolioInvestmentsView';
import { TradingMarketsView } from './components/views/TradingMarketsView';
import { WalletFundsView } from './components/views/WalletFundsView';
import { CreditFinancingView } from './components/views/CreditFinancingView';
import { SettingsSupportView } from './components/views/SettingsSupportView';
import { RetirementPensionView } from './components/views/RetirementPensionView';

export default function App() {
  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core Data State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>(INITIAL_MARKET_ASSETS);
  const [activeSymbol, setActiveSymbol] = useState<string>('BTC/USDT');
  const [trades, setTrades] = useState<TradeOrder[]>(INITIAL_TRADES);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([
    {
      id: 'fr_101',
      userId: INITIAL_USER.id,
      type: 'DEPOSIT',
      amount: 5000,
      currency: 'USD',
      status: 'APPROVED',
      method: 'USDT_TRC20',
      walletAddress: 'TYD4xQ9vPz7K8m2N1b5vC3xR6yE8wA0pL9',
      createdAt: '2026-09-08 14:30',
    },
    {
      id: 'fr_102',
      userId: INITIAL_USER.id,
      type: 'WITHDRAWAL',
      amount: 1000,
      currency: 'USD',
      status: 'APPROVED',
      method: 'BANK',
      walletAddress: 'IBAN GB29LPCB60161331926819',
      createdAt: '2026-08-28 09:15',
    },
  ]);
  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>([
    {
      id: 'cred_4091',
      userId: INITIAL_USER.id,
      requestedAmount: 25000,
      durationMonths: 12,
      interestRate: 3.5,
      collateralAsset: 'Portfolio Holdings Margin',
      purpose: 'Algorithmic Scalping Capital',
      status: 'APPROVED',
      createdAt: '2026-08-15',
    },
  ]);

  // Retirement and Savings Pension State
  const [pensionPlans, setPensionPlans] = useState<PensionPlan[]>(INITIAL_PENSION_PLANS);
  const [pensionAccounts, setPensionAccounts] = useState<PensionAccount[]>(INITIAL_PENSION_ACCOUNTS);
  const [pensionContributions, setPensionContributions] = useState<PensionContribution[]>(INITIAL_PENSION_CONTRIBUTIONS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      userId: INITIAL_USER.id,
      title: 'Tier 2 Verification Approved',
      message: 'Your KYC identity verification Level 2 was validated by institutional risk compliance.',
      isRead: false,
      type: 'SECURITY',
      createdAt: '10m ago',
    },
    {
      id: 'notif_2',
      userId: INITIAL_USER.id,
      title: 'Order Executed: BUY BTC/USDT',
      message: 'Position closed with WIN +70.0% payout (+$175.00). Ledger updated.',
      isRead: false,
      type: 'TRADE',
      createdAt: '1h ago',
    },
    {
      id: 'notif_3',
      userId: INITIAL_USER.id,
      title: 'Deposit Received: $5,000 USDT',
      message: 'Instant blockchain deposit confirmed on TRC20 network.',
      isRead: true,
      type: 'FINANCE',
      createdAt: '1d ago',
    },
  ]);

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    minTradeAmount: 50,
    maxTradeAmount: 500000,
    allowableLeverage: [10, 20, 30, 50, 70, 100],
    winRateOverride: 70,
    forceOutcomeMode: 'auto',
  });

  // Toast Notification Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize Firestore on Initial Boot
  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;
    let unsubscribeTrades: (() => void) | undefined;
    let unsubscribeTasks: (() => void) | undefined;

    const initFirebaseData = async () => {
      try {
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Initialize user in Firestore
          await setDoc(userRef, INITIAL_USER);
        } else {
          setUser(userSnap.data() as UserProfile);
        }

        // Realtime user profile listener
        unsubscribeUser = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setUser(snapshot.data() as UserProfile);
            }
          },
          (err) => {
            console.warn('User snapshot listener offline mode:', err.message);
          }
        );

        // Realtime trades listener
        const tradesRef = collection(db, 'trades');
        const tradesQuery = query(tradesRef, limit(20));
        unsubscribeTrades = onSnapshot(
          tradesQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loaded: TradeOrder[] = [];
              snapshot.forEach((docSnap) => {
                loaded.push(docSnap.data() as TradeOrder);
              });
              setTrades(loaded);
            }
          },
          (err) => {
            console.warn('Trades snapshot offline mode:', err.message);
          }
        );

        // Realtime tasks listener
        const tasksRef = collection(db, 'tasks');
        unsubscribeTasks = onSnapshot(
          tasksRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedTasks: TaskItem[] = [];
              snapshot.forEach((docSnap) => {
                loadedTasks.push(docSnap.data() as TaskItem);
              });
              setTasks(loadedTasks);
            }
          },
          (err) => {
            console.warn('Tasks snapshot offline mode:', err.message);
          }
        );
      } catch (err: any) {
        console.warn('Firestore initialization operating with local fallback state:', err?.message);
      }
    };

    initFirebaseData();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeTrades) unsubscribeTrades();
      if (unsubscribeTasks) unsubscribeTasks();
    };
  }, []);

  // Save changes to Firestore User Doc
  const updateUserProfileState = async (updates: Partial<UserProfile>) => {
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updated);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);
    } catch (err: any) {
      console.warn('Updated locally; Firestore sync pending connection:', err?.message);
    }
  };

  // Trade Execution Handler (Section 3.C)
  const handleExecuteTrade = async (newTradeData: Omit<TradeOrder, 'id' | 'createdAt'>) => {
    if (user.isLocked) {
      throw new Error('Account is restricted. Please consult the compliance desk.');
    }
    if (newTradeData.amount > user.balance) {
      throw new Error('Insufficient trading balance.');
    }

    const tradeId = `tr_${Math.floor(Math.random() * 90000 + 10000)}`;
    const newTrade: TradeOrder = {
      ...newTradeData,
      id: tradeId,
      createdAt: 'Just now',
    };

    // Deduct margin from user balance
    const updatedBalance = Number((user.balance - newTrade.amount).toFixed(2));
    await updateUserProfileState({ balance: updatedBalance });

    // Update trade in local state and Firestore
    setTrades((prev) => [newTrade, ...prev]);

    try {
      await setDoc(doc(db, 'trades', tradeId), newTrade);
    } catch (err: any) {
      console.warn('Trade saved locally:', err.message);
    }

    showToast(
      `Order Executed: ${newTrade.type} ${newTrade.assetSymbol} for $${newTrade.amount} (Lev 1:${newTrade.leverage})`,
      'success'
    );

    // Dynamic settlement simulation based on admin settings
    setTimeout(async () => {
      let isWin = false;
      if (adminSettings.forceOutcomeMode === 'force_win') {
        isWin = true;
      } else if (adminSettings.forceOutcomeMode === 'force_loss') {
        isWin = false;
      } else {
        isWin = Math.random() * 100 <= adminSettings.winRateOverride;
      }

      const payout = (newTrade.amount * newTrade.payoutPercentage) / 100;
      const resolvedStatus = isWin ? 'WIN' : 'LOSS';
      const resolvedClosePrice = isWin
        ? newTrade.type === 'BUY'
          ? newTrade.entryPrice * 1.008
          : newTrade.entryPrice * 0.992
        : newTrade.type === 'BUY'
        ? newTrade.entryPrice * 0.992
        : newTrade.entryPrice * 1.008;

      setTrades((prev) =>
        prev.map((t) =>
          t.id === tradeId
            ? {
                ...t,
                status: resolvedStatus,
                closePrice: Number(resolvedClosePrice.toFixed(2)),
              }
            : t
        )
      );

      if (isWin) {
        const returnedCapital = newTrade.amount + payout;
        const newBal = Number((user.balance + returnedCapital).toFixed(2));
        const newProfit = Number((user.totalProfit + payout).toFixed(2));
        await updateUserProfileState({
          balance: newBal,
          totalProfit: newProfit,
        });

        showToast(
          `Order ${tradeId} Closed: WIN +${newTrade.payoutPercentage}% (+$${payout.toFixed(2)})!`,
          'success'
        );
      } else {
        showToast(`Order ${tradeId} Closed: LOSS (-$${newTrade.amount.toFixed(2)})`, 'error');
      }

      try {
        await updateDoc(doc(db, 'trades', tradeId), {
          status: resolvedStatus,
          closePrice: Number(resolvedClosePrice.toFixed(2)),
        });
      } catch (err: any) {
        console.warn('Settlement saved locally');
      }
    }, 12000);
  };

  // Task Management Handlers
  const handleAddTask = async (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const taskId = `tsk_${Math.floor(Math.random() * 90000 + 10000)}`;
    const newTask: TaskItem = {
      ...taskData,
      id: taskId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);

    try {
      await setDoc(doc(db, 'tasks', taskId), newTask);
    } catch (err: any) {
      console.warn('Task saved locally');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskItem['status']) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));

    if (status === 'COMPLETED' && task && task.reward) {
      const newBal = Number((user.balance + task.reward).toFixed(2));
      const newBonus = Number((user.totalBonus + task.reward).toFixed(2));
      await updateUserProfileState({ balance: newBal, totalBonus: newBonus });
      showToast(`Task completed! +$${task.reward} credited to your balance.`, 'success');
    }

    try {
      await updateDoc(doc(db, 'tasks', taskId), { status });
    } catch (err: any) {
      console.warn('Task status updated locally');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed from agenda', 'info');
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err: any) {
      console.warn('Task deleted locally');
    }
  };

  // Funding Requests
  const handleRequestFunding = async (requestData: Omit<FundingRequest, 'id' | 'createdAt'>) => {
    const reqId = `fr_${Math.floor(Math.random() * 90000 + 10000)}`;
    const newReq: FundingRequest = {
      ...requestData,
      id: reqId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setFundingRequests((prev) => [newReq, ...prev]);

    try {
      await setDoc(doc(db, 'funding_requests', reqId), newReq);
    } catch (err: any) {
      console.warn('Funding request saved locally');
    }
  };

  // Credit Applications
  const handleApplyCredit = async (appData: Omit<CreditApplication, 'id' | 'createdAt'>) => {
    const appId = `cred_${Math.floor(Math.random() * 90000 + 10000)}`;
    const newApp: CreditApplication = {
      ...appData,
      id: appId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCreditApplications((prev) => [newApp, ...prev]);

    try {
      await setDoc(doc(db, 'credit_applications', appId), newApp);
    } catch (err: any) {
      console.warn('Credit application saved locally');
    }
  };

  // Admin Actions (Section 4 Requirements)
  const handleAdminUpdateUserFinances = async (updates: Partial<UserProfile>) => {
    await updateUserProfileState(updates);
  };

  const handleAdminToggleAccountLock = async () => {
    const newLocked = !user.isLocked;
    await updateUserProfileState({ isLocked: newLocked });
    showToast(`Account lock status updated: ${newLocked ? 'LOCKED' : 'UNLOCKED'}`, 'info');
  };

  const handleAdminUpdateKyc = async (status: UserProfile['kycStatus']) => {
    await updateUserProfileState({ kycStatus: status });
    showToast(`User KYC status set to: ${status}`, 'success');
  };

  const handleAdminUpdateTradeOutcome = async (
    tradeId: string,
    status: TradeOrder['status'],
    payoutPct: number
  ) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === tradeId ? { ...t, status, payoutPercentage: payoutPct } : t
      )
    );

    const targetTrade = trades.find((t) => t.id === tradeId);
    if (status === 'WIN' && targetTrade) {
      const payout = (targetTrade.amount * payoutPct) / 100;
      const newBal = Number((user.balance + targetTrade.amount + payout).toFixed(2));
      const newProfit = Number((user.totalProfit + payout).toFixed(2));
      await updateUserProfileState({ balance: newBal, totalProfit: newProfit });
    }

    showToast(`Trade ${tradeId} outcome overridden to: ${status}`, 'success');
    try {
      await updateDoc(doc(db, 'trades', tradeId), { status, payoutPercentage: payoutPct });
    } catch (err: any) {
      console.warn('Outcome overridden locally');
    }
  };

  const handleAdminApproveFunding = async (requestId: string, approved: boolean) => {
    const req = fundingRequests.find((r) => r.id === requestId);
    const newStatus = approved ? 'APPROVED' : 'REJECTED';

    setFundingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );

    if (approved && req) {
      if (req.type === 'DEPOSIT') {
        const newBal = Number((user.balance + req.amount).toFixed(2));
        const newDep = Number((user.totalDeposit + req.amount).toFixed(2));
        await updateUserProfileState({ balance: newBal, totalDeposit: newDep });
        showToast(`Approved deposit of $${req.amount.toLocaleString()} credited!`, 'success');
      } else if (req.type === 'WITHDRAWAL') {
        const newBal = Number((user.balance - req.amount).toFixed(2));
        const newWith = Number((user.totalWithdrawal + req.amount).toFixed(2));
        await updateUserProfileState({ balance: newBal, totalWithdrawal: newWith });
        showToast(`Approved withdrawal of $${req.amount.toLocaleString()} processed!`, 'success');
      }
    } else {
      showToast(`Funding request ${requestId} marked as ${newStatus}`, 'info');
    }

    try {
      await updateDoc(doc(db, 'funding_requests', requestId), { status: newStatus });
    } catch (err: any) {
      console.warn('Funding approval saved locally');
    }
  };

  const handleAdminApproveCredit = async (applicationId: string, approved: boolean) => {
    const app = creditApplications.find((a) => a.id === applicationId);
    const newStatus = approved ? 'APPROVED' : 'REJECTED';

    setCreditApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
    );

    if (approved && app) {
      const newBal = Number((user.balance + app.requestedAmount).toFixed(2));
      await updateUserProfileState({ balance: newBal });
      showToast(
        `Fast Credit of $${app.requestedAmount.toLocaleString()} APPROVED and credited to user balance!`,
        'success'
      );
    } else {
      showToast(`Credit application ${applicationId} declined.`, 'info');
    }

    try {
      await updateDoc(doc(db, 'credit_applications', applicationId), { status: newStatus });
    } catch (err: any) {
      console.warn('Credit application updated locally');
    }
  };

  const handleAdminUpdateMarketSettings = async (settings: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...settings }));
    showToast('Market & Asset configuration updated', 'success');
  };

  // Referral Claim Action
  const handleClaimReferralCommission = async () => {
    if (!user.referralEarnings || user.referralEarnings <= 0) {
      showToast('No accrued affiliate commission to claim yet.', 'info');
      return;
    }
    const earnings = user.referralEarnings;
    const newBal = Number((user.balance + earnings).toFixed(2));
    await updateUserProfileState({ balance: newBal, referralEarnings: 0 });
    showToast(`+$${earnings.toFixed(2)} affiliate commission transferred to main balance!`, 'success');
  };

  // Connect Web3 Action
  const handleToggleWeb3 = async () => {
    const newState = !user.isWeb3Connected;
    await updateUserProfileState({ isWeb3Connected: newState });
    showToast(
      newState
        ? 'Web3 DeFi Wallet synchronized! Daily yield active.'
        : 'Web3 Wallet disconnected.',
      'info'
    );
  };

  // Retirement & Pension Handlers
  const handleContributePension = async (accountId: string, amount: number, source: string) => {
    const isFromBalance = source.includes('Balance') || source.includes('Internal');
    if (isFromBalance && user.balance < amount) {
      throw new Error(`Insufficient available account balance ($${user.balance.toLocaleString()}).`);
    }

    const targetAccount = pensionAccounts.find((a) => a.id === accountId);
    if (!targetAccount) throw new Error('Target pension plan account was not found.');

    const newBalance = targetAccount.currentBalance + amount;
    const newTotalContributed = targetAccount.totalContributed + amount;

    setPensionAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, currentBalance: newBalance, totalContributed: newTotalContributed }
          : acc
      )
    );

    const newTx: PensionContribution = {
      id: `pcont_${Date.now()}`,
      pensionAccountId: accountId,
      planName: targetAccount.planName,
      amount,
      type: 'MONTHLY_CONTRIBUTION',
      source,
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
      notes: 'Direct client deposit credited to ERISA trust custody',
    };
    setPensionContributions((prev) => [newTx, ...prev]);

    const updatedTotalPension = (user.pensionBalance || 0) + amount;
    if (isFromBalance) {
      const updatedUserBalance = Math.max(0, user.balance - amount);
      await updateUserProfileState({
        balance: updatedUserBalance,
        pensionBalance: updatedTotalPension,
      });
    } else {
      await updateUserProfileState({
        pensionBalance: updatedTotalPension,
      });
    }
  };

  const handleEnrollPensionPlan = async (data: {
    planId: string;
    initialDeposit: number;
    monthlyAutoDebit: number;
    targetAge: number;
    beneficiaryName: string;
    beneficiaryRelation: string;
  }) => {
    const plan = pensionPlans.find((p) => p.id === data.planId);
    if (!plan) throw new Error('Selected retirement plan was not found.');

    if (user.balance < data.initialDeposit) {
      throw new Error(`Insufficient cash balance ($${user.balance.toLocaleString()}) for initial seed.`);
    }

    const newAccountId = `pen_acc_${Date.now()}`;
    const newAccountNum = `LPC-PEN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAccount: PensionAccount = {
      id: newAccountId,
      userId: user.id,
      accountNumber: newAccountNum,
      planId: plan.id,
      planName: plan.name,
      currentBalance: data.initialDeposit,
      totalContributed: data.initialDeposit,
      accumulatedYield: 0,
      apy: plan.apy,
      monthlyAutoDebit: data.monthlyAutoDebit,
      isAutoDebitActive: true,
      targetRetirementAge: data.targetAge,
      currentAge: 34,
      beneficiaryName: data.beneficiaryName,
      beneficiaryRelation: data.beneficiaryRelation,
      startDate: new Date().toISOString().split('T')[0],
      maturityYear: 2026 + (data.targetAge - 34),
      status: 'ACTIVE',
    };

    setPensionAccounts((prev) => [newAccount, ...prev]);

    const initialTx: PensionContribution = {
      id: `pcont_${Date.now()}`,
      pensionAccountId: newAccountId,
      planName: plan.name,
      amount: data.initialDeposit,
      type: 'INITIAL_SEED',
      source: 'Account Cash Balance',
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
      notes: 'Initial pension trust enrollment principal',
    };
    setPensionContributions((prev) => [initialTx, ...prev]);

    const updatedUserBalance = Math.max(0, user.balance - data.initialDeposit);
    const updatedPensionBalance = (user.pensionBalance || 0) + data.initialDeposit;
    await updateUserProfileState({
      balance: updatedUserBalance,
      pensionBalance: updatedPensionBalance,
    });
  };

  const handleTogglePensionAutoDebit = async (accountId: string, active: boolean) => {
    setPensionAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, isAutoDebitActive: active } : acc))
    );
    showToast(`Auto-debit status updated for pension account.`, 'info');
  };

  const handleAdminUpdatePensionAccount = async (accountId: string, updates: Partial<PensionAccount>) => {
    setPensionAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, ...updates } : acc))
    );
    const totalPension = pensionAccounts.reduce(
      (sum, acc) => (acc.id === accountId ? sum + (updates.currentBalance ?? acc.currentBalance) : sum + acc.currentBalance),
      0
    );
    await updateUserProfileState({ pensionBalance: totalPension });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Application Header with Live Dynamic Ticker */}
      <Header
        user={user}
        marketAssets={marketAssets}
        notifications={notifications}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => {
          const next = !isAdminMode;
          setIsAdminMode(next);
          if (next) {
            setCurrentTab('admin');
            showToast('Entered Backend Admin Dashboard Mode', 'info');
          } else {
            setCurrentTab('dashboard');
          }
        }}
        onOpenQuickTrade={() => {
          if (currentTab !== 'dashboard') {
            setCurrentTab('dashboard');
          }
          setTimeout(() => {
            document.getElementById('quick-trade-module')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigate={(tab) => setCurrentTab(tab)}
        onDepositClick={() => setCurrentTab('deposit')}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Body: Sidebar + Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Multi-Tier Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isAdminMode={isAdminMode}
          onToggleAdminMode={() => {
            setIsAdminMode(!isAdminMode);
            if (!isAdminMode) setCurrentTab('admin');
            else setCurrentTab('dashboard');
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          pendingTasksCount={tasks.filter((t) => t.status !== 'DONE').length}
        />

        {/* Main View Port Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Account Lock Warning Banner if Locked */}
            {user.isLocked && (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 flex items-center justify-between shadow-xl">
                <div>
                  <h4 className="font-bold text-sm">Account Status: Suspended / Locked by Compliance</h4>
                  <p className="text-xs text-rose-300/80">
                    Trade execution and withdrawal requests are temporarily frozen. Please contact your private desk officer.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('support')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
                >
                  Contact Desk
                </button>
              </div>
            )}

            {/* ROUTED VIEWS */}

            {/* View 1: Main Dashboard (Default Tab) */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* A. Account Overview & Metrics Cards */}
                <MetricsCards
                  user={user}
                  onDepositClick={() => setCurrentTab('deposit')}
                  onWithdrawClick={() => setCurrentTab('withdraw')}
                  onConnectWeb3={handleToggleWeb3}
                  onNavigate={(tab) => setCurrentTab(tab)}
                />

                {/* B. Market Analytics & Embedded Candlestick Chart */}
                <TradingChart
                  assets={marketAssets}
                  activeSymbol={activeSymbol}
                  onSelectAsset={(symbol) => setActiveSymbol(symbol)}
                  marketNews={MARKET_NEWS}
                  onOpenQuickTrade={() => {
                    const el = document.getElementById('quick-trade-module');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* C. Order Execution ("Quick Trade") */}
                <QuickTrade
                  assets={marketAssets}
                  selectedSymbol={activeSymbol}
                  onSelectSymbol={(sym) => setActiveSymbol(sym)}
                  user={user}
                  onExecuteTrade={handleExecuteTrade}
                />

                {/* D. Trade History ("Latest Trades") */}
                <TradeHistory trades={trades} onNavigate={(tab) => setCurrentTab(tab)} />

                {/* E. Growth & Referrals */}
                <GrowthReferrals
                  user={user}
                  onShowToast={showToast}
                  onClaimCommission={handleClaimReferralCommission}
                />
              </div>
            )}

            {/* View 2: Task & Compliance Management Dashboard */}
            {currentTab === 'tasks' && (
              <div className="animate-in fade-in duration-300">
                <TaskManager
                  tasks={tasks}
                  user={user}
                  onAddTask={handleAddTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onDeleteTask={handleDeleteTask}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 3: Official Account Statement */}
            {currentTab === 'statement' && (
              <div className="animate-in fade-in duration-300">
                <AccountStatementView
                  user={user}
                  trades={trades}
                  fundingRequests={fundingRequests}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 4: Portfolio & Investments */}
            {['plans', 'investment_plans', 'portfolio', 'performance'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                <PortfolioInvestmentsView
                  user={user}
                  initialSubTab={currentTab as any}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View: Retirement & Savings Pension Custody */}
            {['pension', 'pension_calculator', 'retirement'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                <RetirementPensionView
                  user={user}
                  pensionPlans={pensionPlans}
                  pensionAccounts={pensionAccounts}
                  pensionContributions={pensionContributions}
                  initialSubTab={currentTab === 'pension_calculator' ? 'calculator' : 'overview'}
                  onContribute={handleContributePension}
                  onEnrollPlan={handleEnrollPensionPlan}
                  onToggleAutoDebit={handleTogglePensionAutoDebit}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 5: Trading & Global Markets */}
            {['live_markets', 'copy_trading', 'ai_bots', 'signals'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                <TradingMarketsView
                  assets={marketAssets}
                  initialSubTab={currentTab as any}
                  onSelectAssetForTrade={(symbol) => {
                    setActiveSymbol(symbol);
                    setCurrentTab('dashboard');
                    setTimeout(() => {
                      document.getElementById('quick-trade-module')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 6: Wallet & Custody Funds */}
            {['deposit', 'withdraw', 'transfer'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                <WalletFundsView
                  user={user}
                  initialSubTab={currentTab as any}
                  onRequestFunding={handleRequestFunding}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 7: Credit & Institutional Financing */}
            {['apply_credit', 'credit_history'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                <CreditFinancingView
                  user={user}
                  creditApplications={creditApplications}
                  onApplyCredit={handleApplyCredit}
                  onShowToast={showToast}
                />
              </div>
            )}

            {/* View 8: Settings, Verification KYC & Support Desk */}
            {['profile', 'verification', 'referral', 'support'].includes(currentTab) && (
              <div className="animate-in fade-in duration-300">
                {currentTab === 'referral' ? (
                  <GrowthReferrals
                    user={user}
                    onShowToast={showToast}
                    onClaimCommission={handleClaimReferralCommission}
                  />
                ) : (
                  <SettingsSupportView
                    user={user}
                    initialSubTab={
                      currentTab === 'verification'
                        ? 'verification'
                        : currentTab === 'support'
                        ? 'support'
                        : 'settings'
                    }
                    onUpdateKycStatus={handleAdminUpdateKyc}
                    onShowToast={showToast}
                  />
                )}
              </div>
            )}

            {/* View 9: Direct Backend Admin Dashboard (All 6 Capabilities) */}
            {currentTab === 'admin' && (
              <div className="animate-in fade-in duration-300">
                <AdminDashboard
                  user={user}
                  trades={trades}
                  fundingRequests={fundingRequests}
                  creditApplications={creditApplications}
                  marketAssets={marketAssets}
                  adminSettings={adminSettings}
                  pensionAccounts={pensionAccounts}
                  onUpdateUserFinances={handleAdminUpdateUserFinances}
                  onToggleAccountLock={handleAdminToggleAccountLock}
                  onUpdateKycStatus={handleAdminUpdateKyc}
                  onUpdateTradeOutcome={handleAdminUpdateTradeOutcome}
                  onApproveFunding={handleAdminApproveFunding}
                  onApproveCredit={handleAdminApproveCredit}
                  onUpdateMarketSettings={handleAdminUpdateMarketSettings}
                  onUpdatePensionAccount={handleAdminUpdatePensionAccount}
                  onShowToast={showToast}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
