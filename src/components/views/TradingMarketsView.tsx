import React, { useState } from 'react';
import {
  TrendingUp,
  Bot,
  Users,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { MarketAsset } from '../../types';

interface TradingMarketsViewProps {
  assets?: MarketAsset[];
  initialSubTab?: 'live_markets' | 'copy_trading' | 'ai_bots' | 'signals';
  onSelectAssetForTrade: (symbol: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TradingMarketsView: React.FC<TradingMarketsViewProps> = ({
  assets = [],
  initialSubTab = 'live_markets',
  onSelectAssetForTrade,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'live_markets' | 'copy_trading' | 'ai_bots' | 'signals'>(
    initialSubTab
  );

  const copyTraders = [
    {
      id: 'c1',
      name: 'Alex Vance (QuantMaster)',
      followers: 1842,
      winRate: '92.4%',
      pnl30d: '+84.2%',
      copiersProfit: '$420,150',
      riskScore: 2,
    },
    {
      id: 'c2',
      name: 'Elena Rostova (Forex Alpha)',
      followers: 954,
      winRate: '88.1%',
      pnl30d: '+62.7%',
      copiersProfit: '$198,340',
      riskScore: 3,
    },
    {
      id: 'c3',
      name: 'David K. (Crypto Arbitrage)',
      followers: 2410,
      winRate: '95.6%',
      pnl30d: '+118.5%',
      copiersProfit: '$890,200',
      riskScore: 1,
    },
  ];

  const aiBots = [
    {
      id: 'bot_grid',
      name: 'Liberty Point Ultra Grid Scalper v4',
      type: 'High-Frequency Grid',
      roi30d: '+34.8%',
      active: true,
      description: 'Places geometric high-density limit buy/sell orders capturing micro-volatility.',
    },
    {
      id: 'bot_dca',
      name: 'AI Dynamic Smart DCA',
      type: 'Mean Reversion',
      roi30d: '+28.4%',
      active: false,
      description: 'Dollar-cost-averages during algorithmic oversold dips with automated trailing profit.',
    },
    {
      id: 'bot_arb',
      name: 'Cross-Exchange Triangular Arbitrage',
      type: 'Statistical Arbitrage',
      roi30d: '+42.1%',
      active: true,
      description: 'Zero-directional-risk latency arbitrage across decentralized & centralized books.',
    },
  ];

  const signals = [
    {
      id: 'sig_1',
      pair: 'BTC/USDT',
      direction: 'BUY (LONG)',
      entry: '$89,450.00',
      tp1: '$92,500.00',
      tp2: '$95,000.00',
      sl: '$87,800.00',
      probability: '94%',
      time: '12m ago',
    },
    {
      id: 'sig_2',
      pair: 'EUR/USD',
      direction: 'SELL (SHORT)',
      entry: '1.0845',
      tp1: '1.0780',
      tp2: '1.0720',
      sl: '1.0890',
      probability: '89%',
      time: '45m ago',
    },
    {
      id: 'sig_3',
      pair: 'GOLD (XAU/USD)',
      direction: 'BUY (LONG)',
      entry: '$2,748.50',
      tp1: '$2,780.00',
      tp2: '$2,810.00',
      sl: '$2,732.00',
      probability: '91%',
      time: '1h ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Trading Intelligence & Global Markets
          </h2>
          <p className="text-xs text-slate-400">
            Copy verified master traders, deploy autonomous AI algorithmic bots, and receive VIP trading signals
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('live_markets')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'live_markets' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Markets
          </button>
          <button
            onClick={() => setSubTab('copy_trading')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'copy_trading' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Copy Trading Pro
          </button>
          <button
            onClick={() => setSubTab('ai_bots')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'ai_bots' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Trading Bots
          </button>
          <button
            onClick={() => setSubTab('signals')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'signals' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Premium Signals
          </button>
        </div>
      </div>

      {/* 1. Live Markets */}
      {subTab === 'live_markets' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Institutional Market Depth</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assets.map((a) => (
              <div
                key={a.symbol}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{a.symbol}</span>
                    <span
                      className={`text-xs font-bold ${
                        a.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {a.change24h >= 0 ? '+' : ''}
                      {a.change24h}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{a.name}</p>
                  <p className="text-lg font-mono font-black text-slate-100 mt-2">
                    ${a.price.toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[10px]">Vol: {a.volume}</span>
                  <button
                    onClick={() => {
                      onSelectAssetForTrade(a.symbol);
                      onShowToast(`Selected ${a.symbol} for order execution`, 'info');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold transition-all text-[11px]"
                  >
                    Quick Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Copy Trading Pro */}
      {subTab === 'copy_trading' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copyTraders.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{t.followers} Active Copiers</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-[10px]">
                    Risk Score: {t.riskScore}/10
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{t.name}</h3>

                <div className="space-y-2.5 p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 my-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Audited Win Rate:</span>
                    <span className="font-mono font-black text-emerald-400">{t.winRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">30-Day Return:</span>
                    <span className="font-mono font-black text-amber-400">{t.pnl30d}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Copiers Profit:</span>
                    <span className="font-mono font-bold text-white">{t.copiersProfit}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  onShowToast(`Now synchronizing copy-trading positions with ${t.name}!`, 'success')
                }
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Copy This Trader (Pro)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. AI Trading Bots */}
      {subTab === 'ai_bots' && (
        <div className="space-y-4">
          {aiBots.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 max-w-xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{b.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {b.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{b.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    30-Day Bot ROI
                  </span>
                  <span className="text-lg font-mono font-black text-emerald-400">{b.roi30d}</span>
                </div>

                <button
                  onClick={() =>
                    onShowToast(
                      `Bot ${b.name} status updated: ${b.active ? 'Suspended' : 'Activated'}`,
                      'info'
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    b.active
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {b.active ? 'Bot Active (Running)' : 'Deploy Bot'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Premium Signals */}
      {subTab === 'signals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-base">{sig.pair}</span>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    sig.direction.includes('BUY')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {sig.direction}
                </span>
              </div>

              <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Entry Zone:</span>
                  <span className="text-white font-bold">{sig.entry}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Take Profit 1:</span>
                  <span className="font-bold">{sig.tp1}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Take Profit 2:</span>
                  <span className="font-bold">{sig.tp2}</span>
                </div>
                <div className="flex items-center justify-between text-rose-400">
                  <span>Stop Loss:</span>
                  <span className="font-bold">{sig.sl}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Confidence: <strong className="text-amber-400">{sig.probability}</strong></span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sig.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
