import React from 'react';
import { Clock, Sliders, Sparkles, ShieldAlert, Radio } from 'lucide-react';
import { sound } from '../utils/audio';

interface BottomTabBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  healthProtected: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onTabChange,
  healthProtected,
}) => {
  const tabs = [
    { id: 'forecast', label: 'Forecast', icon: Clock },
    { id: 'appliances', label: 'Coach', icon: Sliders },
    { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles },
    { id: 'wallet', label: 'Top-Up', icon: Sparkles },
    { id: 'health', label: 'Lifeline', icon: ShieldAlert, hasBadge: healthProtected },
    { id: 'community', label: 'Grid', icon: Radio },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-1 sm:px-4 py-1.5 lg:hidden pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id);
              }}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center relative transition-all rounded-xl py-1 cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
