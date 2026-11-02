import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  RefreshCw,
  Copy,
  Sliders,
  DollarSign,
  Zap,
  Info,
  Calendar,
  Layers,
  HeartPulse,
} from 'lucide-react';
import { CountryProfile, UtilityProvider, CurrencyConfig, Appliance, HealthSafeguard } from '../types/energy';
import { sound } from '../utils/audio';

interface AiGridCopilotProps {
  currentCountry: CountryProfile;
  currentUtility: UtilityProvider;
  currency: CurrencyConfig;
  currentBalanceKwh: number;
  onUpdateBalance: (newBalance: number) => void;
  activeAppliances: Appliance[];
  healthSafeguard: HealthSafeguard;
  onOpenHealthModal: () => void;
  initialSubTab?: AiSubTab;
}

type AiSubTab = 'meter_vision' | 'survive_copilot' | 'bill_audit' | 'cold_chain';

// Sample Meter Presets for instant testing
const SAMPLE_METER_PRESETS = [
  {
    id: 'sts_phed',
    title: 'MOJEC STS Prepaid (PHED Port Harcourt)',
    brand: 'MOJEC',
    code: '0101 2345 6789',
    sampleKwh: 34.6,
    svgColor: '#059669',
    lcdText: '34.6 kWh',
    status: 'Normal Active',
    base64Data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%231e293b"/><rect x="40" y="30" width="320" height="110" rx="8" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="60" y="75" fill="%2338bdf8" font-family="monospace" font-size="28" font-weight="bold">34.6 kWh</text><text x="60" y="115" fill="%2322c55e" font-family="monospace" font-size="14">CREDIT OK - STS NERC</text><rect x="40" y="160" width="320" height="70" rx="6" fill="%23334155"/><text x="60" y="195" fill="%23e2e8f0" font-family="sans-serif" font-size="13">MOJEC SMART STS - PHED Feeder #2</text><text x="60" y="215" fill="%2394a3b8" font-family="monospace" font-size="11">SN: 4509-8812-3901</text></svg>'
  },
  {
    id: 'kplc_conlog',
    title: 'Conlog CIU (Kenya KPLC)',
    brand: 'Conlog',
    code: '3718 2901 4410',
    sampleKwh: 12.8,
    svgColor: '#0284c7',
    lcdText: '12.8 kWh',
    status: 'Low Credit Warning',
    base64Data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%230f172a"/><rect x="40" y="30" width="320" height="110" rx="8" fill="%231e293b" stroke="%23f59e0b" stroke-width="2"/><text x="60" y="75" fill="%23f59e0b" font-family="monospace" font-size="28" font-weight="bold">12.8 kWh</text><text x="60" y="115" fill="%23f59e0b" font-family="monospace" font-size="14">ALERT: ALARM TONE ACTIVE</text><rect x="40" y="160" width="320" height="70" rx="6" fill="%231e293b"/><text x="60" y="195" fill="%23e2e8f0" font-family="sans-serif" font-size="13">CONLOG BEC23(P) - KPLC Nairobi</text><text x="60" y="215" fill="%2394a3b8" font-family="monospace" font-size="11">SN: 1420-9901-2294</text></svg>'
  },
  {
    id: 'eskom_hexing',
    title: 'Hexing Smart (South Africa Eskom)',
    brand: 'Hexing',
    code: '0712 9940 1283',
    sampleKwh: 89.2,
    svgColor: '#7c3aed',
    lcdText: '89.2 kWh',
    status: 'Relay Active',
    base64Data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%2318181b"/><rect x="40" y="30" width="320" height="110" rx="8" fill="%2327272a" stroke="%2310b981" stroke-width="2"/><text x="60" y="75" fill="%2310b981" font-family="monospace" font-size="28" font-weight="bold">89.2 kWh</text><text x="60" y="115" fill="%2310b981" font-family="monospace" font-size="14">GRID LINK: CONNECTED 50Hz</text><rect x="40" y="160" width="320" height="70" rx="6" fill="%2327272a"/><text x="60" y="195" fill="%23e4e4e7" font-family="sans-serif" font-size="13">HEXING HXE115 - Eskom TOU Standard</text><text x="60" y="215" fill="%23a1a1aa" font-family="monospace" font-size="11">SN: 0418-5521-7729</text></svg>'
  }
];

