import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Sun, 
  BatteryCharging, 
  Plus, 
  Sparkles, 
  X, 
  Send,
  Navigation
} from 'lucide-react';
import { CommunityOutageReport, NigeriaDisco } from '../types/energy';
import { sound } from '../utils/audio';

interface CommunityRadarProps {
  reports: CommunityOutageReport[];
  onUpvoteReport: (id: string) => void;
  onAddReport: (report: CommunityOutageReport) => void;
  currentDisco?: NigeriaDisco;
}

export const CommunityRadar: React.FC<CommunityRadarProps> = ({
  reports,
  onUpvoteReport,
  onAddReport,
  currentDisco,
}) => {
  const [filter, setFilter] = useState<'all' | 'outage' | 'restored' | 'solar_hub_open'>('all');
  const [isReporting, setIsReporting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newStatus, setNewStatus] = useState<CommunityOutageReport['status']>('outage');
  const [newHasBeacon, setNewHasBeacon] = useState(false);

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter((r) => r.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArea.trim()) return;

    sound.playClick();
    const rep: CommunityOutageReport = {
      id: `rep-${Date.now()}`,
      neighborhood: 'Local Ward / Estate',
      area: newArea.trim(),
      status: newStatus,
      title: newTitle.trim(),
      details: newDetails.trim() || 'Verified by neighborhood contributor.',
      reportedMinutesAgo: 1,
      upvotes: 1,
      hasSolarBeacon: newHasBeacon,
    };

    onAddReport(rep);
    setNewTitle('');
    setNewArea('');
    setNewDetails('');
    setIsReporting(false);
  };

  const getStatusBadge = (status: CommunityOutageReport['status']) => {
    switch (status) {
      case 'restored':
        return (
          <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Grid Restored</span>
          </span>
        );
      case 'outage':
        return (
          <span className="text-[11px] font-mono font-semibold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Blackout Confirmed</span>
          </span>
        );
      case 'solar_hub_open':
        return (
          <span className="text-[11px] font-mono font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sun className="w-3 h-3" />
            <span>Neighbor Solar Hub</span>
          </span>
        );
      case 'generator_high_noise':
        return (
          <span className="text-[11px] font-mono font-semibold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            <span>Heavy Generator Fumes</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-400">
            Transformer Alert
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Community Grid & Reliability Radar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              "Is it just my house, or the whole street?"
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Crowdsourced transformer status, disco feeder updates, and solar power-sharing beacons
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsReporting(!isReporting);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:from-cyan-400 hover:to-emerald-300 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Report Outage / Surge</span>
          </button>
        </div>

        {/* Feeder Status Overview Strip */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Your Local Feeder:</span>
            <span className="font-mono text-white font-bold">
              {currentDisco ? currentDisco.feederSample : 'Trans-Amadi 33kV Feeder #2 (PHED)'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Grid Reliability: <strong className="text-emerald-400">88.4% this week</strong></span>
            <span>·</span>
            <span>Est. Voltage: <strong className="text-white">228V (Stable)</strong></span>
          </div>
        </div>
      </div>

      {/* Report Form Inset */}
      {isReporting && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Broadcast Street Report</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status Type</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as CommunityOutageReport['status'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="outage">Outage / Blackout</option>
                <option value="restored">Grid Restored</option>
                <option value="solar_hub_open">Neighbor Solar Beacon (Free Charging)</option>
                <option value="generator_high_noise">Excessive Generator Noise/Fumes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Street / Feeder Pillar</label>
              <input
                type="text"
                required
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="e.g. Isaac John St / Transformer #4"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Report Headline</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Light went off suddenly 10 mins ago"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Additional details (Optional)</label>
            <textarea
              rows={2}
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="Mention if wires tripped, technicians are around, or if offering phone charging to neighbors."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {newStatus === 'solar_hub_open' && (
            <label className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30">
              <input
                type="checkbox"
                checked={newHasBeacon}
                onChange={(e) => setNewHasBeacon(e.target.checked)}
                className="accent-amber-400"
              />
              <span>I am offering free device charging / medical battery support from my solar inverter.</span>
            </label>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Street Feed</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => {
            sound.playClick();
            setFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setFilter('outage');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filter === 'outage'
              ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Outages
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setFilter('restored');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filter === 'restored'
              ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Restored Supply
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setFilter('solar_hub_open');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filter === 'solar_hub_open'
              ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Solar Beacons
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={`p-4 rounded-2xl border transition-all ${
              report.hasSolarBeacon
                ? 'bg-gradient-to-r from-amber-950/30 to-slate-900/90 border-amber-500/40'
                : report.isOfficialFeederAlert
                ? 'bg-gradient-to-r from-emerald-950/30 to-slate-900/90 border-emerald-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(report.status)}
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {report.area}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {report.reportedMinutesAgo}m ago
              </span>
            </div>

            <h4 className="text-sm font-bold text-white">
              {report.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {report.details}
            </p>

            {/* Bottom Row: Neighbor confirmations & Upvotes */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span>{report.neighborhood}</span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onUpvoteReport(report.id);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Confirm ({report.upvotes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
