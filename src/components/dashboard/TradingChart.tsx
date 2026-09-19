import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Maximize2,
  Volume2,
  Layers,
  Sparkles,
  Newspaper,
  Clock,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { MarketAsset, MarketNews } from '../../types';

interface TradingChartProps {
  assets: MarketAsset[];
  activeSymbol: string;
  onSelectAsset: (symbol: string) => void;
  marketNews: MarketNews[];
  onOpenQuickTrade: () => void;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  assets,
  activeSymbol,
  onSelectAsset,
  marketNews,
  onOpenQuickTrade,
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '30m' | '1h' | '1D'>('30m');
  const [activeIndicators, setActiveIndicators] = useState({
    ma: true,
    volume: true,
    rsi: false,
    macd: false,
  });
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  const activeAsset = useMemo(() => {
    return assets.find((a) => a.symbol === activeSymbol) || assets[0];
  }, [assets, activeSymbol]);

  // Generate dynamic candles based on the active asset price and timeframe
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    const basePrice = activeAsset.price;
    const numCandles = 32;
    const generated: Candle[] = [];
    let current = basePrice * 0.96;

    for (let i = 0; i < numCandles; i++) {
      const volatility = basePrice * 0.008;
      const change = (Math.random() - 0.48) * volatility;
      const open = current;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.7;
      const low = Math.min(open, close) - Math.random() * volatility * 0.7;
      const volume = Math.floor(Math.random() * 800 + 200);

      const minsAgo = (numCandles - i) * (timeframe === '1m' ? 1 : timeframe === '30m' ? 30 : 60);
      const d = new Date(Date.now() - minsAgo * 60 * 1000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      generated.push({
        time: timeStr,
        open: Number(open.toFixed(basePrice > 10 ? 2 : 4)),
        high: Number(high.toFixed(basePrice > 10 ? 2 : 4)),
        low: Number(low.toFixed(basePrice > 10 ? 2 : 4)),
        close: Number(close.toFixed(basePrice > 10 ? 2 : 4)),
        volume,
      });

      current = close;
    }
    // Make last close match activeAsset.price
    generated[generated.length - 1].close = activeAsset.price;
    setCandles(generated);
  }, [activeAsset.symbol, timeframe]);

  // Live ticking simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const delta = (Math.random() - 0.49) * (last.close * 0.0008);
        last.close = Number((last.close + delta).toFixed(last.close > 10 ? 2 : 4));
        if (last.close > last.high) last.high = last.close;
        if (last.close < last.low) last.low = last.close;
        return [...prev.slice(0, prev.length - 1), last];
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Compute Chart SVG Dimensions
  const chartHeight = 280;
  const chartWidth = 720;
  const paddingY = 30;

  const minPrice = useMemo(() => {
    if (candles.length === 0) return 0;
    return Math.min(...candles.map((c) => c.low)) * 0.998;
  }, [candles]);

  const maxPrice = useMemo(() => {
    if (candles.length === 0) return 1;
    return Math.max(...candles.map((c) => c.high)) * 1.002;
  }, [candles]);

  const priceToY = (price: number) => {
    if (maxPrice === minPrice) return chartHeight / 2;
    return chartHeight - paddingY - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - paddingY * 2);
  };

  const candleWidth = 14;
  const candleGap = 6;
  const stepX = candleWidth + candleGap;

  const latestCandle = candles[candles.length - 1] || activeAsset.ohlc;
  const displayCandle = hoveredCandle || latestCandle;

  return (
    <div className="space-y-4">
      {/* Mini Ticker Grid (BTC/USDT, ETH/USDT, EUR/USD, GBP/USD, AAPL, TSLA, GOLD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {assets.map((item) => {
          const isSelected = item.symbol === activeSymbol;
          const isUp = item.change24h >= 0;
          return (
            <button
              key={item.symbol}
              onClick={() => onSelectAsset(item.symbol)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                  {item.symbol}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {item.change24h}%
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-white mt-1">
                {item.price > 10 ? `$${item.price.toLocaleString()}` : item.price}
              </p>
              <span className="text-[9px] text-slate-500 truncate block">Vol: {item.volume}</span>
            </button>
          );
        })}
      </div>

      {/* Main Candlestick Chart Window (TradingView Embedded Style) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Chart Header & Controls */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight">
                {activeAsset.symbol}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline font-medium">
                {activeAsset.name}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20">
                {activeAsset.category}
              </span>
            </div>

            {/* OHLC Realtime HUD */}
            <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-slate-400 pl-4 border-l border-slate-800">
              <span>
                O: <span className="text-white">{displayCandle.open}</span>
              </span>
              <span>
                H: <span className="text-emerald-400">{displayCandle.high}</span>
              </span>
              <span>
                L: <span className="text-rose-400">{displayCandle.low}</span>
              </span>
              <span>
                C: <span className="text-amber-400">{displayCandle.close}</span>
              </span>
            </div>
          </div>

          {/* Timeframe Controls (1m, 30m, 1h, 1D) */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['1m', '30m', '1h', '1D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Indicators Toggle */}
            <button
              onClick={() => setActiveIndicators((p) => ({ ...p, ma: !p.ma }))}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                activeIndicators.ma
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              MA (20)
            </button>
            <button
              onClick={() => setActiveIndicators((p) => ({ ...p, volume: !p.volume }))}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                activeIndicators.volume
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              VOL
            </button>
          </div>
        </div>

        {/* Candlestick Canvas / Interactive SVG */}
        <div className="relative p-2 sm:p-4 bg-slate-950/70 overflow-x-auto select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-64 sm:h-72 overflow-visible"
            onMouseLeave={() => setHoveredCandle(null)}
          >
            {/* Horizontal Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const y = chartHeight * ratio;
              const priceVal = maxPrice - (maxPrice - minPrice) * ratio;
              return (
                <g key={idx}>
                  <line
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={chartWidth - 55}
                    y={y - 4}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {priceVal > 10 ? priceVal.toFixed(2) : priceVal.toFixed(4)}
                  </text>
                </g>
              );
            })}

            {/* Volume Histogram (Underneath) */}
            {activeIndicators.volume &&
              candles.map((candle, idx) => {
                const x = 30 + idx * stepX;
                const isGreen = candle.close >= candle.open;
                const maxVol = Math.max(...candles.map((c) => c.volume), 1);
                const volHeight = (candle.volume / maxVol) * 45;
                const volY = chartHeight - volHeight - 5;
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x}
                    y={volY}
                    width={candleWidth}
                    height={volHeight}
                    fill={isGreen ? '#10b981' : '#f43f5e'}
                    opacity="0.22"
                    rx="1"
                  />
                );
              })}

            {/* Moving Average Line (MA 20) */}
            {activeIndicators.ma && candles.length > 5 && (
              <path
                d={candles.map((c, i) => {
                  const slice = candles.slice(Math.max(0, i - 4), i + 1);
                  const avg = slice.reduce((sum, item) => sum + item.close, 0) / slice.length;
                  const x = 30 + i * stepX + candleWidth / 2;
                  const y = priceToY(avg);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {/* Candlesticks (Wicks and Bodies) */}
            {candles.map((candle, idx) => {
              const x = 30 + idx * stepX;
              const isGreen = candle.close >= candle.open;
              const openY = priceToY(candle.open);
              const closeY = priceToY(candle.close);
              const highY = priceToY(candle.high);
              const lowY = priceToY(candle.low);
              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(openY - closeY), 2);
              const color = isGreen ? '#10b981' : '#f43f5e';

              return (
                <g
                  key={idx}
                  className="cursor-crosshair group"
                  onMouseEnter={() => setHoveredCandle(candle)}
                >
                  {/* High/Low Wick */}
                  <line
                    x1={x + candleWidth / 2}
                    y1={highY}
                    x2={x + candleWidth / 2}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1.5"
                    className="transition-all hover:opacity-80"
                  />
                </g>
              );
            })}

            {/* Current Price Horizontal Ray */}
            <g>
              <line
                x1="0"
                y1={priceToY(activeAsset.price)}
                x2={chartWidth}
                y2={priceToY(activeAsset.price)}
                stroke="#f59e0b"
                strokeDasharray="2 2"
                strokeWidth="1.2"
              />
              <rect
                x={chartWidth - 65}
                y={priceToY(activeAsset.price) - 10}
                width="62"
                height="20"
                fill="#f59e0b"
                rx="4"
              />
              <text
                x={chartWidth - 60}
                y={priceToY(activeAsset.price) + 4}
                fill="#020617"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {activeAsset.price > 10 ? activeAsset.price.toFixed(2) : activeAsset.price}
              </text>
            </g>
          </svg>
        </div>

        {/* Chart Footer Indicator Legend */}
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Bullish Candle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Bearish Candle
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2 h-0.5 bg-indigo-500" /> MA(20)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">TradingView High-Precision Feed</span>
            <button
              onClick={onOpenQuickTrade}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Order Execution <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Market Data Table & News Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Data Table (Live prices, % change, OHLC data) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Live Market Matrix & OHLC Data</span>
            </div>
            <span className="text-xs text-slate-400">8 Institutional Pairs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                  <th className="pb-2 font-semibold">Asset Pair</th>
                  <th className="pb-2 font-semibold">Live Price</th>
                  <th className="pb-2 font-semibold">24h Change</th>
                  <th className="pb-2 font-semibold hidden sm:table-cell">24h High / Low</th>
                  <th className="pb-2 font-semibold hidden md:table-cell">Volume</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {assets.map((asset) => {
                  const isUp = asset.change24h >= 0;
                  return (
                    <tr
                      key={asset.symbol}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectAsset(asset.symbol)}
                    >
                      <td className="py-2.5">
                        <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                          {asset.symbol}
                        </div>
                        <div className="text-[10px] text-slate-400">{asset.name}</div>
                      </td>
                      <td className="py-2.5 font-mono font-bold text-slate-200">
                        {asset.price > 10 ? `$${asset.price.toLocaleString()}` : asset.price}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                            isUp
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {asset.change24h}%
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-400 hidden sm:table-cell">
                        <span className="text-emerald-400/80">{asset.high24h}</span> /{' '}
                        <span className="text-rose-400/80">{asset.low24h}</span>
                      </td>
                      <td className="py-2.5 text-slate-400 hidden md:table-cell">{asset.volume}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAsset(asset.symbol);
                            onOpenQuickTrade();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-bold transition-all"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded Market News Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Live Intelligence Feed</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Bloomberg / Reuters
              </span>
            </div>

            <div className="space-y-3">
              {marketNews.map((news) => (
                <div
                  key={news.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-amber-400 font-semibold">{news.source}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          news.sentiment === 'Bullish'
                            ? 'text-emerald-400'
                            : news.sentiment === 'Bearish'
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {news.sentiment}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {news.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-snug hover:text-white transition-colors cursor-pointer">
                    {news.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Sentiment Algorithm: <strong className="text-emerald-400">82% Bullish Bias</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
