import React, { useState } from 'react';
import { X, ShieldAlert, Heart, Phone, Bell, CheckCircle2, ShieldCheck, ThermometerSnowflake, Baby, Stethoscope } from 'lucide-react';
import { HealthSafeguard } from '../types/energy';
import { sound } from '../utils/audio';

interface HealthProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  safeguard: HealthSafeguard;
  onSaveSafeguard: (updated: HealthSafeguard) => void;
}

export const HealthProtectionModal: React.FC<HealthProtectionModalProps> = ({
  isOpen,
  onClose,
  safeguard,
  onSaveSafeguard,
}) => {
  const [enabled, setEnabled] = useState(safeguard.enabled);
  const [medicalItem, setMedicalItem] = useState(safeguard.medicalItem);
  const [reserveKWh, setReserveKWh] = useState(safeguard.reserveKWh);
  const [caregiverName, setCaregiverName] = useState(safeguard.caregiverName);
  const [caregiverPhone, setCaregiverPhone] = useState(safeguard.caregiverPhone);
  const [alertThresholdHours, setAlertThresholdHours] = useState(safeguard.alertThresholdHours);
  const [testAlertSent, setTestAlertSent] = useState(false);

  if (!isOpen) return null;

  const quickMedicalProfiles = [
    { label: 'Insulin Cold-Chain (Diabetes)', icon: ThermometerSnowflake, buffer: 3.5 },
    { label: 'Oxygen Concentrator / CPAP', icon: Stethoscope, buffer: 5.0 },
    { label: 'Infant Milk & Medication Fridge', icon: Baby, buffer: 2.5 },
    { label: 'Pediatric Nebulizer & First Aid', icon: Heart, buffer: 2.0 },
  ];

  const handleSave = () => {
    sound.playClick();
    onSaveSafeguard({
      enabled,
      medicalItem,
      reserveKWh: Math.max(0, reserveKWh),
      caregiverName,
      caregiverPhone,
      alertThresholdHours,
    });
    onClose();
  };

  const handleTestAlert = () => {
    sound.playEmergencyLifeline();
    setTestAlertSent(true);
    setTimeout(() => {
      setTestAlertSent(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-950/60 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Health Protection Mode</h3>
              <p className="text-xs text-teal-300/80">Treating energy as a medical lifeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Toggle Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Safeguard Medical Energy</span>
                {enabled && (
                  <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Locks reserve energy & activates caregiver SMS dispatch before expiration
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setEnabled(!enabled);
              }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                enabled ? 'bg-teal-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Select or customize medical priority:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickMedicalProfiles.map((p) => {
                const Icon = p.icon;
                const isSelected = medicalItem === p.label;
                return (
                  <button
                    key={p.label}
                    onClick={() => {
                      sound.playClick();
                      setMedicalItem(p.label);
                      setReserveKWh(p.buffer);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-teal-400" />
                      <span className="font-semibold leading-tight">{p.label.split('(')[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Auto-reserve: {p.buffer} kWh
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Medical Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specific Medical Requirement
            </label>
            <input
              type="text"
              value={medicalItem}
              onChange={(e) => setMedicalItem(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
              placeholder="e.g. Insulin vials in Samsung digital fridge"
            />
          </div>

          {/* Reserve Buffer Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300">Protected Energy Reserve Buffer</span>
              <span className="font-mono font-bold text-teal-400 text-sm">{reserveKWh} kWh</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={reserveKWh}
              onChange={(e) => setReserveKWh(parseFloat(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1.0 kWh (~6 hrs fan/fridge)</span>
              <span>15.0 kWh (~3 days cold chain)</span>
            </div>
          </div>

          {/* Caregiver Emergency Notification */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Designated Family Caregiver / Doctor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Caregiver Name</label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Dr. Chioma"
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mobile Phone (SMS alerts)</label>
                <input
                  type="text"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Simulated Alert Test */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleTestAlert}
                type="button"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Simulate Emergency Alert Dispatch</span>
              </button>
              {testAlertSent && (
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SMS Dispatched!</span>
                </span>
              )}
            </div>

            {/* Alert Preview Toast Mockup */}
            {testAlertSent && (
              <div className="p-3 bg-teal-900/40 border border-teal-500/50 rounded-xl text-teal-200 text-xs font-mono">
                <div className="text-[10px] text-teal-400 font-bold uppercase mb-1">Simulated SMS to {caregiverPhone}:</div>
                "[PowerPulse Lifeline] Warning: Household electricity has reached medical threshold (6 hours remaining). Protected cold chain for '{medicalItem}' requires backup or urgent top-up."
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Health Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
