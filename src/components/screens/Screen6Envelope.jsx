import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, ArrowRight, FastForward, RotateCcw } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';
import { firePastelConfetti } from '../../utils/confetti';

export default function Screen6Envelope({ 
  onNext, 
  isOpen, 
  setIsOpen, 
  isTypingDone, 
  setIsTypingDone,
}) {
  const { config } = useAppConfig();
  const letterText = config?.letterText || '';
  const [displayedText, setDisplayedText] = useState(isTypingDone ? letterText : '');
  const textEndRef = useRef(null);
  const letterBoxRef = useRef(null);

  // Handle Wax Seal tap
  const handleOpenEnvelope = () => {
    if (isOpen) return;
    playTapSound();
    setIsOpen(true);
    firePastelConfetti({ x: 0.5, y: 0.5 });
  };

  // Typewriter effect
  useEffect(() => {
    if (!isOpen || isTypingDone) {
      if (isTypingDone) setDisplayedText(letterText);
      return;
    }

    let index = displayedText.length;
    const interval = setInterval(() => {
      index += 2;
      if (index >= letterText.length) {
        setDisplayedText(letterText);
        setIsTypingDone(true);
        clearInterval(interval);
        setTimeout(playSuccessChime, 400);
      } else {
        setDisplayedText(letterText.slice(0, index));
        if (letterBoxRef.current) {
          letterBoxRef.current.scrollTop = letterBoxRef.current.scrollHeight;
        }
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isOpen, isTypingDone, letterText]);

  // Skip typewriter
  const handleSkipTyping = () => {
    playTapSound();
    setDisplayedText(letterText);
    setIsTypingDone(true);
  };

  // Replay typewriter animation
  const handleReplayLetter = (e) => {
    e.stopPropagation();
    playTapSound();
    setDisplayedText('');
    setIsTypingDone(false);
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
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Letter From The Heart</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          {isOpen ? "A Note For You 💌" : "Sealed With Love 💌"}
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          {isOpen ? "Words straight from my heart to yours." : "Tap the rose-gold wax seal to break the seal and read your birthday letter."}
        </p>
      </div>

      {/* Main Interactive Envelope & Letter Container */}
      <div className="relative w-full max-w-[340px] my-auto flex items-center justify-center min-h-[360px]">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: [0, -6, 0] }}
            transition={{
              scale: { duration: 0.5 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.03 }}
            onClick={handleOpenEnvelope}
            className="cursor-pointer relative w-72 h-48 rounded-2xl bg-gradient-to-br from-[#FFE4EE] via-[#FFF5F8] to-[#EDE4FF] border-2 border-white shadow-float flex items-center justify-center overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FFAEC2] to-[#FFCCD9] opacity-70 clip-flap border-b border-rosegold/30" />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 288 192" fill="none">
              <path d="M0 0 L144 100 L288 0" stroke="#FFF" strokeWidth="2" opacity="0.8" />
              <path d="M0 192 L110 95" stroke="#FFE4EE" strokeWidth="1.5" />
              <path d="M288 192 L178 95" stroke="#FFE4EE" strokeWidth="1.5" />
            </svg>

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D81B60] via-[#E11D48] to-[#BE185D] shadow-lg shadow-rose-500/30 border-2 border-white flex items-center justify-center p-2">
                <Heart className="w-8 h-8 text-white fill-white/90 drop-shadow" />
              </div>

              <span className="mt-2 text-[10px] font-bold text-[#4A1530] bg-white/95 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-sm animate-pulse">
                Tap to open 💌
              </span>
            </motion.div>
          </motion.div>
        ) : (
          /* Opened Stationery Letter View */
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="w-full relative bg-[#FFFDF9] rounded-2xl border-2 border-white shadow-float p-4 flex flex-col max-h-[380px] overflow-hidden"
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between pb-2 border-b border-blush-200/80 mb-2">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rosegold fill-rosegold" />
                <span className="font-script text-base text-rosegold font-bold">Forever Yours</span>
              </div>
              
              {!isTypingDone ? (
                <button
                  onClick={handleSkipTyping}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#4A1530] hover:text-[#D81B60] bg-white/95 px-2.5 py-1 rounded-full border border-rose-300 shadow-sm transition-colors"
                >
                  <FastForward className="w-2.5 h-2.5" />
                  <span>Skip</span>
                </button>
              ) : (
                <button
                  onClick={handleReplayLetter}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#4A1530] hover:text-[#D81B60] bg-white/95 px-2.5 py-1 rounded-full border border-rose-300 shadow-sm transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Replay</span>
                </button>
              )}
            </div>

            {/* Auto-scrolling letter content */}
            <div 
              ref={letterBoxRef}
              className="overflow-y-auto pr-1 text-left custom-scrollbar flex-1 select-text"
              style={{ maxHeight: '270px' }}
            >
              <p className="font-serif text-xs md:text-sm text-plum/90 leading-relaxed whitespace-pre-line">
                {displayedText}
                {!isTypingDone && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-rosegold animate-pulse align-middle" />
                )}
              </p>
              <div ref={textEndRef} />
            </div>

            <div className="pt-2 mt-2 border-t border-blush-100 flex items-center justify-between text-[10px] text-plum/40 font-medium">
              <span>Handcrafted with tenderness</span>
              <span>100% Genuine</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center">
        {isOpen && isTypingDone ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 border border-white/20 animate-pulse-slow"
          >
            <span>One More Surprise →</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        ) : isOpen ? (
          <p className="text-[11px] text-plum/50 font-medium animate-pulse">
            Pouring love onto the page... ✨
          </p>
        ) : (
          <p className="text-[11px] text-plum/50 font-medium">
            Touch the wax heart to reveal your letter
          </p>
        )}
      </div>
    </div>
  );
}
