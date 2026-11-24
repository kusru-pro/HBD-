import React, { useState } from 'react';
import { Download, Upload, RotateCcw, AlertTriangle, Check, Cloud } from 'lucide-react';
import { exportConfigAsJSON, importConfigFromJSON, resetStoredConfig } from '../../utils/storage';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';

export default function TabSettings({ onResetCompleted }) {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  // Handle Export
  const handleExport = () => {
    playTapSound();
    try {
      const json = exportConfigAsJSON();
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

  // Handle Import
  const handleImport = () => {
    playTapSound();
    if (!importText.trim()) return;

    try {
      importConfigFromJSON(importText);
      playSuccessChime();
      setStatusMessage({ type: 'success', text: 'Config imported successfully! Reloading... ✨' });
      setImportText('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Invalid JSON: ' + e.message });
    }
  };

  // Handle Reset to Default
  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the default demo configuration? All custom edits will be reverted.")) {
      playTapSound();
      resetStoredConfig();
      setStatusMessage({ type: 'success', text: 'Restored default settings! 🌸' });
      setTimeout(() => {
        onResetCompleted?.();
        window.location.reload();
      }, 1000);
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
          {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
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
          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-blush-50 text-plum font-semibold text-xs border border-blush-200 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-rosegold" />
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
          Paste previously exported JSON content below to restore all your custom settings at once.
        </p>

        <textarea
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='Paste JSON here: { "config": { ... } }'
          className="w-full p-2.5 rounded-xl bg-white border border-blush-200 text-xs text-plum font-mono resize-none focus:outline-none focus:ring-2 focus:ring-rosegold/40"
        />

        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          className={`w-full py-2 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-colors ${
            importText.trim()
              ? 'bg-rosegold text-white border-rosegold hover:bg-rosegold-dark cursor-pointer shadow-sm'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Apply Imported Config</span>
        </button>
      </div>

      {/* 3. Cloud Sync Note */}
      <div className="p-4 rounded-2xl bg-blush-50/70 border border-rosegold/30 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Cloud Sync Ready</h4>
        </div>
        <p className="text-[11px] text-plum/70 leading-relaxed">
          Your changes and replies are persisted locally in <code>localStorage</code>. All functions in <code>src/utils/storage.js</code> are designed with a clean API, ready to hook into Firebase Firestore or Supabase if you want live cross-device sync!
        </p>
      </div>

      {/* 4. Reset to Default */}
      <div className="p-4 rounded-2xl bg-white/70 border border-rose-200/70 shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-rose-500" />
          <span>Reset Everything To Default</span>
        </h4>
        <p className="text-[11px] text-plum/60 leading-relaxed">
          Restore all original demo texts, compliments, and default passcode (1205).
        </p>

        <button
          onClick={handleReset}
          className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Content To Default</span>
        </button>
      </div>
    </div>
  );
}
