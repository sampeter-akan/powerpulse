import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Sliders, 
  Sparkles, 
  Radio, 
  Sun, 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  Compass, 
  HeartHandshake, 
  Camera, 
  Wifi, 
  BatteryMedium, 
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { Header } from './components/Header';
import { BalanceForecastCard } from './components/BalanceForecastCard';
import { ApplianceCoach } from './components/ApplianceCoach';
import { CommunityRadar } from './components/CommunityRadar';
import { SolarPlanner } from './components/SolarPlanner';
import { WalletHistoryView } from './components/WalletHistoryView';
import { MeterPhotoScannerModal } from './components/MeterPhotoScannerModal';
import { HealthProtectionModal } from './components/HealthProtectionModal';
import { TopUpWalletModal } from './components/TopUpWalletModal';
import { SafetyNetModal } from './components/SafetyNetModal';
import { IdeoDesignModal } from './components/IdeoDesignModal';
import { WelcomeModal } from './components/WelcomeModal';
import { Footer } from './components/Footer';
import { BottomTabBar } from './components/BottomTabBar';
import { AiGridCopilot } from './components/AiGridCopilot';

import { 
  INITIAL_METER, 
  INITIAL_APPLIANCES, 
  INITIAL_HEALTH_SAFEGUARD, 
  INITIAL_OUTAGE_REPORTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SAFETY_NET,
  NIGERIA_DISCOS,
  COUNTRY_PROFILES
} from './data/mockData';
import { CURRENCIES, formatCurrency, calculateTimeRemaining } from './utils/formatters';
import { sound } from './utils/audio';
import { 
  Appliance, 
  CurrencyConfig, 
  HealthSafeguard, 
  CommunityOutageReport, 
  TopUpTransaction, 
  NigeriaDisco,
  CountryProfile,
  UtilityProvider
} from './types/energy';

