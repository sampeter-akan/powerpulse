import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Users, ArrowRight, CreditCard, Smartphone, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CurrencyConfig, TopUpTransaction } from '../types/energy';
import { formatCurrency, formatSTS, generateRandomSTSToken } from '../utils/formatters';
import { sound } from '../utils/audio';

interface TopUpWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
  meterNumber: string;
  onSuccessTopUp: (amount: number, kwh: number, transaction: TopUpTransaction) => void;
}

export const TopUpWalletModal: React.FC<TopUpWalletModalProps> = ({
  isOpen,
  onClose,
  currency,
  meterNumber,
  onSuccessTopUp,
}) => {
  // Preset amounts based on currency
  const defaultPresets = currency.code === 'NGN'
    ? [2000, 5000, 10000, 20000]
    : currency.code === 'USD'
    ? [10, 25, 50, 100]
    : currency.code === 'KES'
    ? [500, 1000, 2500, 5000]
    : [100, 250, 500, 1000];

  const [selectedAmount, setSelectedAmount] = useState<number>(defaultPresets[1]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [purchasedKWh, setPurchasedKWh] = useState<number>(0);
  const [copiedToken, setCopiedToken] = useState(false);

  // Split with housemates feature
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitCount, setSplitCount] = useState<number>(3);
  const [copiedSplitLink, setCopiedSplitLink] = useState(false);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const calculatedKWh = currentAmount > 0 ? currentAmount / currency.ratePerKWh : 0;
  const perPersonShare = currentAmount / Math.max(1, splitCount);

  const handlePay = () => {
    sound.playClick();
    setIsProcessing(true);

    setTimeout(() => {
      const token = generateRandomSTSToken();
      setGeneratedToken(token);
      setPurchasedKWh(calculatedKWh);
      setIsProcessing(false);
      sound.playTokenSuccess();

      const tx: TopUpTransaction = {
        id: `tx-${Date.now()}`,
        timestamp: 'Just now',
        amount: currentAmount,
        kwhPurchased: calculatedKWh,
        token: formatSTS(token),
        status: 'success',
        method: 'Instant Mobile Wallet / Card',
        meterNumber,
      };

      onSuccessTopUp(currentAmount, calculatedKWh, tx);
    }, 1200);
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      sound.playClick();
      navigator.clipboard?.writeText(generatedToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handleCopySplit = () => {
    sound.playClick();
    const text = `Hey, let's split this month's electricity for Meter #${meterNumber}! Total: ${formatCurrency(currentAmount, currency)} (${formatCurrency(perPersonShare, currency)} each for ${splitCount} of us). Powered by PowerPulse.`;
    navigator.clipboard?.writeText(text);
    setCopiedSplitLink(true);
    setTimeout(() => setCopiedSplitLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Smart Top-Up & STS Tokens</h3>
              <p className="text-xs text-slate-400">Meter #{meterNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Token Generation Success State */}
          {generatedToken ? (
            <div className="space-y-5 text-center animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white font-display">Prepaid Units Generated!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  +{purchasedKWh.toFixed(1)} kWh added to household forecast
                </p>
              </div>

              {/* 20-Digit STS Token Highlight Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 shadow-inner">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
                  Standard Transfer Specification (STS) 20-Digit Token
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest my-2 select-all">
                  {formatSTS(generatedToken)}
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={handleCopyToken}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Token Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy 20 Digits</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`tel:*737*`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Dial USSD</span>
                  </a>
                </div>
              </div>

              {/* Physical Meter Key-in Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-300 text-xs text-left">
                <div className="font-semibold text-white mb-1">How to load on your CIU / meter:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Enter the 20 digits above on your in-house keypad (CIU).</li>
                  <li>Press the red <strong>Enter</strong> or <strong>#</strong> key.</li>
                  <li>Wait for the beep: meter screen will display <em>ACCEPT</em>.</li>
                </ol>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Return to Energy Dashboard
              </button>
            </div>
          ) : (
            /* Standard Purchase Flow */
            <>
              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Select flexible top-up amount:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {defaultPresets.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        sound.playClick();
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm font-display">
                        {formatCurrency(amt, currency)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ≈ {(amt / currency.ratePerKWh).toFixed(1)} kWh
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Or enter exact amount ({currency.symbol})
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 font-mono text-sm">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) {
                        setSelectedAmount(parseFloat(e.target.value) || 0);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Expected Output Calculation Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Estimated electricity units:</span>
                  <div className="text-white font-bold font-mono text-base">
                    +{calculatedKWh.toFixed(1)} kWh
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Estimated runtime:</span>
                  <div className="text-emerald-400 font-bold font-mono text-base">
                    ≈ {(calculatedKWh / 0.78).toFixed(0)} additional hours
                  </div>
                </div>
              </div>

              {/* Split with Family / Roommates Accordion */}
              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsSplitting(!isSplitting);
                  }}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Split Payment with Family / Flatmates</span>
                  </span>
                  <span className="text-emerald-400 text-xs">
                    {isSplitting ? 'Close' : 'Split Bill'}
                  </span>
                </button>

                {isSplitting && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Number of people:</span>
                      <div className="flex items-center gap-2">
                        {[2, 3, 4, 5].map((cnt) => (
                          <button
                            key={cnt}
                            onClick={() => {
                              sound.playClick();
                              setSplitCount(cnt);
                            }}
                            className={`w-7 h-7 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                              splitCount === cnt
                                ? 'bg-emerald-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {cnt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400">Each person pays:</span>
                        <div className="text-white font-mono font-bold text-sm">
                          {formatCurrency(perPersonShare, currency)}
                        </div>
                      </div>
                      <button
                        onClick={handleCopySplit}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedSplitLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSplitLink ? 'Copied Share Link!' : 'Copy WhatsApp Request'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Instant Payment Provider
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex items-center gap-2 text-white">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">Mobile Money / Paystack</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-2 text-slate-400">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Debit Card / USSD</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing || currentAmount <= 0}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:from-emerald-300 hover:to-amber-200 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Generating Secure 20-digit STS Token...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Pay {formatCurrency(currentAmount, currency)} & Get Token</span>
                  </>
                )}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
