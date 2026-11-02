import React, { useState } from 'react';
import { 
  Tv, 
  Wind, 
  Refrigerator, 
  Droplet, 
  Wifi, 
  Lightbulb, 
  Plus, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Info, 
  Power, 
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';
import { Appliance, CurrencyConfig } from '../types/energy';
import { formatCurrency } from '../utils/formatters';
import { sound } from '../utils/audio';

interface ApplianceCoachProps {
  appliances: Appliance[];
  currency: CurrencyConfig;
  onToggleAppliance: (id: string) => void;
  onAddAppliance: (appliance: Appliance) => void;
}

export const ApplianceCoach: React.FC<ApplianceCoachProps> = ({
  appliances,
  currency,
  onToggleAppliance,
  onAddAppliance,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState('500');
  const [newHours, setNewHours] = useState('4');
  const [newCategory, setNewCategory] = useState<Appliance['category']>('kitchen');

  // Categorization helpers
  const categories = [
    { id: 'all', label: 'All Appliances' },
    { id: 'cooling', label: 'Cooling & AC' },
    { id: 'kitchen', label: 'Kitchen & Fridges' },
    { id: 'water', label: 'Water Pumping' },
    { id: 'work', label: 'Work & Wi-Fi' },
  ];

  const filteredAppliances = filterCategory === 'all'
    ? appliances
    : appliances.filter((a) => a.category === filterCategory);

  // Total daily cost across active appliances
  const totalDailyKWh = appliances
    .filter((a) => a.isActive)
    .reduce((sum, a) => sum + (a.watts * a.dailyHours) / 1000, 0);

  const totalMonthlyCost = totalDailyKWh * 30 * currency.ratePerKWh;

  // Icon mapping
  const getApplianceIcon = (app: Appliance) => {
    switch (app.category) {
      case 'cooling':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'kitchen':
        return <Refrigerator className="w-4 h-4 text-emerald-400" />;
      case 'water':
        return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'work':
        return <Wifi className="w-4 h-4 text-amber-400" />;
      case 'entertainment':
        return <Tv className="w-4 h-4 text-purple-400" />;
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    sound.playClick();
    const app: Appliance = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      watts: parseInt(newWatts) || 300,
      dailyHours: parseFloat(newHours) || 4,
      isActive: true,
      priority: 'comfort',
    };

    onAddAppliance(app);
    setNewName('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Coach Header Summary Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Appliance Energy & Cost Coach</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Household Consumption Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live burn rates, daily costs, and targeted conservation insights
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <span className="text-xs text-slate-400">Monthly Projected Run:</span>
            <span className="text-xl sm:text-2xl font-black font-display text-white font-mono tabular-nums">
              {formatCurrency(totalMonthlyCost, currency)}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              ~{(totalDailyKWh * 30).toFixed(0)} kWh/month
            </span>
          </div>
        </div>

        {/* Coach Nudges & Actionable Savings Insights */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Smart AC Tuning</span>
              <p className="text-slate-400 mt-0.5 text-[11px]">
                Raising your bedroom AC setpoint from 18°C to 24°C reduces compressor burn by <strong>32%</strong>, saving approximately {formatCurrency(14000, currency)} per month.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Borehole Pumping Strategy</span>
              <p className="text-slate-400 mt-0.5 text-[11px]">
                Filling the overhead water tank in one 25-minute morning burst prevents 6 frequent start-up surges that chew through battery and prepaid credit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Add Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setFilterCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Appliance Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAddingNew(!isAddingNew);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Household Appliance</span>
        </button>
      </div>

      {/* Add Appliance Form Modal / Inset Drawer */}
      {isAddingNew && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white">Add New Appliance</h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Appliance Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Microwave Oven"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Power Rating (Watts)</label>
              <input
                type="number"
                required
                min="1"
                value={newWatts}
                onChange={(e) => setNewWatts(e.target.value)}
                placeholder="e.g. 800"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Daily Usage (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="24"
                required
                value={newHours}
                onChange={(e) => setNewHours(e.target.value)}
                placeholder="e.g. 2"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-xl"
            >
              Add to Coach
            </button>
          </div>
        </form>
      )}

      {/* Appliances List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAppliances.map((app) => {
          const dailyKWh = (app.watts * app.dailyHours) / 1000;
          const dailyCost = dailyKWh * currency.ratePerKWh;
          const monthlyCost = dailyCost * 30;

          return (
            <div
              key={app.id}
              className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                app.isActive
                  ? 'bg-slate-900/90 border-slate-800 shadow-md'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              {/* Top Row: Icon, Title & Power Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {getApplianceIcon(app)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-white">{app.name}</span>
                      {app.healthLinked && (
                        <span title="Insulin & Health Protected">
                          <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span>{app.watts} W</span>
                      <span>·</span>
                      <span>{app.dailyHours} hrs/day</span>
                    </div>
                  </div>
                </div>

                {/* State toggle switch */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onToggleAppliance(app.id);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                    app.isActive ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                  aria-label={`Toggle ${app.name}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      app.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[11px] text-slate-500 block">Daily Burn</span>
                  <span className="font-semibold text-slate-300">
                    {dailyKWh.toFixed(2)} kWh ({formatCurrency(dailyCost, currency)})
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Monthly Run</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(monthlyCost, currency)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
