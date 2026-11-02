import React, { useState } from 'react';
import { Sun, Battery, Zap, Fuel, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, Calculator, Sparkles } from 'lucide-react';
import { Appliance, CurrencyConfig } from '../types/energy';
import { formatCurrency } from '../utils/formatters';
import { sound } from '../utils/audio';

interface SolarPlannerProps {
  appliances: Appliance[];
  currency: CurrencyConfig;
}

export const SolarPlanner: React.FC<SolarPlannerProps> = ({
  appliances,
  currency,
}) => {
  // Desired backup hours when grid is out
  const [backupHours, setBackupHours] = useState<number>(10);
  const [includeAC, setIncludeAC] = useState<boolean>(false);
  const [fuelLitresPerDay, setFuelLitresPerDay] = useState<number>(6); // typical generator fuel use
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState<number>(currency.code === 'NGN' ? 1050 : 1.4);

  // Active wattage baseline from appliances
  const essentialWattage = appliances
    .filter((a) => a.isActive && (includeAC || a.category !== 'cooling' || a.watts < 500))
    .reduce((sum, a) => sum + a.watts, 0);

  const effectiveWattage = Math.max(essentialWattage, 350);

  // Battery sizing: (Wattage * Backup Hours) / 0.85 depth of discharge
  const requiredBatteryKWh = ((effectiveWattage * backupHours) / 1000) / 0.85;

  // Inverter sizing: Peak surge is approx 2x running wattage
  const requiredInverterKVA = Math.max(1.5, Math.ceil(((effectiveWattage * 1.8) / 1000) * 2) / 2);

  // Solar PV panels: Need to generate required battery kWh in ~5 peak sun hours
  const requiredSolarWatts = Math.ceil(((requiredBatteryKWh * 1000) / 5) / 100) * 100;
  const panelCount = Math.ceil(requiredSolarWatts / 450);

  // Costs estimation based on currency
  const baseCostUSD = requiredInverterKVA * 250 + requiredBatteryKWh * 220 + panelCount * 120 + 300;
  const systemCost = currency.code === 'NGN'
    ? baseCostUSD * 1500
    : baseCostUSD * (currency.ratePerKWh / 0.17);

  // Monthly generator fuel cost
  const monthlyFuelSpend = fuelLitresPerDay * fuelPricePerLitre * 30;

  // Payback period in months
  const paybackMonths = monthlyFuelSpend > 0 ? (systemCost / monthlyFuelSpend).toFixed(1) : '14';

  const [isInstallerModalOpen, setIsInstallerModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Sun className="w-4 h-4" />
              <span>Solar & Inverter Transition Architect</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              End Generator Fuel Anxiety Forever
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Right-sized battery and solar system matched directly to your household appliances
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <span className="text-xs text-slate-400">Est. Payback Period:</span>
            <span className="text-xl sm:text-2xl font-black font-display text-amber-400 font-mono tabular-nums">
              {paybackMonths} Months
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Zero noise, zero fumes
            </span>
          </div>
        </div>

        {/* Comparison Callout: Fuel vs Clean Solar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-rose-200 block">Your Current Generator Burden</span>
              <p className="text-slate-300 mt-0.5 text-[11px]">
                Running a small generator for {fuelLitresPerDay}L/day costs you approximately{' '}
                <strong className="text-rose-300 font-mono">{formatCurrency(monthlyFuelSpend, currency)}/month</strong>,
                plus ongoing oil changes, spark plugs, and neighborhood noise friction.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-emerald-200 block">Recommended Solar Payoff</span>
              <p className="text-slate-300 mt-0.5 text-[11px]">
                By redirecting generator fuel money into solar/lithium, the entire system pays for itself in under{' '}
                <strong className="text-emerald-300">{paybackMonths} months</strong>, with 10+ years of quiet, continuous electricity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Interactive Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Tune Your Solar Sizing Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Desired Backup Hours Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Desired Blackout Backup Duration</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{backupHours} Hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={backupHours}
              onChange={(e) => {
                sound.playClick();
                setBackupHours(parseInt(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>4 hrs (Evening light)</span>
              <span>12 hrs (Overnight)</span>
              <span>24 hrs (Full autonomy)</span>
            </div>
          </div>

          {/* Generator Fuel Usage */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Daily Generator Fuel (Litres)</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{fuelLitresPerDay} Litres/day</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={fuelLitresPerDay}
              onChange={(e) => {
                sound.playClick();
                setFuelLitresPerDay(parseInt(e.target.value));
              }}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>2 Litres (Small gen)</span>
              <span>10 Litres (Medium)</span>
              <span>25 Litres (Plaza/Large)</span>
            </div>
          </div>
        </div>

        {/* AC Inclusion Toggle */}
        <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-white block">
              Include Inverter AC in Solar Backup?
            </span>
            <span className="text-[11px] text-slate-400">
              Powering air conditioning on solar requires a larger inverter and battery bank.
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setIncludeAC(!includeAC);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              includeAC
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {includeAC ? 'AC Included' : 'Exclude AC'}
          </button>
        </div>
      </div>

      {/* Recommended System Architecture Hardware Specification */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Recommended Hardware Blueprint for Your Home</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Inverter */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Pure Sine Wave Inverter</div>
            <div className="text-xl font-bold font-display text-white">
              {requiredInverterKVA} kVA / {Math.round(requiredInverterKVA * 800)}W
            </div>
            <p className="text-[11px] text-slate-400">
              High-frequency hybrid inverter with built-in MPPT solar charge controller.
            </p>
          </div>

          {/* Card 2: Battery */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Battery className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Lithium (LiFePO4) Battery</div>
            <div className="text-xl font-bold font-display text-white">
              {requiredBatteryKWh.toFixed(1)} kWh Storage
            </div>
            <p className="text-[11px] text-slate-400">
              6,000+ cycle life (10–12 years) with intelligent BMS and fast grid charging.
            </p>
          </div>

          {/* Card 3: Solar Panels */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Monocrystalline Solar PV</div>
            <div className="text-xl font-bold font-display text-white">
              {panelCount}x 450W Panels ({(panelCount * 0.45).toFixed(1)} kWp)
            </div>
            <p className="text-[11px] text-slate-400">
              Tier-1 high efficiency panels generating enough electricity to recharge batteries by 2 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Total Estimated Cost & Vetted Installers Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">Complete Turnkey Package (Hardware + Installation):</span>
          <span className="text-2xl font-black font-display text-white font-mono">
            {formatCurrency(systemCost, currency)}
          </span>
          <span className="text-xs text-emerald-400 block mt-0.5">
            Flexible financing available: ~{formatCurrency(systemCost / 12, currency)}/mo for 12 months
          </span>
        </div>

        <button
          onClick={() => {
            sound.playTokenSuccess();
            setIsInstallerModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:from-emerald-300 hover:to-amber-200 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>Connect with Vetted Solar Installers</span>
        </button>
      </div>

      {/* Elegant Installer Quote Modal */}
      {isInstallerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Solar Partner Request Dispatched</h3>
                <p className="text-xs text-slate-400">Blueprint matched with 3 vetted regional installers</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">System Blueprint:</span>
                <span className="font-mono font-bold text-white">{requiredInverterKVA}kVA Inverter + {requiredBatteryKWh.toFixed(1)}kWh Lithium</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Solar Array:</span>
                <span className="font-mono text-emerald-400">{panelCount}x 450W Monocrystalline Panels</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Estimated Payback:</span>
                <span className="font-mono text-amber-300">{paybackMonths} months on generator fuel savings</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Verified Regional Partners:</span>
                <span className="font-semibold text-slate-200">Auxano Solar, Daystar & Rubitec</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our partner desk will reach out via WhatsApp / phone with formal site audit scheduling and 12-month installment financing terms.
            </p>

            <button
              onClick={() => setIsInstallerModalOpen(false)}
              className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
