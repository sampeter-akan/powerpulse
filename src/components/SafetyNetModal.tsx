import React, { useState } from 'react';
import { X, HeartHandshake, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Zap, Info } from 'lucide-react';
import { SafetyNetStatus, CurrencyConfig } from '../types/energy';
import { sound } from '../utils/audio';
import { formatCurrency } from '../utils/formatters';

interface SafetyNetModalProps {
  isOpen: boolean;
  onClose: () => void;
  safetyNet: SafetyNetStatus;
  currency: CurrencyConfig;
  onActivateSafetyNet: (kwh: number) => void;
}

export const SafetyNetModal: React.FC<SafetyNetModalProps> = ({
  isOpen,
  onClose,
  safetyNet,
  currency,
  onActivateSafetyNet,
}) => {
  const [isActivating, setIsActivating] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  if (!isOpen) return null;

  const advanceKWh = 15.0; // standard emergency lifeline
  const advanceValue = advanceKWh * currency.ratePerKWh;

  const handleActivate = () => {
    sound.playClick();
    setIsActivating(true);

    setTimeout(() => {
      setIsActivating(false);
      setActivatedSuccess(true);
      sound.playTokenSuccess();
      onActivateSafetyNet(advanceKWh);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/60 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Power Safety Net</h3>
              <p className="text-xs text-amber-300/80">Never be unexpectedly left in the dark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activatedSuccess ? (
            <div className="text-center space-y-4 py-4 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">Safety Net Activated!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  +{advanceKWh} kWh has been credited directly to your live household balance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Emergency Credit:</span>
                  <span className="font-mono font-bold text-white">+{advanceKWh} kWh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Approx. Runtime:</span>
                  <span className="font-mono text-emerald-400 font-semibold">≈ 19 additional hours</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Repayment deduction:</span>
                  <span className="font-mono text-amber-300">{formatCurrency(advanceValue, currency)} (0% interest)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Dignity & Transparency Statement */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transparent, Zero-Predatory Financial Lifeline</span>
                </div>
                <p>
                  No family should endure midnight darkness, spoiled food, or medical risk because banking networks are down or payday is tomorrow. PowerPulse provides a transparent emergency advance of <strong>15 kWh</strong>.
                </p>
              </div>

              {/* Offer Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Emergency Electricity Advance:</span>
                  <span className="text-lg font-bold font-mono text-white">+{advanceKWh} kWh</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Cash Value Equivalent:</span>
                  <span className="text-sm font-semibold font-mono text-amber-300">
                    {formatCurrency(advanceValue, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Interest / Hidden Fees:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    0.0% (Zero Interest)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Repayment Terms:</span>
                  <span className="text-xs text-slate-300 font-medium">
                    Automatically settled on your next regular top-up
                  </span>
                </div>
              </div>

              {/* What this covers */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
                <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>What 15 kWh powers in your household:</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                  <li>Up to 24 hours of refrigerator insulin protection</li>
                  <li>Over 30 hours of LED room lighting and Wi-Fi router</li>
                  <li>Full phone & laptop charging for remote work</li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={handleActivate}
                disabled={isActivating || safetyNet.hasActiveAdvance}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-300 hover:from-amber-300 hover:to-emerald-200 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isActivating ? (
                  <span>Dispatching 15 kWh Emergency Advance...</span>
                ) : safetyNet.hasActiveAdvance ? (
                  <span>Active Advance in Progress</span>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4 text-slate-950" />
                    <span>Activate 15 kWh Emergency Lifeline Now</span>
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
