import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Sliders, 
  Sparkles, 
  Radio, 
  Sun, 
  HeartHandshake, 
  ArrowRight, 
  X,
  Compass,
  Camera,
  FileCheck,
  ShieldAlert,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const handleStart = (tab = 'forecast') => {
    sound.playTokenSuccess();
    try {
      localStorage.setItem('hasSeenPowerPulseWelcome', 'true');
    } catch {
      // Local storage unavailable
    }
    onSelectTab(tab);
    onClose();
  };

  const aiCapabilities = [
    {
      title: 'Multimodal Meter Vision',
      badge: 'Gemini 3.8 Flash',
      icon: Camera,
      color: 'emerald',
      description: 'Zero-friction optical scanner parsing units, tamper status, STS tokens, and serial numbers directly from prepaid LCD screens, even through dust, glare, or cracked glass.',
    },
    {
      title: '"Survive Till Payday" Copilot',
      badge: 'Demand-Response',
      icon: Sliders,
      color: 'teal',
      description: 'Calculates exact hourly load-shedding schedules and non-essential appliance cutoffs so your remaining balance stretches comfortably until your next income or payday.',
    },
    {
      title: 'Regulatory Tariff & Overbilling Auditor',
      badge: 'Dispute Shield',
      icon: FileCheck,
      color: 'cyan',
      description: 'Audits your rate per kWh against official regulatory orders (NERC Bands A–E in Nigeria, EPRA tiers in Kenya, Eskom, ECG, PURC) and drafts formal dispute letters with legal citations.',
    },
    {
      title: 'Life-Critical Cold-Chain Preservation',
      badge: 'Health Defense',
      icon: ShieldAlert,
      color: 'amber',
      description: 'Predicts thermal decay curves for refrigerated insulin, pediatric vaccines, and life-support ventilators, automatically triggering emergency caregiver dispatch before critical thresholds.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header with Executive Gradient */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/50 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[1.5px] shadow-lg shadow-emerald-950/50 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-display tracking-tight">
                  Welcome to Power<span className="text-emerald-400">Pulse</span>
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  AI-Powered
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold">
                  IDEO Human-Centered
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Your intelligent household energy companion & health-protecting electricity operating system
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close welcome modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Executive Overview */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-slate-200 mb-1">
                <strong>PowerPulse</strong> turns prepaid electricity from a stressful, opaque expense into a predictable, health-protecting, and money-saving daily companion.
              </p>
              <p className="text-slate-400">
                Grounded in <strong>IDEO human-centered design principles</strong> and powered by <strong>Gemini 3.8 Flash</strong>, it anticipates blackouts, audits utility tariffs, protects medical supplies, and keeps your household in control.
              </p>
            </div>
          </div>

          {/* Dedicated Section: Utility-Grade AI Capabilities */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-teal-950/40 border border-emerald-500/35 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Global Utility AI Intelligence Suite</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Four high-impact AI capabilities calibrated for local & international electricity distributors:
                </p>
              </div>

              <button
                onClick={() => handleStart('ai-copilot')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-emerald-500/20 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Copilot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiCapabilities.map((ai, index) => {
                const Icon = ai.icon;
                return (
                  <div 
                    key={index} 
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-white font-display">
                          {ai.title}
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full font-semibold shrink-0">
                        {ai.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {ai.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Pillars Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Core Human-Centered Pillars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>1. Predictive Balance</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time runtime forecast based on active appliance load to stop sudden blackouts.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>2. Health Lifeline</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Locks dedicated units for insulin, CPAP, and vaccines with caregiver SMS triggers.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>3. Smart Wallet</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Micro-vend prepaid units, generate instant STS tokens, and split bills easily.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                  <Radio className="w-4 h-4 shrink-0" />
                  <span>4. Community Radar</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Feeder fault reporting, restored supply verification, and solar sharing beacons.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs">
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span>5. Power Safety Net</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  15 kWh zero-interest emergency advance for when banking apps are temporarily down.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-yellow-400 font-semibold text-xs">
                  <Sun className="w-4 h-4 shrink-0" />
                  <span>6. Solar Architect</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculate inverter and battery capacity to permanently replace petrol generator noise.
                </p>
              </div>
            </div>
          </div>

          {/* Where to Start Guide (3 Quick Steps) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Where to Start in 3 Simple Steps</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-white">Verify Your Utility & Scan Meter:</strong> Select your country and distribution company (e.g. <strong>Port Harcourt PHED</strong> or any of Nigeria's 11 DisCos, or switch to Kenya KPLC, Eskom, ECG, BESCOM, US, UK). Tap <strong>"Scan LCD"</strong> on the meter card to test the multimodal AI scanner.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-white">Run AI "Survive Till Payday" Demand-Response:</strong> Open the <strong>"AI Copilot"</strong> tab or the <strong>"Appliance Coach"</strong> to input your target payday and get automated hourly load-shedding recommendations.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-white">Safeguard Medicine & Audit Your Tariff:</strong> Enable medical cold-chain buffers for insulin or sensitive medication and run the AI Tariff Auditor to detect overbilling.
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Creator Credit */}
          <div className="pt-2 text-center text-[11px] text-slate-500 font-mono">
            Conceived, Designed & Developed by <strong className="text-slate-200 font-semibold">Samuel Peter</strong> · PowerPulse™
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => handleStart('ai-copilot')}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer order-2 sm:order-1"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Explore AI Copilot Demo</span>
          </button>

          <button
            onClick={() => handleStart('forecast')}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:from-emerald-300 hover:to-amber-200 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
          >
            <span>Start Exploring PowerPulse</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </div>
  );
};
