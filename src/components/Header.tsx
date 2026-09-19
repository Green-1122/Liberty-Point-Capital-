import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Globe,
  Zap,
  ShieldCheck,
  LogOut,
  User,
  Sliders,
  CheckCheck,
  Wallet,
  Menu
} from 'lucide-react';
import { UserProfile, MarketAsset, NotificationItem } from '../types';

interface HeaderProps {
  user: UserProfile;
  marketAssets?: MarketAsset[];
  notifications?: NotificationItem[];
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenQuickTrade?: () => void;
  onNavigate?: (tab: any) => void;
  onDepositClick?: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  marketAssets = [],
  notifications = [],
  isAdminMode,
  onToggleAdminMode,
  onOpenQuickTrade = () => {},
  onNavigate = (_tab: any) => {},
  onDepositClick = () => {},
  onMarkNotificationRead = (_id: string) => {},
  onMarkAllNotificationsRead = () => {},
  onToggleMobileSidebar,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(user.language || 'EN');

  const languages = [
    { code: 'EN', label: 'English (US)' },
    { code: 'ES', label: 'Español' },
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'ZH', label: '中文 (简体)' },
  ];

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Account Summary */}
        <div className="flex items-center gap-3 lg:gap-6">
          {onToggleMobileSidebar && (
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform text-xs tracking-tighter">
              LPC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  LIBERTY POINT CAPITAL
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                  INSTITUTIONAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Trading, Wealth & Pension Custody</p>
            </div>
          </div>

          {/* Direct Admin Panel Switcher */}
          <button
            id="admin-mode-toggle"
            onClick={onToggleAdminMode}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isAdminMode
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAdminMode ? 'Admin Mode: ACTIVE' : 'Switch to Admin Panel'}</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Account Balance Metric */}
          <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              Account Balance
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-emerald-400 text-base">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <button
                id="header-quick-deposit-btn"
                onClick={onDepositClick}
                className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 px-1.5 py-0.5 rounded transition-colors"
                title="Deposit Funds"
              >
                + Deposit
              </button>
            </div>
          </div>

          {/* Quick Trade Button / Dropdown Trigger */}
          <button
            id="header-quick-trade-btn"
            onClick={onOpenQuickTrade}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Quick Trade</span>
          </button>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
                setLangOpen(false);
              }}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm ring-2 ring-slate-900">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {(notifications || []).length} Total
                    </span>
                  </div>
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                </div>

                <div className="mt-2 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {(notifications || []).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                        n.isRead
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-75'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-xs text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => {
                setLangOpen(!langOpen);
                setProfileOpen(false);
                setNotifOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 text-xs font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      selectedLang === lang.code
                        ? 'bg-amber-500/10 text-amber-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] opacity-60">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Menu: Madisyn Lowe Liberty Point Capital Account */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
                setLangOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400/40"
              />
              <div className="hidden xl:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 tracking-tight max-w-[160px] truncate">
                    {user.name}
                  </span>
                  <span
                    className="text-[10px] text-emerald-400 flex items-center font-semibold"
                    title="Account Verified"
                  >
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{user.accountNumber}</span>
                  {isAdminMode && (
                    <span className="text-purple-400 font-bold ml-1 px-1 bg-purple-500/10 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="pb-3 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Identity Verified
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {user.accountNumber}
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('profile_settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Security</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('verification');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verification Status (KYC)</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('statement');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span>Account Statement</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleAdminMode();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-purple-300 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/40 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <span>Direct Admin Control</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                      {isAdminMode ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Switch Session / Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
