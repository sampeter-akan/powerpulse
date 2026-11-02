import React from 'react';
import { Zap, Volume2, VolumeX, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { CurrencyConfig, CountryProfile, UtilityProvider } from '../types/energy';
import { COUNTRY_PROFILES } from '../data/mockData';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currency: CurrencyConfig;
  onCurrencyChange: (currency: CurrencyConfig) => void;
  isMobileFrame?: boolean;
  onToggleMobileFrame?: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTopUp?: () => void;
  onOpenHealthSafeguard: () => void;
  onOpenWelcome: () => void;
  healthProtected: boolean;
  currentCountry: CountryProfile;
  currentUtility: UtilityProvider;
  onSelectCountry: (country: CountryProfile) => void;
  onSelectUtility: (utility: UtilityProvider) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currency,
  onCurrencyChange,
  isSoundEnabled,
  onToggleSound,
  onOpenHealthSafeguard,
  onOpenWelcome,
  healthProtected,
  currentCountry,
  currentUtility,
  onSelectCountry,
  onSelectUtility,
}) => {
  const navTabs = [
    { id: 'forecast', shortLabel: 'Balance', fullLabel: 'Power Balance' },
    { id: 'appliances', shortLabel: 'Coach', fullLabel: 'Appliance Coach' },
    { id: 'community', shortLabel: 'Community', fullLabel: 'Community Grid' },
    { id: 'solar', shortLabel: 'Solar', fullLabel: 'Solar Planner' },
    { id: 'wallet', shortLabel: 'Wallet', fullLabel: 'Tokens & Wallet' },
    { id: 'ai-copilot', shortLabel: 'AI Copilot', fullLabel: 'AI Copilot', isAi: true },
  ];

  return (
    <header className="w-full border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 w-full">
        
        {/* Zone 1: Brand Wordmark & Subtitle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[1px] shadow-lg shadow-emerald-950/50 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <button
            onClick={() => onTabChange('forecast')}
            className="text-left group cursor-pointer focus:outline-none flex flex-col justify-center"
          >
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display group-hover:text-emerald-400 transition-colors leading-none">
              Power<span className="text-emerald-400">Pulse</span>
            </span>
            <span className="text-[8.5px] font-medium tracking-wider text-emerald-400/90 font-sans block mt-1 leading-none whitespace-nowrap">
              Household Energy Companion
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean Segmented Tab Pills, Fits layout on lg & xl without overflowing) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`whitespace-nowrap transition-all px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
                  tab.isAi
                    ? isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40'
                    : isActive
                    ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.isAi && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="2xl:hidden">{tab.shortLabel}</span>
                <span className="hidden 2xl:inline">{tab.fullLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Regional Utility Switchers & Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Dropdown 1: Country Switcher (Inline select, synchronized with global state) */}
          <div className="relative">
            <select
              value={currentCountry.id}
              onChange={(e) => {
                const found = COUNTRY_PROFILES.find((c) => c.id === e.target.value);
                if (found) onSelectCountry(found);
              }}
              className="appearance-none bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 text-white text-xs font-semibold rounded-lg pl-2 pr-5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm transition-colors max-w-[105px] sm:max-w-[125px] truncate"
              aria-label="Select Country"
              title={`Active Country: ${currentCountry.name} (${currentCountry.currency.code})`}
            >
              {COUNTRY_PROFILES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.flag} {c.id.toUpperCase()} ({c.currency.symbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-emerald-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Dropdown 2: Regional Utility Provider Switcher (Aligned with active country) */}
          <div className="relative">
            <select
              value={currentUtility.id}
              onChange={(e) => {
                const found = currentCountry.utilities.find((u) => u.id === e.target.value);
                if (found) onSelectUtility(found);
              }}
              className="appearance-none bg-emerald-950/40 border border-emerald-500/35 hover:border-emerald-500/70 text-emerald-300 text-xs font-semibold rounded-lg pl-2 pr-5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm transition-colors max-w-[110px] sm:max-w-[145px] truncate"
              aria-label={`Select Utility Provider for ${currentCountry.name}`}
              title={`Active Utility: ${currentUtility.name} · Default Feeder: ${currentUtility.defaultFeeder}`}
            >
              {currentCountry.utilities.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                  {u.shortCode} - {u.name.replace(/Electricity Disco|Electricity Distribution Company|Electricity Company of Ghana|Prepaid|Direct/gi, '').trim()}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-emerald-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Health Shield Indicator Quick Link (shows when medical safeguard enabled) */}
          {healthProtected && (
            <button
              onClick={onOpenHealthSafeguard}
              title="Health Protection Active (Insulin / Medical Reserve)"
              className="p-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-400 hover:bg-teal-900/40 transition-colors cursor-pointer"
              aria-label="Health Protection Safeguard"
            >
              <ShieldAlert className="w-4 h-4 text-teal-400 animate-pulse" />
            </button>
          )}

          {/* Welcome Guide & Tour Button */}
          <button
            onClick={onOpenWelcome}
            title="Welcome Guide & Overview"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-emerald-300 hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Open Welcome Guide"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Audio Feedback Toggle */}
          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Sound cues enabled' : 'Sound muted'}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle sound feedback"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
