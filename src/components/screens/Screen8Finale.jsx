import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Heart, Sparkles, RotateCcw, Camera, MessageSquareHeart, Share2, Check, ArrowRight } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { startContinuousShower, stopContinuousShower, fireGrandCelebration } from '../../utils/confetti';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';

export default function Screen8Finale({ onReplay, onGoToReply, cleanView, setCleanView }) {
  const { config } = useAppConfig();
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    // Start continuous gentle confetti shower
    startContinuousShower();
    fireGrandCelebration();

    return () => {
      stopContinuousShower();
    };
  }, []);

  const toggleCleanView = (e) => {
    e?.stopPropagation?.();
    playTapSound();
    setCleanView(!cleanView);
  };

  const handleShareOrCopy = (e) => {
    e?.stopPropagation?.();
    playTapSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  return (
    <div 
      onClick={() => {
        if (cleanView) setCleanView(false);
      }}
      className={`flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-3 w-full max-w-[420px] mx-auto text-center select-none ${
        cleanView ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top Badge (Hidden in clean view) */}
      {!cleanView && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rosegold/15 border border-rosegold/30 text-rosegold text-xs font-bold shadow-sm mt-1"
        >
          <Crown className="w-4 h-4 fill-rosegold/40" />
          <span>{config?.finaleBadge || "Happy Birthday, Queen 👑"}</span>
        </motion.div>
      )}

      {/* Keepsake Centerpiece Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full relative my-auto max-w-[340px] rounded-3xl glass-panel p-6 border-2 border-white shadow-float flex flex-col items-center"
      >
        {/* Glowing Decorative Ribbon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFE4EE] via-[#FFF9F6] to-[#EDE4FF] border-2 border-white shadow-rose-glow flex items-center justify-center p-4 mb-4">
          <Heart className="w-10 h-10 text-rosegold fill-rosegold/80 animate-pulse" />
        </div>

        {/* Script & Serif Typography */}
        <h3 className="font-script text-3xl md:text-4xl text-rosegold mb-1">
          Forever Celebrated
        </h3>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-plum tracking-tight leading-snug mb-3">
          {config?.recipientName || "Princess"}
        </h1>

        {/* Romantic quote */}
        <div className="relative py-3 px-4 rounded-2xl bg-white/70 border border-rosegold/20 my-2 shadow-sm w-full">
          <p className="font-serif italic text-sm text-plum/90 leading-relaxed">
            "{config?.finaleQuote || "Lots of love, always 💖"}"
          </p>
        </div>

        <p className="text-xs text-plum/70 font-medium mt-3 leading-relaxed">
          {config?.finaleFooter || "May all your birthday wishes dance into reality today ✨"}
        </p>

        {/* Delicate Heart Stamps */}
        <div className="flex items-center gap-2 mt-4 text-rosegold/60">
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-widest uppercase">Special Edition</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Bottom Action Area (Hidden in Clean View) */}
      {!cleanView ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[320px] pb-4 flex flex-col gap-2.5 items-center"
        >
          {/* Glowing Next Screen 9: Write a Reply Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onGoToReply}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-xs shadow-lg shadow-rose-500/30 border border-white/20 flex items-center justify-center gap-2 animate-pulse-slow"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Write a Reply 💌 (Leave a Note)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          {/* Clean View Button for aesthetic screenshots */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleCleanView}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/95 text-[#4A1530] font-bold text-xs shadow-md border border-rose-300 flex items-center justify-center gap-2 hover:bg-white"
          >
            <Camera className="w-3.5 h-3.5 text-[#D81B60]" />
            <span>Clean View 📸 (Take Screenshot)</span>
          </motion.button>

          {/* Replay & Share Buttons Grid */}
          <div className="w-full grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onReplay}
              className="py-2.5 px-3 rounded-xl bg-white/95 text-[#4A1530] font-bold text-xs border border-rose-300 shadow-md flex items-center justify-center gap-1.5 hover:bg-white hover:text-[#D81B60] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay 🔄</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShareOrCopy}
              className="py-2.5 px-3 rounded-xl bg-white/95 text-[#4A1530] font-bold text-xs border border-rose-300 shadow-md flex items-center justify-center gap-1.5 hover:bg-white hover:text-[#D81B60] transition-colors"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link ✨</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Hint to exit clean view */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-3 text-[11px] font-semibold text-plum/50 bg-white/60 px-3 py-1 rounded-full border border-white/80"
        >
          Tap anywhere to show controls ✨
        </motion.div>
      )}
    </div>
  );
}
