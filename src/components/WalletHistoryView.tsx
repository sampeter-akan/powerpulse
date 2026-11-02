import React from 'react';
import { Sparkles, Copy, Check, CheckCircle2, HeartHandshake, ShieldCheck, Smartphone, History, ArrowUpRight } from 'lucide-react';
import { TopUpTransaction, SafetyNetStatus, CurrencyConfig, PaymentShortcut } from '../types/energy';
import { formatCurrency, formatSTS } from '../utils/formatters';
import { sound } from '../utils/audio';

interface WalletHistoryViewProps {
  transactions: TopUpTransaction[];
  safetyNet: SafetyNetStatus;
  currency: CurrencyConfig;
  meterNumber: string;
  onOpenTopUp: () => void;
  onOpenSafetyNet: () => void;
  paymentShortcuts?: PaymentShortcut[];
  countryName?: string;
}

export const WalletHistoryView: React.FC<WalletHistoryViewProps> = ({
  transactions,
  safetyNet,
  currency,
  meterNumber,
  onOpenTopUp,
  onOpenSafetyNet,
  paymentShortcuts,
  countryName = 'Nigeria',
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (token: string, id: string) => {
    sound.playClick();
    navigator.clipboard?.writeText(token.replace(/\s+/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Smart Energy Wallet & STS Tokens</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Vending History & Safety Net
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Meter #{meterNumber} · Instant 20-digit token generation and emergency advances
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSafetyNet();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Safety Net</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenTopUp();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-xs font-bold hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buy Units</span>
            </button>
          </div>
        </div>

        {/* Safety Net Status Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Emergency Power Safety Net</span>
              <span className="text-slate-400 text-[11px]">
                {safetyNet.hasActiveAdvance
                  ? 'Active advance in progress. Settles on next top-up.'
                  : 'Eligible for 15 kWh instant zero-interest advance if units reach zero.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold text-amber-400">
              {safetyNet.hasActiveAdvance ? 'ACTIVE (15 kWh)' : 'PRE-APPROVED (15 kWh)'}
            </span>
          </div>
        </div>
      </div>

      {/* Offline USSD & Mobile Money Quick Codes Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Offline-First Vending Shortcuts ({countryName})</span>
          </div>
          <span className="text-[11px] text-slate-500">Works without data / zero-internet fallback</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          If internet connectivity is down, use these verified mobile payment shortcuts to load prepaid tokens directly:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          {paymentShortcuts && paymentShortcuts.length > 0 ? (
            paymentShortcuts.map((ps, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-sans">{ps.provider}</span>
                <span className="text-emerald-400 font-bold block">{ps.code}</span>
                <span className="text-[10px] text-slate-500 font-sans block truncate">{ps.instruction}</span>
              </div>
            ))
          ) : (
            <>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                GTBank: <span className="text-emerald-400 font-bold">*737*50*Amount*1#</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                Zenith: <span className="text-emerald-400 font-bold">*966*7*Amount#</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                Access: <span className="text-emerald-400 font-bold">*901*3#</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                UBA: <span className="text-emerald-400 font-bold">*919*10#</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Previous STS Tokens List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <History className="w-4 h-4" />
            <span>Generated STS Tokens & Vending History</span>
          </span>
          <span className="text-[11px] text-slate-500">{transactions.length} transactions</span>
        </div>

        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white">
                  +{tx.kwhPurchased.toFixed(1)} kWh Purchased
                </span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {formatCurrency(tx.amount, currency)}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {tx.timestamp}
              </span>
            </div>

            {/* Token display box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="font-mono text-sm sm:text-base font-bold text-slate-200 tracking-wider truncate">
                {formatSTS(tx.token)}
              </div>
              <button
                onClick={() => handleCopy(tx.token, tx.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedId === tx.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Method: {tx.method}</span>
              <span className="text-emerald-400/90 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>STS Standard Token Validated</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
