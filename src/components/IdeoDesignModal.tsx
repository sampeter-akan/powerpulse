import React from 'react';
import { X, Heart, Shield, Users, Sparkles, Compass, Lightbulb, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface IdeoDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeoDesignModal: React.FC<IdeoDesignModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-[1px] shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">IDEO Human-Centered Design Pillars</h3>
              <p className="text-xs text-slate-400">How PowerPulse transforms energy utility into human well-being</p>
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
          
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1 text-sm font-display">
              "Technology grounded in the lived realities of people."
            </span>
            IDEO defines human-centered design as beginning with empathy for people's daily context—unpredictable power cuts, irregular cashflow, shared phones, low trust in utility companies, and the emotional anxiety of not knowing if medicines will stay cold overnight.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Pillar 1 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Heart className="w-4 h-4" />
                <span>1. Predictive Empathy</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Replaces opaque kWh numbers with human metrics: <em>"At your current usage, you have 18 hours remaining."</em> Eliminates the sudden midnight blackout panic.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>2. Health as Energy Lifeline</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Treats energy as healthcare: locks a dedicated reserve for insulin, pediatric antibiotics, CPAP, and baby formula, with automated caregiver notifications.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>3. Financial Dignity</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Micro-vending in flexible amounts, 1-tap bill splitting with housemates, and a zero-predatory 15 kWh emergency credit advance with 0% interest.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Users className="w-4 h-4" />
                <span>4. Relational Community Grid</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Connects neighbors through crowdsourced transformer reports, real-time feeder statuses, and community solar hubs offering free phone and medical device charging.
              </p>
            </div>
          </div>

          {/* Target Global Context */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Global Scale Potential</span>
              <span className="font-mono text-[10px] text-emerald-400">Arch. Samuel Peter</span>
            </div>
            <p>
              Designed for households across Nigeria (Port Harcourt, Lagos, Abuja), Sub-Saharan Africa (Kenya, South Africa, Ghana), South Asia, and Latin America where prepaid metering and grid instability are daily realities.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
