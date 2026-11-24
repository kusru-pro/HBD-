import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, CheckCircle2, RotateCcw, MessageCircle } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { firePastelConfetti } from '../../utils/confetti';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';

const MOOD_OPTIONS = [
  { id: 'loved', label: 'Loved it! 🥰', emoji: '🥰' },
  { id: 'tears', label: 'Crying happy tears 🥺', emoji: '🥺' },
  { id: 'magical', label: 'Best surprise ever! ✨', emoji: '✨' },
  { id: 'thankyou', label: 'Thank you! 💖', emoji: '💖' },
  { id: 'dreamy', label: 'So magical! 🌸', emoji: '🌸' },
  { id: 'speechless', label: 'Speechless 🥹', emoji: '🥹' },
];

export default function Screen9Reply({ onReplay }) {
  const { config, addReply } = useAppConfig();
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sentDetails, setSentDetails] = useState(null);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    playSuccessChime();
    firePastelConfetti({ x: 0.5, y: 0.5 });

    const saved = await addReply({
      mood: selectedMood.label,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });

    setSentDetails(saved);
    setIsSent(true);
  };

  const handleWriteAnother = () => {
    playTapSound();
    setMessage('');
    setIsSent(false);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-3 w-full max-w-[420px] mx-auto text-center select-none">
      {/* Top Header */}
      <div className="w-full flex flex-col items-center mt-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-rosegold text-xs font-semibold shadow-sm mb-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-rosegold" />
          <span>Postcard To My Heart</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Leave A Little Note 💌
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          {isSent 
            ? "Your sweet message has been stored safely in the inbox!" 
            : "Write whatever is on your mind or in your heart right now."
          }
        </p>
      </div>

      {/* Main Postcard Card */}
      <div className="relative w-full max-w-[340px] my-auto">
        <AnimatePresence mode="wait">
          {!isSent ? (
            /* Postcard Form View */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-3xl bg-[#FFFDF9] border-2 border-white shadow-float p-4 flex flex-col items-center text-left"
            >
              {/* Decorative Postage Stamp in Top-Right */}
              <div className="absolute top-3.5 right-3.5 w-11 h-12 rounded-sm border-2 border-dashed border-rosegold/50 bg-blush-50 flex flex-col items-center justify-center p-1 shadow-sm rotate-3">
                <Heart className="w-4 h-4 text-rosegold fill-rosegold" />
                <span className="text-[8px] font-bold text-plum/60 mt-0.5 tracking-tighter">LOVE</span>
              </div>

              {/* Postcard Header Label */}
              <div className="w-full pr-12 pb-2">
                <span className="font-script text-xl text-rosegold font-bold block">
                  Dear You,
                </span>
                <span className="text-[10px] text-plum/50 font-medium">
                  Select how you felt & leave a sweet note:
                </span>
              </div>

              {/* Mood Selector Chips */}
              <div className="w-full flex flex-wrap gap-1.5 my-2">
                {MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedMood.id === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setSelectedMood(mood);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 border flex items-center gap-1 ${
                        isSelected
                          ? 'bg-gradient-to-r from-rosegold to-rosegold-light text-white border-rosegold shadow-sm scale-105'
                          : 'bg-white/80 text-plum/70 border-blush-200/80 hover:bg-white hover:text-plum'
                      }`}
                    >
                      <span>{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lined Pastel Textarea */}
              <div className="w-full mt-2 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me your thoughts, memories, or just say hi... 💖"
                  rows={4}
                  maxLength={500}
                  className="w-full p-3 rounded-2xl bg-blush-50/60 border border-blush-200/90 text-plum text-xs leading-relaxed placeholder:text-plum/40 focus:outline-none focus:ring-2 focus:ring-rosegold/40 resize-none font-sans"
                />
                <span className="absolute bottom-2 right-3 text-[9px] text-plum/40 font-mono">
                  {message.length}/500
                </span>
              </div>

              {/* Single Clean Send Reply Action Button */}
              <div className="w-full mt-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSendReply}
                  disabled={!message.trim()}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-rose-glow flex items-center justify-center gap-2 border transition-all ${
                    message.trim()
                      ? 'bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold text-white border-white/50 cursor-pointer animate-pulse-slow'
                      : 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply 💌</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Confirmation Delivered Card View */
            <motion.div
              key="delivered"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-3xl bg-[#FFFDF9] border-2 border-white shadow-float p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 shadow-sm flex items-center justify-center mb-3">
                <CheckCircle2 className="w-9 h-9 text-emerald-500 animate-bounce" />
              </div>

              <h3 className="font-script text-2xl text-rosegold font-bold mb-1">
                Message Delivered! 💖
              </h3>
              <p className="text-xs text-plum/70 font-medium leading-relaxed max-w-[260px] mb-4">
                Your heartfelt words are tucked safely into the surprise inbox. Thank you for sharing your thoughts!
              </p>

              {/* Quote of what was sent */}
              <div className="w-full p-3 rounded-2xl bg-blush-50/70 border border-blush-200/80 mb-4 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-rosegold">
                    {sentDetails?.mood}
                  </span>
                  <span className="text-[9px] text-plum/40 font-mono">Just now</span>
                </div>
                <p className="font-serif italic text-xs text-plum/85 leading-relaxed line-clamp-3">
                  "{sentDetails?.message}"
                </p>
              </div>

              {/* Action Button in Confirmation */}
              <div className="w-full flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleWriteAnother}
                  className="w-full py-2.5 px-4 rounded-xl bg-blush-100/70 hover:bg-blush-200 text-plum font-semibold text-xs border border-blush-200 transition-colors"
                >
                  Write another note ✏️
                </button>

                {config?.whatsAppNumber && (
                  <a
                    href={`https://wa.me/${config.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `[${sentDetails?.mood || '💖'}] "${sentDetails?.message || ''}"`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Also Send on WhatsApp 💬</span>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Footer Action */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center">
        <button
          onClick={onReplay}
          className="text-xs text-plum/60 hover:text-rosegold font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Whole Surprise 🔄</span>
        </button>
      </div>
    </div>
  );
}
