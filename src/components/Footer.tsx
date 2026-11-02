import React from 'react';
import { Zap, HelpCircle, Compass, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenWelcome: () => void;
  onOpenIdeo: () => void;
  currentDiscoName: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenWelcome,
  onOpenIdeo,
  currentDiscoName,
}) => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/90 text-slate-400 text-xs py-8 px-4 sm:px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Trademark */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-3.5 h-3.5 fill-emerald-400/20" />
            </div>
            <span className="font-bold text-white font-display text-sm tracking-tight">
              Power<span className="text-emerald-400">Pulse</span>™
            </span>
          </div>

          <span className="hidden sm:inline text-slate-700">·</span>

          <span className="text-slate-400 text-[11px]">
            Active Grid: <strong className="text-slate-200">{currentDiscoName}</strong>
          </span>
        </div>

        {/* Quick Navigational Modals */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => {
              sound.playClick();
              onOpenWelcome();
            }}
            className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Welcome Tour</span>
          </button>

          <span className="text-slate-700">·</span>

          <button
            onClick={() => {
              sound.playClick();
              onOpenIdeo();
            }}
            className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>IDEO Design Pillars</span>
          </button>
        </div>

        {/* Copyright & Creator Credit */}
        <div className="text-center sm:text-right text-[11px] text-slate-500 leading-normal font-mono">
          <div>
            © 2026 PowerPulse™. Conceived, Designed & Developed by <strong className="text-slate-300 font-semibold">Samuel Peter</strong>.
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            Human-Centered Energy & Health Protection Operating System. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
