import React, { useState } from 'react';
import { Download, Upload, RotateCcw, AlertTriangle, Check, Cloud } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { playTapSound, playSuccessChime, playErrorSound } from '../../utils/soundEffects';

export default function TabSettings({ onResetCompleted }) {
  const { config, replies, saveConfig, resetConfig } = useAppConfig();
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Export
  const handleExport = () => {
    playTapSound();
    try {
      const data = {
        config,
        replies,
        exportedAt: new Date().toISOString(),
        version: "2.0-firestore"
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `birthday-surprise-config-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({ type: 'success', text: 'Configuration exported successfully! 📁' });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Export failed: ' + e.message });
    }
  };

  // Handle Import directly to Firestore
  const handleImport = async () => {
    playTapSound();
    if (!importText.trim()) return;

    setIsProcessing(true);
    try {
      const parsed = JSON.parse(importText);
      if (!parsed || (!parsed.config && typeof parsed !== 'object')) {
        throw new Error("Invalid configuration file format.");
      }
      
      const configToApply = parsed.config || parsed;
      await saveConfig(configToApply);

      playSuccessChime();
      setStatusMessage({ type: 'success', text: 'Config saved to Firestore successfully! ✨' });
      setImportText('');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (e) {
      playErrorSound();
      setStatusMessage({ type: 'error', text: 'Import failed: ' + e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reset to Default directly in Firestore
  const handleReset = async () => {
    if (window.confirm("Are you sure you want to restore the default demo configuration in Firestore? All custom edits will be reverted.")) {
      playTapSound();
      setIsProcessing(true);
      try {
        await resetConfig();
        playSuccessChime();
        setStatusMessage({ type: 'success', text: 'Restored default settings in Firestore! 🌸' });
        onResetCompleted?.();
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (e) {
        playErrorSound();
        setStatusMessage({ type: 'error', text: 'Reset failed: ' + e.message });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1. Export JSON */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider flex items-center gap-1.5">
          <Download className="w-4 h-4 text-rosegold" />
          <span>Export Backup (JSON)</span>
        </h4>
        <p className="text-[11px] text-plum/60 leading-relaxed">
          Download your personalized content, compliments, passcode, and letter as a backup file.
        </p>

        <button
          onClick={handleExport}
          className="w-full py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white text-[#4A1530] font-bold text-xs border border-rose-300 flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Download className="w-3.5 h-3.5 text-[#D81B60]" />
          <span>Download Config JSON 📁</span>
        </button>
      </div>

      {/* 2. Import JSON */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-rosegold" />
          <span>Import Configuration</span>
        </h4>
        <p className="text-[11px] text-plum/60 leading-relaxed">
          Paste exported JSON here to update Firestore directly:
        </p>

        <textarea
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='{"config": { ... }}'
          className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-xs font-mono text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 resize-none"
        />

        <button
          onClick={handleImport}
          disabled={!importText.trim() || isProcessing}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-colors shadow-sm ${
            importText.trim() && !isProcessing
              ? 'bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white border-white/20 shadow-lg shadow-rose-500/30 hover:opacity-95'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isProcessing ? 'Saving to Firestore...' : 'Apply & Save To Firestore ☁️'}</span>
        </button>
      </div>

      {/* 3. Cloud Sync Note */}
      <div className="p-4 rounded-2xl bg-blush-50/70 border border-rosegold/30 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">100% Firebase Firestore Cloud Sync</h4>
        </div>
        <p className="text-[11px] text-plum/70 leading-relaxed">
          The app is connected 100% to Firebase Cloud Firestore (<code>app_data/config</code>). Changes made here save directly to the cloud and sync in real time across any phone, tablet, or laptop.
        </p>
      </div>

      {/* 4. Reset to Default */}
      <div className="p-4 rounded-2xl bg-white/70 border border-rose-200/70 shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-rose-500" />
          <span>Reset Everything To Default</span>
        </h4>
        <p className="text-[11px] text-plum/60 leading-relaxed">
          Restore all original demo texts, compliments, and default passcode (1205) in Firestore.
        </p>

        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs border border-rose-700 shadow-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Content In Firestore</span>
        </button>
      </div>
    </div>
  );
}
