import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PieChart,
  Briefcase,
  LineChart,
  Activity,
  Users,
  Bot,
  Radio,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  CreditCard,
  History,
  Settings,
  ShieldCheck,
  Gift,
  HelpCircle,
  Sliders,
  CheckSquare,
  ChevronRight,
  Landmark,
  Calculator
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab | string;
  onNavigate?: (tab: NavigationTab) => void;
  onSelectTab?: (tab: any) => void;
  isAdminMode: boolean;
  onToggleAdminMode?: () => void;
  pendingTasksCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onSelectTab,
  isAdminMode,
  onToggleAdminMode,
  pendingTasksCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const handleItemClick = (id: NavigationTab) => {
    if (onNavigate) onNavigate(id);
    if (onSelectTab) onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };
  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'statement' as NavigationTab, label: 'Account Statement', icon: FileText, badge: null },
      ],
    },
    {
      title: 'RETIREMENT & PENSION',
      items: [
        {
          id: 'pension' as NavigationTab,
          label: 'Retirement & Savings',
          icon: Landmark,
          badge: 'Tax Shield',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        },
        {
          id: 'pension_calculator' as NavigationTab,
          label: 'Pension Calculator',
          icon: Calculator,
          badge: '12.4% APY',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        },
      ],
    },
    {
      title: 'TASK MANAGEMENT',
      items: [
        {
          id: 'tasks' as NavigationTab,
          label: 'Tasks & Compliance',
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? `${pendingTasksCount} Active` : null,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        },
      ],
    },
    {
      title: 'PORTFOLIO & INVESTMENTS',
      items: [
        { id: 'investment_plans' as NavigationTab, label: 'Investment Plans', icon: PieChart, badge: 'APY 18%' },
        { id: 'portfolio' as NavigationTab, label: 'My Portfolio', icon: Briefcase, badge: null },
        { id: 'performance' as NavigationTab, label: 'Performance History', icon: LineChart, badge: null },
      ],
    },
    {
      title: 'TRADING & MARKETS',
      items: [
        { id: 'live_markets' as NavigationTab, label: 'Live Markets', icon: Activity, badge: 'Live' },
        { id: 'copy_trading' as NavigationTab, label: 'Copy Trading Pro', icon: Users, badge: 'Pro' },
        { id: 'ai_bots' as NavigationTab, label: 'AI Trading Bots', icon: Bot, badge: 'AI' },
      ],
    },
    {
      title: 'MARKET INTELLIGENCE',
      items: [
        { id: 'signals' as NavigationTab, label: 'Premium Signals', icon: Radio, badge: '94% Win' },
      ],
    },
    {
      title: 'WALLET & FUNDS',
      items: [
        { id: 'deposit' as NavigationTab, label: 'Deposit Funds', icon: ArrowDownToLine, badge: null },
        { id: 'withdraw' as NavigationTab, label: 'Withdraw Funds', icon: ArrowUpFromLine, badge: null },
        { id: 'internal_transfer' as NavigationTab, label: 'Internal Transfer', icon: ArrowLeftRight, badge: null },
      ],
    },
    {
      title: 'CREDIT & FINANCING',
      items: [
        { id: 'apply_credit' as NavigationTab, label: 'Apply for Credit Fast', icon: CreditCard, badge: 'Instant' },
        { id: 'credit_history' as NavigationTab, label: 'Credit History', icon: History, badge: null },
      ],
    },
    {
      title: 'ACCOUNT MANAGEMENT',
      items: [
        { id: 'profile_settings' as NavigationTab, label: 'Profile Settings', icon: Settings, badge: null },
        { id: 'verification' as NavigationTab, label: 'Verification Status', icon: ShieldCheck, badge: 'Verified', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ],
    },
    {
      title: 'GROWTH & REWARDS',
      items: [
        { id: 'referral' as NavigationTab, label: 'Referral Program (5%)', icon: Gift, badge: '5% Tier' },
      ],
    },
    {
      title: 'SUPPORT & HELP',
      items: [
        { id: 'support' as NavigationTab, label: 'Support Center', icon: HelpCircle, badge: '24/7' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 select-none overflow-y-auto h-[calc(100vh-4rem)] sticky top-16 z-40 transition-transform duration-200 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 top-0 h-full z-50 translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        {/* Admin Panel Direct Access Banner */}
        <div className="p-3 border-b border-slate-800">
          <button
            onClick={onToggleAdminMode}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              isAdminMode
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 ring-2 ring-purple-400/30'
                : 'bg-purple-950/20 border-purple-800/40 text-purple-300 hover:bg-purple-900/30 hover:border-purple-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <div className="text-left">
                <span className="block leading-none">Admin Control Panel</span>
                <span className="text-[10px] opacity-75 font-normal">Section 4 Backend Overrides</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="p-3 space-y-5 text-xs">
          {menuSections.map((sec) => (
            <div key={sec.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-500">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-link-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-slate-950' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1.5 ${
                            isActive
                              ? 'bg-slate-950/20 text-slate-950'
                              : item.badgeColor || 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Account Support Footnote */}
        <div className="mt-auto p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Liberty Point Capital v2.6.4</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