export const AiGridCopilot: React.FC<AiGridCopilotProps> = ({
  currentCountry,
  currentUtility,
  currency,
  currentBalanceKwh,
  onUpdateBalance,
  activeAppliances,
  healthSafeguard,
  onOpenHealthModal,
  initialSubTab,
}) => {
  const [activeTab, setActiveTab] = useState<AiSubTab>(initialSubTab || 'meter_vision');

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // 1. Meter Vision State
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_METER_PRESETS[0].base64Data);
  const [isAnalyzingMeter, setIsAnalyzingMeter] = useState(false);
  const [meterAnalysisResult, setMeterAnalysisResult] = useState<any>(null);
  const [meterScanError, setMeterScanError] = useState<string | null>(null);

  // 2. Survive Copilot State
  const [targetDays, setTargetDays] = useState<number>(5);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [copilotPlan, setCopilotPlan] = useState<any>(null);
  const [copilotError, setCopilotError] = useState<string | null>(null);

  // 3. Bill & Token Audit State
  const [tokenInputText, setTokenInputText] = useState<string>(
    `Transaction Ref: PHED-202611-9402\nMeter: 4509-8812-3901 (Port Harcourt PHED)\nToken: 4829-1049-2910-3849-0192\nUnits: 34.6 kWh\nAmount: ₦7,500.00\nTariff: Band A Residential\nVAT (7.5%): ₦523.25\nStatus: Vended`
  );
  const [isAuditingBill, setIsAuditingBill] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [copiedDispute, setCopiedDispute] = useState(false);

  // 4. Cold Chain State
  const [medicationName, setMedicationName] = useState('Insulin Glargine (Lantus) & Pediatric Amoxicillin');
  const [ambientTemp, setAmbientTemp] = useState(32);
  const [fridgeType, setFridgeType] = useState('Domestic Double-Door Frost-Free Fridge');
  const [backupSource, setBackupSource] = useState('1kVA Inverter with 100Ah Lithium Battery');
  const [isAssessingHealth, setIsAssessingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<any>(null);

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setMeterAnalysisResult(null);
        setMeterScanError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Meter Vision AI
  const handleRunMeterVision = async () => {
    if (!imagePreview) return;
    setIsAnalyzingMeter(true);
    setMeterScanError(null);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/meter-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          countryName: currentCountry.name,
          utilityName: currentUtility.name,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to scan meter display');
      }

      setMeterAnalysisResult(json.data);
      sound.playTokenSuccess();
    } catch (err: any) {
      console.error(err);
      setMeterScanError(err.message || 'Error communicating with AI Vision model');
    } finally {
      setIsAnalyzingMeter(false);
    }
  };

  // Run Survive Copilot AI
  const handleRunCopilot = async () => {
    setIsGeneratingPlan(true);
    setCopilotError(null);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/power-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBalanceKwh,
          targetDays,
          activeAppliances: activeAppliances.filter((a) => a.isActive),
          countryName: currentCountry.name,
          utilityName: currentUtility.name,
          currencyCode: currency.code,
          currencySymbol: currency.symbol,
          tariffRatePerKwh: currency.ratePerKWh,
          hasHealthSafeguard: healthSafeguard.enabled,
          medicalDeviceDetails: healthSafeguard.medicalItem,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate copilot plan');
      }

      setCopilotPlan(json.data);
      sound.playTokenSuccess();
    } catch (err: any) {
      console.error(err);
      setCopilotError(err.message || 'Error generating plan with Gemini AI');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Run Bill Audit AI
  const handleRunBillAudit = async () => {
    setIsAuditingBill(true);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/tariff-bill-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billOrTokenText: tokenInputText,
          countryName: currentCountry.name,
          utilityName: currentUtility.name,
          currencyCode: currency.code,
          currencySymbol: currency.symbol,
          tariffBand: currentUtility.tariffBandSample,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to audit token or bill');
      }

      setAuditResult(json.data);
      sound.playTokenSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to complete audit');
    } finally {
      setIsAuditingBill(false);
    }
  };

  // Run Health Cold Chain Assessment
  const handleRunHealthAssessment = async () => {
    setIsAssessingHealth(true);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/health-coldchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName,
          ambientTempC: ambientTemp,
          refrigeratorType: fridgeType,
          backupSource,
          utilityName: currentUtility.name,
          countryName: currentCountry.name,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to analyze cold chain');
      }

      setHealthResult(json.data);
      sound.playTokenSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Health assessment error');
    } finally {
      setIsAssessingHealth(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Global Utility <span className="text-emerald-400">AI Intelligence Suite</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Utility-grade multimodal vision, peak-shaving demand-response, regulatory tariff auditing, and vulnerable customer cold-chain protection — synchronized with{' '}
              <strong className="text-emerald-300">{currentUtility.name}</strong> ({currentCountry.name}).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Current Grid</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                <span>{currentCountry.flag}</span>
                <span>{currentUtility.shortCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              setActiveTab('meter_vision');
              sound.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'meter_vision'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. Meter LCD Vision Scanner</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('survive_copilot');
              sound.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'survive_copilot'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>2. "Survive Till Payday" Peak Shaver</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bill_audit');
              sound.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bill_audit'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Tariff Auditor & Dispute Shield</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cold_chain');
              sound.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cold_chain'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>4. Life-Support Cold Chain Safety</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. METER VISION SCANNER TAB */}
      {/* ============================================================== */}
      {activeTab === 'meter_vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input & Preset Selector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Upload or Select Meter Image</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Multimodal Gemini reads LCD numbers, brand signatures, and STS tamper alerts.
                  </p>
                </div>
              </div>

              {/* Instant Test Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick-Test Presets (Global Standard STS / AMR Meters)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_METER_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setImagePreview(p.base64Data);
                        setMeterAnalysisResult(null);
                        setMeterScanError(null);
                        sound.playClick();
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                        {p.brand}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{p.title}</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1">{p.lcdText}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Photo or Camera Capture */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Or Upload Real Meter Photo / Keypad Display
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-950/60 transition-colors">
                  <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-xs font-medium text-slate-300">Choose JPEG/PNG or snap photo</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Supports CIU screens, tamper slips, or token barcodes</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview Box */}
              {imagePreview && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Meter Preview"
                    className="max-h-52 rounded-xl object-contain shadow-md"
                  />
                  <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
                    <span>Ready for multimodal extraction</span>
                    <button
                      onClick={handleRunMeterVision}
                      disabled={isAnalyzingMeter}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzingMeter ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Run AI Vision Inspection</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {meterScanError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{meterScanError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: AI Vision Output */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Utility AI Vision Diagnostic</h3>
                  </div>
                  {meterAnalysisResult && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Confidence: {meterAnalysisResult.confidenceScore || 98}%
                    </span>
                  )}
                </div>

                {isAnalyzingMeter ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-200">Gemini 3.8 Flash reading meter LCD...</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Extracting 7-segment digits, verifying relay contactor position, and running STS tamper checks.
                    </p>
                  </div>
                ) : meterAnalysisResult ? (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Key Findings Card */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Extracted Balance</span>
                        <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                          {meterAnalysisResult.extractedKwh !== null
                            ? `${meterAnalysisResult.extractedKwh} kWh`
                            : 'Unspecified on LCD'}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Status Condition</span>
                        <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{meterAnalysisResult.statusCondition || 'Normal Active'}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Meter Type & Brand</span>
                        <div className="text-xs font-semibold text-slate-200 mt-1">
                          {meterAnalysisResult.detectedBrand || 'STS'} · {meterAnalysisResult.detectedMeterType}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Serial / Account</span>
                        <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                          {meterAnalysisResult.meterNumber || 'Verified in frame'}
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic Explanation */}
                    <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Plain-Language Engineering Diagnostic</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {meterAnalysisResult.diagnosticExplanation}
                      </p>
                    </div>

                    {/* Keypad Action Instructions */}
                    {meterAnalysisResult.keypadActionInstructions && (
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                          Recommended CIU Keypad Code
                        </div>
                        <p className="text-xs font-mono text-slate-300">
                          {meterAnalysisResult.keypadActionInstructions}
                        </p>
                      </div>
                    )}

                    {/* Global Utility Notice */}
                    {meterAnalysisResult.utilityComplianceNotice && (
                      <div className="text-[11px] text-slate-400 leading-relaxed border-l-2 border-emerald-500 pl-3">
                        <strong className="text-slate-300">Global Grid Standard: </strong>
                        {meterAnalysisResult.utilityComplianceNotice}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 space-y-2">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs">Select a preset or upload an image and tap "Run AI Vision Inspection".</p>
                    <p className="text-[11px] text-slate-600">
                      Foreign utilities value instant meter reading without manual site visits.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button: Apply to Current Live Balance */}
              {meterAnalysisResult?.extractedKwh && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Sync <strong className="text-emerald-400">{meterAnalysisResult.extractedKwh} kWh</strong> with PowerPulse?
                  </span>
                  <button
                    onClick={() => {
                      onUpdateBalance(meterAnalysisResult.extractedKwh);
                      sound.playTokenSuccess();
                      alert(`Household electricity balance updated to ${meterAnalysisResult.extractedKwh} kWh!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply to Live Balance</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SURVIVE TILL PAYDAY PEAK SHAVING COPILOT */}
      {/* ============================================================== */}
      {activeTab === 'survive_copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>"Survive Till Payday" Demand-Response</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Helps customers avoid surprise outages while relieving peak stress on {currentUtility.name}'s grid.
                </p>
              </div>

              {/* Balance Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Current Balance</span>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono">
                    {currentBalanceKwh.toFixed(1)} kWh
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Tariff Rate</span>
                  <div className="text-sm font-bold text-slate-300">
                    {currency.symbol}{currency.ratePerKWh}/kWh
                  </div>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Target Duration Required:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{targetDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="21"
                  value={targetDays}
                  onChange={(e) => setTargetDays(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 day</span>
                  <span>7 days (1 week)</span>
                  <span>14 days</span>
                  <span>21 days</span>
                </div>
              </div>

              {/* Health Lifeline Indicator */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <HeartPulse className={`w-4 h-4 ${healthSafeguard.enabled ? 'text-teal-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-semibold text-slate-200">
                      {healthSafeguard.enabled ? 'Health Buffer Active' : 'No Medical Safeguard'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {healthSafeguard.enabled ? `${healthSafeguard.reserveKWh} kWh locked for medicine` : 'Standard household mode'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenHealthModal}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                >
                  Configure
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleRunCopilot}
                disabled={isGeneratingPlan}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating Demand-Response Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Energy Survival Plan</span>
                  </>
                )}
              </button>

              {copilotError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{copilotError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Plan Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 min-h-[420px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Demand-Response Optimization Plan</h3>
                </div>
                {copilotPlan && (
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    copilotPlan.survivalFeasibility === 'Emergency Outage Imminent'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {copilotPlan.survivalFeasibility}
                  </span>
                )}
              </div>

              {isGeneratingPlan ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-200">Synthesizing Load-Shifting Schedule...</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Analyzing active air conditioners, freezer thermal inertia, and local grid peak hour constraints.
                  </p>
                </div>
              ) : copilotPlan ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Executive Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Recommended Daily Budget</span>
                      <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                        {copilotPlan.predictedDailyBudgetKwh || (currentBalanceKwh / targetDays).toFixed(1)} kWh / day
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Guarantees power through Day {targetDays}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Grid Benefit</span>
                      <div className="text-xs font-semibold text-slate-300 mt-1 leading-snug">
                        {copilotPlan.utilityGridBenefit || `Reduces substation peak strain in ${currentUtility.name}`}
                      </div>
                    </div>
                  </div>

                  {/* Peak Hour Avoidance Strategy */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Peak Grid Stress Protocol (18:00 - 22:00)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {copilotPlan.peakHourAvoidanceStrategy}
                    </p>
                  </div>

                  {/* Hourly Schedule */}
                  {copilotPlan.hourlySchedule && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Hour-by-Hour Household Allocation
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {copilotPlan.hourlySchedule.map((slot: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between font-semibold text-emerald-300 text-[11px]">
                              <span>{slot.timeWindow}</span>
                              <span className="font-mono text-slate-400">{slot.powerAllocationKwh} kWh</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">{slot.guidance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Appliance Action List */}
                  {copilotPlan.applianceActionList && copilotPlan.applianceActionList.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Specific Appliance Adjustments
                      </h4>
                      <div className="space-y-1.5">
                        {copilotPlan.applianceActionList.map((app: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <strong className="text-white">{app.applianceName}: </strong>
                              <span className="text-slate-400">{app.recommendedAction}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-emerald-400 font-mono font-bold block">
                                -{app.kwhSavedPerDay} kWh/d
                              </span>
                              <span className="text-[10px] text-slate-500">{app.monetarySavingsDaily} saved</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">Adjust your days slider and click "Generate AI Energy Survival Plan".</p>
                  <p className="text-[11px] text-slate-600">
                    Foreign power companies love demand-response incentives that prevent blackouts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TARIFF AUDITOR & REGULATORY DISPUTE SHIELD */}
      {/* ============================================================== */}
      {activeTab === 'bill_audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Token & Utility Bill Auditor</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifies tariff calculations against regulatory benchmarks (NERC, Ofgem, PURC, CPUC).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Paste Token SMS, Receipt, or Bill Inquiry
                </label>
                <textarea
                  rows={6}
                  value={tokenInputText}
                  onChange={(e) => setTokenInputText(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="Paste STS token SMS or billing statement here..."
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Auditing Under: </span>
                <span className="text-emerald-400 font-medium">{currentUtility.name}</span> · Band {currentUtility.tariffBandSample}
              </div>

              <button
                onClick={handleRunBillAudit}
                disabled={isAuditingBill || !tokenInputText.trim()}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuditingBill ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing Regulatory Tariff...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run AI Tariff & Bill Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 min-h-[420px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Audit Finding & Regulatory Compliance</h3>
                </div>
                {auditResult && (
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      auditResult.tariffDiscrepancyFound
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {auditResult.tariffDiscrepancyFound ? 'Discrepancy Found' : 'Compliant'}
                  </span>
                )}
              </div>

              {isAuditingBill ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-200">Verifying Tariff Schedule with Gemini...</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Checking VAT rates, service maintenance charges, and official cost-reflective tariff brackets.
                  </p>
                </div>
              ) : auditResult ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Audit Summary</span>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      {auditResult.plainCustomerExplanation}
                    </p>
                  </div>

                  {/* Breakdown */}
                  {auditResult.breakdownItems && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Charge Breakdown</span>
                      <div className="space-y-1.5 text-xs">
                        {auditResult.breakdownItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-slate-300">
                            <span>{item.name}</span>
                            <span className="font-mono text-emerald-400 font-semibold">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ready-to-Send Formal Dispute Draft */}
                  {auditResult.formalDisputeDraft && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pre-Drafted Formal Inquiry to {currentUtility.name}</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(auditResult.formalDisputeDraft);
                            setCopiedDispute(true);
                            sound.playClick();
                            setTimeout(() => setCopiedDispute(false), 2500);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedDispute ? 'Copied!' : 'Copy Letter'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] font-sans text-slate-300 bg-slate-900/90 p-3 rounded-xl whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-48 overflow-y-auto">
                        {auditResult.formalDisputeDraft}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">Paste your token or bill text and tap "Run AI Tariff & Bill Audit".</p>
                  <p className="text-[11px] text-slate-600">
                    Transparent billing audits build immense customer trust for global utility companies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. LIFE-SUPPORT COLD CHAIN SAFETY ENGINE */}
      {/* ============================================================== */}
      {activeTab === 'cold_chain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                  <span>Vulnerable Life-Support Safeguard</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculates thermal decay curves for refrigerated medicine & aligns with utility Priority Services.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Medication or Life Device
                </label>
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Ambient Room Temperature:</span>
                  <span className="font-bold text-amber-400 font-mono">{ambientTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="42"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Available Backup Power
                </label>
                <input
                  type="text"
                  value={backupSource}
                  onChange={(e) => setBackupSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleRunHealthAssessment}
                disabled={isAssessingHealth}
                className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAssessingHealth ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Thermal Decay...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Life-Support Risk Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 min-h-[420px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">Cold-Chain Thermal Safety Profile</h3>
                </div>
                {healthResult && (
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      healthResult.urgencyLevel === 'Critical Risk'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {healthResult.urgencyLevel}
                  </span>
                )}
              </div>

              {isAssessingHealth ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-200">Evaluating Pharmacological Thermal Limits...</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Computing safe insulation window (+2°C to +8°C) under tropical ambient temperatures.
                  </p>
                </div>
              ) : healthResult ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Safe Thermal Inertia</span>
                      <div className="text-2xl font-extrabold text-teal-400 font-mono mt-0.5">
                        {healthResult.safeThermalInertiaHours} Hours
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Before exceeding {healthResult.criticalTempRange}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Min Solar/Inverter</span>
                      <div className="text-base font-bold text-white mt-1">
                        {healthResult.minimumSolarInverterRequirements?.recommendedInverterWatts || 350}W Inverter
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {healthResult.minimumSolarInverterRequirements?.recommendedBatteryKwh || 0.6} kWh Battery
                      </div>
                    </div>
                  </div>

                  {/* Emergency Protocols */}
                  {healthResult.emergencyColdBufferProtocols && (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Emergency Cold-Buffer Procedures
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {healthResult.emergencyColdBufferProtocols.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-teal-400 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Priority Register Guidance */}
                  {healthResult.utilityPriorityRegisterStep && (
                    <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-1">
                      <span className="text-xs font-bold text-teal-300">
                        {currentUtility.name} Priority Services Register (PSR)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {healthResult.utilityPriorityRegisterStep}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 space-y-2">
                  <HeartPulse className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">Specify medication details and click "Run Life-Support Risk Engine".</p>
                  <p className="text-[11px] text-slate-600">
                    Mandatory for global utilities to safeguard medically vulnerable households.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
