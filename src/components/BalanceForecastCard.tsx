import React from 'react';
import { Clock, Zap, Camera, ShieldCheck, HeartHandshake, AlertTriangle, ArrowUpRight, Flame, ShieldAlert, Sparkles, TrendingDown, Smartphone, Monitor } from 'lucide-react';
import { MeterData, CurrencyConfig, HealthSafeguard, Appliance } from '../types/energy';
import { formatCurrency, calculateTimeRemaining } from '../utils/formatters';
import { sound } from '../utils/audio';

interface BalanceForecastCardProps {
  meter: MeterData;
  currency: CurrencyConfig;
  appliances: Appliance[];
  healthSafeguard: HealthSafeguard;
  onOpenScanner: () => void;
  onOpenTopUp: () => void;
  onOpenSafetyNet: () => void;
  onOpenHealthModal: () => void;
  onToggleAppliance: (id: string) => void;
  isMobileFrame?: boolean;
  onToggleMobileFrame?: () => void;
  onOpenTariffAudit?: () => void;
}

export const BalanceForecastCard: React.FC<BalanceForecastCardProps> = ({
  meter,
  currency,
  appliances,
  healthSafeguard,
  onOpenScanner,
  onOpenTopUp,
  onOpenSafetyNet,
  onOpenHealthModal,
  onToggleAppliance,
  isMobileFrame = false,
  onToggleMobileFrame,
  onOpenTariffAudit,
}) => {
  // Calculate active wattage from running appliances
  const activeWattage = appliances
    .filter((a) => a.isActive)
    .reduce((sum, a) => sum + a.watts, 0);

  const effectiveHourlyBurnKWh = activeWattage > 0 ? activeWattage / 1000 : 0.08;

  const timeRemaining = calculateTimeRemaining(meter.currentUnitsKWh, effectiveHourlyBurnKWh);

  // Health reserve buffer
  const effectiveUsableUnits = healthSafeguard.enabled
    ? Math.max(0, meter.currentUnitsKWh - healthSafeguard.reserveKWh)
    : meter.currentUnitsKWh;

  const usableTimeRemaining = calculateTimeRemaining(effectiveUsableUnits, effectiveHourlyBurnKWh);

  // Currency value of remaining units
  const unitsValue = meter.currentUnitsKWh * currency.ratePerKWh;

  // Percentage capacity for ring progress (relative to typical 100kWh baseline)
  const percentage = Math.min(100, Math.max(5, (meter.currentUnitsKWh / 50) * 100));

  const isLow = timeRemaining.totalHours <= 18;
  const isCritical = timeRemaining.totalHours <= 6;

  // AC appliance if present to allow instant 1-click impact demonstration
  const acAppliance = appliances.find((a) => a.category === 'cooling' && a.watts >= 700);
  const pumpAppliance = appliances.find((a) => a.category === 'water');

  return (
    <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 relative overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Background Ambient Glow Gradients */}
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700 ${
        isCritical
          ? 'bg-rose-500/20'
          : isLow
          ? 'bg-amber-500/20'
          : 'bg-emerald-500/20'
      }`} />
      
      {/* Top Meta Strip: Meter Number, Provider, Central Actions (Preview & Top-Up), & Tariff Band */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80 relative z-10">
        
        {/* Left: Meter Number & Provider */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300">
            Meter #{meter.meterNumber}
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-400 font-medium">
            {meter.provider}
          </span>
        </div>

        {/* Center: Top-Up CTA & Switch to Mobile App Preview */}
        <div className="flex items-center gap-2.5 my-1 sm:my-0">
          {onToggleMobileFrame && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleMobileFrame();
              }}
              title={isMobileFrame ? 'Switch to Fluid Desktop Layout' : 'Switch to Mobile App Preview'}
              className="p-1.5 px-2.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800/90 text-slate-300 hover:text-emerald-400 hover:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm"
              aria-label="Toggle device frame preview"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Mobile Preview</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onOpenTopUp();
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-lg hover:from-emerald-300 hover:to-amber-200 shadow-md shadow-emerald-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Instant Prepaid Electricity Top-Up"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Top-Up</span>
          </button>
        </div>

        {/* Right: Tariff Band Audit & Scan LCD */}
        <div className="flex items-center gap-2">
          {onOpenTariffAudit ? (
            <button
              onClick={() => {
                sound.playClick();
                onOpenTariffAudit();
              }}
              className="text-[11px] text-emerald-300 hover:text-emerald-200 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md font-mono border border-slate-700/80 hover:border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm group"
              title="Audit regulatory tariff compliance & check for overbilling"
            >
              <span>{meter.tariffBand}</span>
              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                Audit
              </span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md font-mono">
              {meter.tariffBand}
            </span>
          )}
          <button
            onClick={() => {
              sound.playClick();
              onOpenScanner();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/50 transition-colors cursor-pointer"
            title="Scan physical meter screen with camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan LCD</span>
          </button>
        </div>
      </div>

      {/* Main Pulse Gauge & Runtime Display */}
      <div className="py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left: Huge Human Runtime Forecast */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Estimated Electricity Remaining</span>
          </div>

          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white tabular-nums">
              {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ''}
              {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          </div>

          {/* Emotional Human Meaning Date */}
          <p className="text-sm text-slate-300 flex items-center justify-center md:justify-start gap-1.5">
            <span>Runs out:</span>
            <span className="font-semibold text-emerald-300 font-mono">
              {timeRemaining.estimatedExpiryDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}{' '}
              at{' '}
              {timeRemaining.estimatedExpiryDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </p>

          {/* Health Safeguard Active Banner */}
          {healthSafeguard.enabled && (
            <div className="mt-3 inline-flex items-center gap-2 p-2 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs">
              <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>{healthSafeguard.reserveKWh} kWh reserved</strong> for {healthSafeguard.medicalItem}.
                Usable regular runtime: <span className="font-mono font-semibold">{usableTimeRemaining.hours}h {usableTimeRemaining.minutes}m</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: Circular Gauge Visualizer with Balance & Burn Rate */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Ring Meter */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                strokeWidth="10"
                strokeDasharray={314.16}
                strokeDashoffset={314.16 - (314.16 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  isCritical
                    ? 'text-rose-500 stroke-rose-500'
                    : isLow
                    ? 'text-amber-400 stroke-amber-400'
                    : 'text-emerald-400 stroke-emerald-400'
                }`}
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Data */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
              <span className="text-xs text-slate-400 font-medium">Prepaid Balance</span>
              <span className="text-2xl font-bold font-display text-white tabular-nums tracking-tight">
                {meter.currentUnitsKWh.toFixed(1)}
                <span className="text-xs font-normal text-emerald-400 ml-1">kWh</span>
              </span>
              <span className="text-xs font-mono text-slate-400 mt-0.5">
                ≈ {formatCurrency(unitsValue, currency)}
              </span>
            </div>
          </div>

          {/* Current Burn Rate Pill */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/70 px-3 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Burn rate: </span>
            <span className="text-slate-200 font-semibold">{effectiveHourlyBurnKWh.toFixed(2)} kW/h</span>
          </div>
        </div>

      </div>

      {/* Quick Human-Centered What-If Actions */}
      <div className="mt-2 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="text-xs font-medium text-slate-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Action Simulator (Tap to see instant time extension):</span>
          </span>
          <span className="text-[11px] text-slate-500">Live recalculation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Quick toggle 1: AC */}
          {acAppliance && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleAppliance(acAppliance.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs cursor-pointer ${
                acAppliance.isActive
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 hover:bg-rose-900/40'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              <div className="truncate pr-2">
                <span className="font-semibold block truncate">
                  {acAppliance.isActive ? 'Turn Off 1.5HP AC' : 'Turn On 1.5HP AC'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {acAppliance.isActive ? 'Adds +12h 40m runtime' : 'Consumes ~0.98 kW/h'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                acAppliance.isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {acAppliance.isActive ? 'ON' : 'OFF'}
              </span>
            </button>
          )}

          {/* Quick toggle 2: Pump water */}
          {pumpAppliance && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleAppliance(pumpAppliance.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs cursor-pointer ${
                pumpAppliance.isActive
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:bg-amber-900/40'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="truncate pr-2">
                <span className="font-semibold block truncate">Water Pump (Borehole)</span>
                <span className="text-[10px] text-slate-400">
                  {pumpAppliance.isActive ? 'Pumping now (750W)' : 'Run 20m tank fill'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                pumpAppliance.isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-400'
              }`}>
                {pumpAppliance.isActive ? 'RUNNING' : 'STANDBY'}
              </span>
            </button>
          )}

          {/* Quick action 3: Power Safety Net / Health Safeguard */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSafetyNet();
            }}
            className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30 text-amber-300 text-left transition-all flex items-center justify-between text-xs cursor-pointer"
          >
            <div className="truncate pr-2">
              <span className="font-semibold block truncate flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Power Safety Net</span>
              </span>
              <span className="text-[10px] text-slate-400">
                15 kWh zero-interest advance
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Action Strip: Top Up Now & Health Protection modal trigger */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenHealthModal();
            }}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Configure Health Cold-Chain</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenTopUp();
          }}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
        >
          <span>Purchase Prepaid Token</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
