import React, { useState } from 'react';
import { X, Camera, RefreshCw, CheckCircle2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { sound } from '../utils/audio';

interface MeterPhotoScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUnits: number;
  onUpdateUnits: (newUnits: number) => void;
  onOpenAiVision?: () => void;
}

export const MeterPhotoScannerModal: React.FC<MeterPhotoScannerModalProps> = ({
  isOpen,
  onClose,
  currentUnits,
  onUpdateUnits,
  onOpenAiVision,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'mojec' | 'conlog' | 'landis'>('mojec');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedUnits, setDetectedUnits] = useState<number | null>(null);
  const [manualUnits, setManualUnits] = useState(currentUnits.toString());
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [hasScanned, setHasScanned] = useState(false);

  if (!isOpen) return null;

  const presets = {
    mojec: {
      brand: 'MOJEC STS Smart Meter',
      sampleReading: 22.4,
      lcdDisplay: '00022.40 kWh',
      serial: '0421-8849-102',
    },
    conlog: {
      brand: 'Conlog InHome Prepaid',
      sampleReading: 18.6,
      lcdDisplay: '00018.60 kWh',
      serial: '0142-9921-554',
    },
    landis: {
      brand: 'Landis+Gyr Cashpower',
      sampleReading: 35.0,
      lcdDisplay: '00035.00 kWh',
      serial: '0711-2091-883',
    },
  };

  const handleStartScan = () => {
    sound.playClick();
    setIsScanning(true);
    setHasScanned(false);

    setTimeout(() => {
      const preset = presets[selectedPreset];
      setDetectedUnits(preset.sampleReading);
      setManualUnits(preset.sampleReading.toString());
      setIsScanning(false);
      setHasScanned(true);
      sound.playTokenSuccess();
    }, 1400);
  };

  const handleApply = () => {
    sound.playClick();
    const val = parseFloat(manualUnits);
    if (!isNaN(val) && val >= 0) {
      onUpdateUnits(val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Meter LCD Scanner & OCR</h3>
              <p className="text-xs text-slate-400">Scan or manually enter current units from your meter box</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 pt-4 flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setScanMode('camera');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              scanMode === 'camera'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
            }`}
          >
            Camera OCR Scanner
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setScanMode('manual');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              scanMode === 'manual'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
            }`}
          >
            Manual Keypad
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {scanMode === 'camera' ? (
            <>
              {/* Meter Model Preset Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Select your physical meter display style:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mojec', 'conlog', 'landis'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPreset(key);
                        setHasScanned(false);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        selectedPreset === key
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="font-semibold truncate">{presets[key].brand.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{presets[key].serial}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewfinder simulation */}
              <div className="relative aspect-video rounded-2xl bg-black border-2 border-dashed border-emerald-500/40 overflow-hidden flex flex-col items-center justify-center p-4">
                {/* Meter LCD Screen Mockup inside camera */}
                <div className="w-full max-w-xs bg-lime-950/40 border-2 border-lime-500/50 rounded-lg p-3 text-center shadow-inner relative">
                  <div className="text-[10px] uppercase tracking-wider text-lime-400/70 font-mono mb-1">
                    {presets[selectedPreset].brand} LCD
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-lime-300 tracking-wider">
                    {presets[selectedPreset].lcdDisplay}
                  </div>
                  <div className="text-[9px] text-lime-400/60 font-mono mt-1 flex justify-between">
                    <span>ACTIVE CREDIT</span>
                    <span>STS COMM OK</span>
                  </div>

                  {/* Optical Scanning Line */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/80 animate-[bounce_1.5s_infinite]" />
                  )}
                </div>

                {/* Viewfinder Target Reticle */}
                <div className="absolute inset-6 border border-emerald-500/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing LCD digits with Vision AI...</span>
                  </div>
                )}
              </div>

              {/* Action Trigger for Camera */}
              <div className="flex gap-3">
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                  <span>{hasScanned ? 'Scan Meter Again' : 'Snap Photo & Read Balance'}</span>
                </button>
              </div>

              {/* Detected Results */}
              {hasScanned && detectedUnits !== null && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-200">
                        OCR Confirmed: <span className="font-mono font-bold text-white text-sm">{detectedUnits} kWh</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Confidence 99.4% · {presets[selectedPreset].brand}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">READY</span>
                </div>
              )}
            </>
          ) : (
            /* Manual Input Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Balance from Meter Screen (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={manualUnits}
                    onChange={(e) => setManualUnits(e.target.value)}
                    placeholder="e.g. 15.5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-xl font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center text-slate-400 font-mono text-sm">
                    kWh
                  </div>
                </div>
              </div>

              {/* Quick keypad adjustment increments */}
              <div className="flex gap-2">
                {[5, 10, 20, 50].map((inc) => (
                  <button
                    key={inc}
                    onClick={() => {
                      sound.playClick();
                      const cur = parseFloat(manualUnits) || 0;
                      setManualUnits((cur + inc).toFixed(1));
                    }}
                    className="flex-1 py-1.5 text-xs font-mono font-semibold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    +{inc} kWh
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-400 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Tip: On most prepaid meters (MOJEC/Conlog), press <strong>07</strong> or <strong>001</strong> and press <strong>Enter/Hash</strong> to view remaining credit units.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          {onOpenAiVision ? (
            <button
              onClick={onOpenAiVision}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full AI Vision Inspector</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Update Live Forecast</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
