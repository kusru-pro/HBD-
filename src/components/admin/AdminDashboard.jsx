import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, KeyRound, X, Eye, Save, Settings, Smartphone, 
  Mail, MessageSquareHeart, Check, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  getStoredConfig, saveStoredConfig, getAdminPin, saveAdminPin, 
  getStoredReplies, fetchLatestReplies 
} from '../../utils/storage';
import { playTapSound, playSuccessChime, playErrorSound } from '../../utils/soundEffects';

import TabGeneral from './TabGeneral';
import TabScreens from './TabScreens';
import TabLetter from './TabLetter';
import TabReplies from './TabReplies';
import TabSettings from './TabSettings';

export default function AdminDashboard({ isOpen, onClose, onConfigSaved }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('general');

  // Working state copy of config and admin PIN
  const [editableConfig, setEditableConfig] = useState(getStoredConfig());
  const [editableAdminPin, setEditableAdminPin] = useState(getAdminPin());
  const [replies, setReplies] = useState([]);
  const [saveToast, setSaveToast] = useState(false);

  // Refresh config and replies whenever opened
  useEffect(() => {
    if (isOpen) {
      setEditableConfig(getStoredConfig());
      setEditableAdminPin(getAdminPin());
      setReplies(getStoredReplies());
      fetchLatestReplies().then(data => {
        if (data) setReplies(data);
      });
    }
  }, [isOpen]);

  // Live real-time update listener
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setReplies(e.detail);
    };
    window.addEventListener('hbd_replies_updated', handleUpdate);
    return () => window.removeEventListener('hbd_replies_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  // 1. PIN Authentication Handler
  const handlePinSubmit = (e) => {
    e?.preventDefault?.();
    const currentActualPin = getAdminPin() || '0000';

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

  // 3. Save All Changes
  const handleSaveAll = () => {
    playSuccessChime();
    saveStoredConfig(editableConfig);
    if (editableAdminPin && editableAdminPin.length >= 4) {
      saveAdminPin(editableAdminPin);
    }
    onConfigSaved?.(editableConfig);

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
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
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blush-100 hover:bg-blush-200 text-plum font-semibold text-xs border border-blush-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-rosegold" />
                <span>Preview</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full bg-white text-plum/60 hover:text-plum hover:bg-blush-100 transition-colors"
              aria-label="Close admin"
            >
              <X className="w-4 h-4" />
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
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rosegold to-rosegold-light text-white font-bold text-xs shadow-rose-glow hover:opacity-95 transition-opacity"
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
                        ? 'border-rosegold text-rosegold bg-white/90 shadow-sm'
                        : 'border-transparent text-plum/60 hover:text-plum hover:bg-white/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {typeof tab.badge === 'number' && tab.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rosegold text-white text-[9px] font-mono">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

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
                <TabReplies
                  replies={replies}
                  onRepliesUpdated={() => setReplies(getStoredReplies())}
                />
              )}

              {activeTab === 'settings' && (
                <TabSettings
                  onResetCompleted={() => {
                    setEditableConfig(getStoredConfig());
                    setEditableAdminPin(getAdminPin());
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
                      <span>Saved! ✨</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-plum/70 hover:text-plum bg-blush-50 hover:bg-blush-100 transition-colors"
                >
                  Close
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveAll}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold text-white font-bold text-xs shadow-rose-glow flex items-center gap-1.5 border border-white/40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