export default function App() {
  // Application State
  const [currentCountry, setCurrentCountry] = useState<CountryProfile>(COUNTRY_PROFILES[0]); // Default: Nigeria
  const [currentUtility, setCurrentUtility] = useState<UtilityProvider>(COUNTRY_PROFILES[0].utilities[0]); // Default: PHED
  const [currentDisco, setCurrentDisco] = useState<NigeriaDisco>(NIGERIA_DISCOS[0]); // Default: Port Harcourt PHED
  const [meter, setMeter] = useState(INITIAL_METER);
  const [appliances, setAppliances] = useState<Appliance[]>(INITIAL_APPLIANCES);
  const [healthSafeguard, setHealthSafeguard] = useState<HealthSafeguard>(INITIAL_HEALTH_SAFEGUARD);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.NGN);
  const [reports, setReports] = useState<CommunityOutageReport[]>(INITIAL_OUTAGE_REPORTS);
  const [transactions, setTransactions] = useState<TopUpTransaction[]>(INITIAL_TRANSACTIONS);
  const [safetyNet, setSafetyNet] = useState(INITIAL_SAFETY_NET);

  // UI Navigation & View State
  const [currentTab, setCurrentTab] = useState<string>('forecast');
  const [aiSubTab, setAiSubTab] = useState<'meter_vision' | 'survive_copilot' | 'bill_audit' | 'cold_chain'>('meter_vision');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isSafetyNetOpen, setIsSafetyNetOpen] = useState<boolean>(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [isIdeoModalOpen, setIsIdeoModalOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  // Show welcome modal on first visit
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('hasSeenPowerPulseWelcome');
      if (!hasSeen) {
        setIsWelcomeOpen(true);
      }
    } catch {
      setIsWelcomeOpen(true);
    }
  }, []);

  // Handle Country selection from the dropdown (UI refreshes immediately)
  const handleSelectCountry = (country: CountryProfile) => {
    sound.playTokenSuccess();
    const defaultUtil = country.utilities.find((u) => u.id === country.defaultUtilityId) || country.utilities[0];
    setCurrentCountry(country);
    setCurrentUtility(defaultUtil);
    setCurrency(country.currency);
    setReports(country.outageReports);
    setMeter((prev) => ({
      ...prev,
      provider: defaultUtil.name,
      tariffBand: defaultUtil.tariffBandSample,
    }));

    if (country.id === 'nigeria') {
      const foundDisco = NIGERIA_DISCOS.find((d) => d.id === defaultUtil.id) || NIGERIA_DISCOS[0];
      setCurrentDisco(foundDisco);
    }
  };

  // Handle Utility selection from the aligned dropdown
  const handleSelectUtility = (utility: UtilityProvider) => {
    sound.playClick();
    setCurrentUtility(utility);
    setMeter((prev) => ({
      ...prev,
      provider: utility.name,
      tariffBand: utility.tariffBandSample,
    }));

    if (currentCountry.id === 'nigeria') {
      const foundDisco = NIGERIA_DISCOS.find((d) => d.id === utility.id);
      if (foundDisco) setCurrentDisco(foundDisco);
    }
  };

  // Toggle appliance state
  const handleToggleAppliance = (id: string) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isActive: !app.isActive } : app))
    );
  };

  // Add custom appliance
  const handleAddAppliance = (newApp: Appliance) => {
    setAppliances((prev) => [newApp, ...prev]);
  };

  // Update meter units from scanner or manual
  const handleUpdateUnits = (newUnits: number) => {
    setMeter((prev) => ({
      ...prev,
      currentUnitsKWh: newUnits,
      lastUpdated: 'Just now (via LCD scan)',
    }));
  };

  // Success top-up
  const handleSuccessTopUp = (amount: number, kwh: number, tx: TopUpTransaction) => {
    setMeter((prev) => ({
      ...prev,
      currentUnitsKWh: prev.currentUnitsKWh + kwh,
      lastUpdated: 'Just now (Top-Up)',
    }));
    setTransactions((prev) => [tx, ...prev]);

    // If safety net advance was active, automatically settle it transparently
    if (safetyNet.hasActiveAdvance) {
      setSafetyNet((prev) => ({
        ...prev,
        hasActiveAdvance: false,
        currentAdvanceKWh: 0,
      }));
    }
  };

  // Activate Safety Net
  const handleActivateSafetyNet = (kwh: number) => {
    setMeter((prev) => ({
      ...prev,
      currentUnitsKWh: prev.currentUnitsKWh + kwh,
      lastUpdated: 'Just now (Safety Net Advance)',
    }));
    setSafetyNet((prev) => ({
      ...prev,
      hasActiveAdvance: true,
      currentAdvanceKWh: kwh,
    }));
  };

  // Upvote community report
  const handleUpvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Add new report
  const handleAddReport = (newRep: CommunityOutageReport) => {
    setReports((prev) => [newRep, ...prev]);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setIsSoundEnabled(next);
  };

  // Render current active tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'appliances':
        return (
          <ApplianceCoach
            appliances={appliances}
            currency={currency}
            onToggleAppliance={handleToggleAppliance}
            onAddAppliance={handleAddAppliance}
          />
        );
      case 'community':
        return (
          <CommunityRadar
            reports={reports}
            onUpvoteReport={handleUpvoteReport}
            onAddReport={handleAddReport}
            currentDisco={currentDisco}
          />
        );
      case 'solar':
        return <SolarPlanner appliances={appliances} currency={currency} />;
      case 'wallet':
        return (
          <WalletHistoryView
            transactions={transactions}
            safetyNet={safetyNet}
            currency={currency}
            meterNumber={meter.meterNumber}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenSafetyNet={() => setIsSafetyNetOpen(true)}
            paymentShortcuts={currentCountry.paymentShortcuts}
            countryName={currentCountry.name}
          />
        );
      case 'ai-copilot':
        return (
          <AiGridCopilot
            currentCountry={currentCountry}
            currentUtility={currentUtility}
            currency={currency}
            currentBalanceKwh={meter.currentUnitsKWh}
            onUpdateBalance={(newBal) => {
              setMeter((prev) => ({
                ...prev,
                currentUnitsKWh: newBal,
                lastUpdated: 'Just now (AI Meter Vision)',
              }));
            }}
            activeAppliances={appliances}
            healthSafeguard={healthSafeguard}
            onOpenHealthModal={() => setIsHealthModalOpen(true)}
            initialSubTab={aiSubTab}
          />
        );
      case 'health':
        // When clicked from mobile bottom bar
        return (
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-teal-500/30 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Health Protection Lifeline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Medical Cold-Chain & Vulnerability Shield
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Currently protecting: <strong>{healthSafeguard.medicalItem}</strong>
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Locked Medical Buffer:</span>
                  <span className="font-mono font-bold text-teal-300">{healthSafeguard.reserveKWh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Caregiver Contact:</span>
                  <span className="font-medium text-white">{healthSafeguard.caregiverName} ({healthSafeguard.caregiverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alert Trigger Threshold:</span>
                  <span className="font-mono text-amber-300">{healthSafeguard.alertThresholdHours} hours before zero</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setIsHealthModalOpen(true)}
                  className="px-4 py-2.5 bg-teal-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-300 transition-all cursor-pointer"
                >
                  Adjust Medical Safeguards
                </button>
              </div>
            </div>
          </div>
        );
      case 'forecast':
      default:
        return (
          <div className="space-y-6">
            {/* Primary Balance Forecast Hero */}
            <BalanceForecastCard
              meter={meter}
              currency={currency}
              appliances={appliances}
              healthSafeguard={healthSafeguard}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              onOpenSafetyNet={() => setIsSafetyNetOpen(true)}
              onOpenHealthModal={() => setIsHealthModalOpen(true)}
              onToggleAppliance={handleToggleAppliance}
              isMobileFrame={isMobileFrame}
              onToggleMobileFrame={() => {
                sound.playClick();
                setIsMobileFrame(!isMobileFrame);
              }}
              onOpenTariffAudit={() => {
                sound.playClick();
                setAiSubTab('bill_audit');
                setCurrentTab('ai-copilot');
              }}
            />

            {/* Two-Column Auxiliary Intelligence Split on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Quick Appliance Consumption Snapshot */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Active Appliance Load
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentTab('appliances');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all ({appliances.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {appliances.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${app.isActive ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                        <span className="font-medium text-slate-200 truncate">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-400 text-[11px]">{app.watts}W</span>
                        <button
                          onClick={() => {
                            sound.playClick();
                            handleToggleAppliance(app.id);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                            app.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {app.isActive ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Grid Pulse Snapshot */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Neighborhood Reliability Radar
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentTab('community');
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Live Feed</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {reports.slice(0, 2).map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium text-cyan-300">{rep.area}</span>
                        <span className="font-mono text-slate-500">{rep.reportedMinutesAgo}m ago</span>
                      </div>
                      <p className="text-slate-300 font-semibold truncate">{rep.title}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px]">1 Community Solar Beacon active nearby</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentTab('community');
                    }}
                    className="font-bold underline text-[11px] text-amber-300"
                  >
                    View Map
                  </button>
                </div>
              </div>

            </div>

            {/* Global Utility AI Intelligence Suite Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Global Utility AI Copilot (Gemini 3.8 Flash)</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-1">
                    Utility-Grade
                  </span>
                </div>
                <h4 className="text-base font-bold text-white font-display">
                  Audited & Synchronized with {currentUtility.name} ({currentCountry.name})
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Inspect meter LCD displays with multimodal vision, optimize peak-shaving to avoid midnight blackouts, audit official tariff compliance, and calculate life-support cold chain thermal decay.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentTab('ai-copilot');
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Copilot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* IDEO Human-Centered Design Callout Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>IDEO Human-Centered Design Principles</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  Why PowerPulse is built around human lived realities
                </h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Addressing unpredictable blackouts, medical cold-chain fragility, bill anxiety, and informal community power sharing across Nigeria and the globe.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsIdeoModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                Explore Design Story
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      
      {/* Top Navigation Bar with DisCo selection & Welcome Tour */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          sound.playClick();
          setCurrentTab(tab);
        }}
        currency={currency}
        onCurrencyChange={(c) => {
          sound.playClick();
          setCurrency(c);
        }}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => {
          sound.playClick();
          setIsMobileFrame(!isMobileFrame);
        }}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTopUp={() => {
          sound.playClick();
          setIsTopUpOpen(true);
        }}
        onOpenHealthSafeguard={() => {
          sound.playClick();
          setIsHealthModalOpen(true);
        }}
        onOpenWelcome={() => {
          sound.playClick();
          setIsWelcomeOpen(true);
        }}
        healthProtected={healthSafeguard.enabled}
        currentCountry={currentCountry}
        currentUtility={currentUtility}
        onSelectCountry={handleSelectCountry}
        onSelectUtility={handleSelectUtility}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-24 lg:pb-12 pt-4 sm:pt-6">
        {isMobileFrame ? (
          /* Realistic Smartphone Frame Mockup Preview */
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="w-full rounded-[44px] border-[8px] border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative">
              
              {/* Phone Speaker & Dynamic Island / Camera cutout */}
              <div className="pt-3 pb-1 px-6 bg-slate-950 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
                <span className="font-semibold text-white">9:41</span>
                
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 rounded-full bg-black border border-slate-800/80 flex items-center justify-center gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-mono tracking-tight">{currentUtility.shortCode}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <BatteryMedium className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Phone Content Screen */}
              <div className="p-4 overflow-y-auto max-h-[720px] scrollbar-thin">
                {renderTabContent()}
              </div>

              {/* Phone Bottom Home Indicator Bar */}
              <div className="py-2 flex justify-center bg-slate-950">
                <div className="w-32 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>

            <div className="text-center mt-3 text-xs text-slate-500 font-mono">
              Mobile Touch Viewport Preview · 390px
            </div>
          </div>
        ) : (
          /* Expansive Fluid Responsive Desktop / Tablet Layout */
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Global Executive Footer with Samuel Peter Creator Credit */}
      <Footer
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenIdeo={() => setIsIdeoModalOpen(true)}
        currentDiscoName={`${currentCountry.flag} ${currentUtility.name}`}
      />

      {/* Mobile Fixed Thumb Navigation Bar */}
      <BottomTabBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          sound.playClick();
          setCurrentTab(tab);
        }}
        healthProtected={healthSafeguard.enabled}
      />

      {/* Interactive Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      <MeterPhotoScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        currentUnits={meter.currentUnitsKWh}
        onUpdateUnits={handleUpdateUnits}
        onOpenAiVision={() => {
          setIsScannerOpen(false);
          setCurrentTab('ai-copilot');
        }}
      />

      <TopUpWalletModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        currency={currency}
        meterNumber={meter.meterNumber}
        onSuccessTopUp={handleSuccessTopUp}
      />

      <SafetyNetModal
        isOpen={isSafetyNetOpen}
        onClose={() => setIsSafetyNetOpen(false)}
        safetyNet={safetyNet}
        currency={currency}
        onActivateSafetyNet={handleActivateSafetyNet}
      />

      <HealthProtectionModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        safeguard={healthSafeguard}
        onSaveSafeguard={(updated) => setHealthSafeguard(updated)}
      />

      <IdeoDesignModal
        isOpen={isIdeoModalOpen}
        onClose={() => setIsIdeoModalOpen(false)}
      />

    </div>
  );
}
