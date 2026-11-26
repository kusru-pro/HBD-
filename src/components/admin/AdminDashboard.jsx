import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, KeyRound, X, Eye, Save, Settings, Smartphone, 
  Mail, MessageSquareHeart, Check, Sparkles, AlertCircle, Loader2 
} from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { playTapSound, playSuccessChime, playErrorSound } from '../../utils/soundEffects';

import TabGeneral from './TabGeneral';
import TabScreens from './TabScreens';
import TabLetter from './TabLetter';
import TabReplies from './TabReplies';
import TabSettings from './TabSettings';

export default function AdminDashboard({ isOpen, onClose, onConfigSaved }) {
  const { config, saveConfig, adminPin, saveAdminPin, replies, resetConfig, firestoreError } = useAppConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('general');

  // Working state copy of config and admin PIN
  const [editableConfig, setEditableConfig] = useState(config);
  const [editableAdminPin, setEditableAdminPin] = useState(adminPin);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Synchronize editable copy when modal is opened or when external config changes
  useEffect(() => {
    if (isOpen) {
      setEditableConfig(config);
      setEditableAdminPin(adminPin);
    }
  }, [isOpen, config, adminPin]);

  if (!isOpen) return null;

  // 1. PIN Authentication Handler
  const handlePinSubmit = (e) => {
    e?.preventDefault?.();
    const currentActualPin = adminPin || '0000';

    if (enteredPin === currentActualPin) {
      playSuccessChime();
      setIsAuthenticated(true);
      setPinError('');
    } else {
      playErrorSound();
      setIsShaking(true);
      setPinError("Incorrect PIN (Default is 0000) 🙈");
      setTimeout(() => {
        setEnteredPin('');
        setIsShaking(false);
      }, 700);
    }
  };

  // 2. Field Change Handlers
  const handleConfigChange = (field, value) => {
    setEditableConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 3. Save All Changes directly to Firestore (app_data/config)
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveToast(false);

    try {
      const configToSave = {
        ...editableConfig,
        adminPin: editableAdminPin || '0000',
      };
      
      // Write directly to Firestore via saveConfig
      await saveConfig(configToSave);
      
      playSuccessChime();
      setSaveToast(true);
      onConfigSaved?.(configToSave);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err) {
      console.error("Firestore Save Error:", err);
      playErrorSound();
      const errorCode = err?.code ? `[${err.code}] ` : '';
      const errorMessage = err?.message || 'Unknown Firestore save error';
      setSaveError(`${errorCode}${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    playTapSound();
    onClose();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'screens', label: 'Screens', icon: Smartphone },
    { id: 'letter', label: 'Letter', icon: Mail },
    { id: 'replies', label: 'Inbox', icon: MessageSquareHeart, badge: replies.length },
    { id: 'settings', label: 'Backup', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-plum/50 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-[480px] max-h-[92dvh] bg-gradient-to-b from-[#FFF5F8] via-[#FFFDF9] to-[#EDE4FF] rounded-3xl border-2 border-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="pt-4 pb-3 px-5 border-b border-blush-200/80 flex items-center justify-between bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rosegold/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rosegold" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-plum">
                Admin Control Center
              </h3>
              <p className="text-[10px] text-plum/60">
                {isAuthenticated ? "Customize texts, passcode & replies" : "Authentication Required"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isAuthenticated && (
              <button
                onClick={handleClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4A1530] hover:bg-[#380E23] text-white font-bold text-xs border border-[#4A1530] shadow-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-rose-300" />
                <span>Preview</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full bg-white/95 text-[#4A1530] border border-rose-300 hover:text-[#D81B60] hover:bg-white transition-colors shadow-sm"
              aria-label="Close admin"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* PIN Entry Screen */
          <div className="p-6 flex flex-col items-center justify-center text-center my-auto min-h-[350px]">
            <motion.div
              animate={isShaking ? { x: [-10, 10, -6, 6, 0] } : {}}
              className="w-16 h-16 rounded-full bg-white shadow-rose-glow border border-rosegold/30 flex items-center justify-center mb-4"
            >
              <KeyRound className="w-8 h-8 text-rosegold" />
            </motion.div>

            <h4 className="font-serif text-lg font-bold text-plum mb-1">
              Enter Admin PIN
            </h4>
            <p className="text-xs text-plum/60 max-w-[240px] mb-4">
              Protected area. Default PIN is <span className="font-mono font-bold text-rosegold">0000</span>.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-[240px] flex flex-col items-center gap-3">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="• • • •"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-white border border-blush-200 text-lg font-mono tracking-widest text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/50 font-bold shadow-inner"
              />

              {pinError && (
                <span className="text-[11px] font-semibold text-rose-600">
                  {pinError}
                </span>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-xs shadow-lg shadow-rose-500/30 hover:opacity-95 transition-opacity"
              >
                Unlock Dashboard 🔓
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs & Editor */
          <>
            {/* Tab Navigation Buttons */}
            <div className="flex items-center px-4 pt-2.5 border-b border-blush-100 bg-white/50 overflow-x-auto gap-1 custom-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playTapSound();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-b-2 border-[#D81B60] text-[#D81B60] bg-white font-bold shadow-sm'
                        : 'border-transparent text-[#4A1530]/75 hover:text-[#4A1530] hover:bg-white/60 font-semibold'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {typeof tab.badge === 'number' && tab.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#D81B60] text-white text-[9px] font-mono">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* On-screen Firestore Error Alert Banner */}
            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs shadow-sm flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-700">Firestore Save Error ❌</p>
                    <p className="font-mono text-[11px] text-rose-900 mt-0.5 break-all select-text">
                      {saveError}
                    </p>
                    {saveError.includes('permission-denied') && (
                      <p className="text-[10px] text-rose-600 mt-1 font-sans">
                        💡 Tip: Make sure your Firestore Security Rules allow read/write (e.g. <code>allow read, write: if true;</code>).
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveError(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold text-sm px-1"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {firestoreError && !saveError && (
              <div className="mx-4 mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Firestore Notice: {firestoreError}</span>
              </div>
            )}

            {/* Tab Body View */}
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar max-h-[calc(92dvh-175px)]">
              {activeTab === 'general' && (
                <TabGeneral
                  config={editableConfig}
                  onChange={handleConfigChange}
                  adminPin={editableAdminPin}
                  onAdminPinChange={setEditableAdminPin}
                />
              )}

              {activeTab === 'screens' && (
                <TabScreens
                  config={editableConfig}
                  onChange={handleConfigChange}
                />
              )}

              {activeTab === 'letter' && (
                <TabLetter
                  config={editableConfig}
                  onChange={handleConfigChange}
                />
              )}

              {activeTab === 'replies' && (
                <TabReplies />
              )}

              {activeTab === 'settings' && (
                <TabSettings
                  onResetCompleted={() => {
                    const fresh = resetConfig();
                    setEditableConfig(fresh);
                    setEditableAdminPin('0000');
                  }}
                />
              )}
            </div>

            {/* Sticky Bottom Save Actions Footer */}
            <div className="p-3.5 px-5 bg-white/80 backdrop-blur-md border-t border-blush-200/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {saveToast && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Saved to Firestore! ✨</span>
                    </motion.div>
                  )}
                  {saveError && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"
                    >
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      <span>Save failed! See error above ❌</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#4A1530] bg-white/95 hover:bg-white border border-rose-300 shadow-sm transition-colors"
                >
                  Close
                </button>

                <motion.button
                  whileHover={{ scale: isSaving ? 1 : 1.03 }}
                  whileTap={{ scale: isSaving ? 1 : 0.96 }}
                  disabled={isSaving}
                  onClick={handleSaveAll}
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg shadow-rose-500/30 flex items-center gap-1.5 border border-white/20 transition-all ${
                    isSaving 
                      ? 'bg-[#D81B60]/70 cursor-not-allowed opacity-80' 
                      : 'bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] hover:opacity-95'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes ☁️</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
