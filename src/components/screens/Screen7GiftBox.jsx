import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import { playWobbleSound, playSuccessChime, playTapSound } from '../../utils/soundEffects';
import { fireGrandCelebration, firePastelConfetti } from '../../utils/confetti';

export default function Screen7GiftBox({ 
  onNext, 
  tapCount, 
  setTapCount, 
  isOpened, 
  setIsOpened 
}) {
  const tapHints = [
    "Tap the box to start unwrapping! 🎀",
    "2 more taps! Ribbon is untying... ✨",
    "1 more tap! It's about to burst open! 💖",
    "Ta-da! Happy Birthday! 🎉"
  ];

  const handleBoxTap = (e) => {
    if (isOpened) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    playWobbleSound(nextCount);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    if (nextCount < 3) {
      firePastelConfetti({ x, y });
    } else {
      // 3rd tap: POP OPEN!
      setIsOpened(true);
      playSuccessChime();
      fireGrandCelebration();

      setTimeout(() => {
        onNext();
      }, 1500);
    }
  };

  const handleRewrap = (e) => {
    e.stopPropagation();
    playTapSound();
    setTapCount(0);
    setIsOpened(false);
  };

  // Wobble variants based on tap stage
  const getWobbleAnimation = () => {
    if (isOpened) {
      return { scale: 1.15, opacity: 0.9 };
    }
    if (tapCount === 1) {
      return {
        rotate: [-4, 4, -4, 4, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.4 }
      };
    }
    if (tapCount === 2) {
      return {
        rotate: [-8, 8, -6, 6, -3, 3, 0],
        scale: [1, 1.12, 1],
        transition: { duration: 0.45 }
      };
    }
    return {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    };
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
          <span>A Special Package</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Unwrap Your Gift 🎁
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          {tapHints[tapCount]}
        </p>

        {/* Tap Counter Dots */}
        <div className="flex items-center gap-2 mt-3">
          {[1, 2, 3].map((num) => {
            const isFilled = tapCount >= num;
            return (
              <motion.div
                key={num}
                animate={tapCount === num ? { scale: [1, 1.3, 1] } : {}}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  isFilled
                    ? 'bg-rosegold border-rosegold shadow-sm'
                    : 'bg-white/70 border-rosegold/30'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Wobbling 3D Gift Box */}
      <div className="relative w-full max-w-[320px] h-[300px] my-auto flex items-center justify-center">
        {/* Shimmering Aura that intensifies with taps */}
        <div
          className={`absolute rounded-full transition-all duration-500 blur-2xl ${
            tapCount === 0
              ? 'w-48 h-48 bg-blush-200/40'
              : tapCount === 1
              ? 'w-56 h-56 bg-rosegold-light/50'
              : 'w-64 h-64 bg-rosegold/60 animate-pulse'
          }`}
        />

        {/* Gift Box Container */}
        <motion.div
          animate={getWobbleAnimation()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleBoxTap}
          className="relative z-10 cursor-pointer flex flex-col items-center"
        >
          {/* Animated Popping Lid */}
          <motion.div
            animate={
              isOpened
                ? { y: -80, rotate: -25, opacity: 0 }
                : tapCount === 2
                ? { y: -8, rotate: 2 }
                : tapCount === 1
                ? { y: -3 }
                : { y: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-20 w-44 h-12 rounded-xl bg-gradient-to-r from-[#FFCCD9] via-[#FFE4EE] to-[#FFAEC2] border-2 border-white shadow-md flex items-center justify-center"
          >
            <div className="w-full h-3 bg-gradient-to-r from-[#B86F81] via-[#D48C9E] to-[#B86F81] shadow-inner" />

            <div className="absolute -top-7 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-[#D48C9E] bg-[#FFE4EE] -rotate-45 shadow-sm" />
              <div className="w-4 h-4 rounded-full bg-[#B86F81] border-2 border-white -mx-2 z-10 shadow" />
              <div className="w-8 h-8 rounded-full border-4 border-[#D48C9E] bg-[#FFE4EE] rotate-45 shadow-sm" />
            </div>
          </motion.div>

          {/* Gift Box Body */}
          <div className="relative -mt-2 w-40 h-36 rounded-b-2xl bg-gradient-to-br from-[#FFF5F8] via-[#FFE4EE] to-[#EDE4FF] border-2 border-white shadow-float flex items-center justify-center overflow-hidden">
            <div className="w-8 h-full bg-gradient-to-b from-[#D48C9E] via-[#E5A9B8] to-[#B86F81] flex items-center justify-center">
              <div className="w-1.5 h-full bg-white/40" />
            </div>

            {!isOpened ? (
              <div className="absolute bottom-3 bg-white/95 px-3 py-1 rounded-full shadow-md border border-rosegold/30 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rosegold fill-rosegold animate-pulse" />
                <span className="text-[11px] font-bold text-plum">
                  {tapCount === 0 ? "Tap to open!" : `${3 - tapCount} tap left!`}
                </span>
              </div>
            ) : (
              <div className="absolute bottom-3 bg-white/95 px-3 py-1 rounded-full shadow-md border border-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                <span className="text-[11px] font-bold text-emerald-700">
                  Unwrapped! ✨
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Area */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center gap-2">
        {isOpened ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-2 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold text-white font-bold text-sm shadow-rose-glow flex items-center justify-center gap-2 border border-white/50"
            >
              <span>See Grand Finale →</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button
              onClick={handleRewrap}
              className="text-[11px] text-plum/50 hover:text-rosegold flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Wrap gift again</span>
            </button>
          </motion.div>
        ) : (
          <p className="text-[11px] text-plum/50 font-medium">
            {tapCount === 0 ? "Something beautiful is tucked inside 🌸" : "Keep tapping to see the grand surprise!"}
          </p>
        )}
      </div>
    </div>
  );
}
