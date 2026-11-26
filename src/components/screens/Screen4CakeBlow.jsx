import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, ArrowRight, RotateCcw } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { fireGrandCelebration } from '../../utils/confetti';
import { playBlowSound, playSuccessChime, playTapSound } from '../../utils/soundEffects';

export default function Screen4CakeBlow({ 
  onNext, 
  candlesLit, 
  setCandlesLit, 
  allExtinguished, 
  setAllExtinguished 
}) {
  const { config } = useAppConfig();
  const [isBlowingHold, setIsBlowingHold] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdStartTimeRef = useRef(0);
  const animFrameRef = useRef(null);

  const HOLD_DURATION = 1500; // ~1.5s hold time

  // Extinguish all candles with celebratory sound and confetti
  const extinguishAllCandles = () => {
    if (allExtinguished) return;
    playBlowSound();
    setCandlesLit([false, false, false]);
    setAllExtinguished(true);

    setTimeout(() => {
      playSuccessChime();
      fireGrandCelebration();
    }, 400);
  };

  const handleRelight = (e) => {
    e.stopPropagation();
    playTapSound();
    setCandlesLit([true, true, true]);
    setAllExtinguished(false);
    setHoldProgress(0);
  };

  // Ultra-smooth 60fps Hold-to-blow interaction using pointer events
  const handleHoldStart = (e) => {
    if (allExtinguished) return;
    if (e.cancelable) e.preventDefault();

    setIsBlowingHold(true);
    setHoldProgress(0);
    holdStartTimeRef.current = Date.now();

    const updateLoop = () => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        setIsBlowingHold(false);
        extinguishAllCandles();
      } else {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  const handleHoldEnd = () => {
    if (allExtinguished) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsBlowingHold(false);
    setHoldProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

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
          <span>Make a Birthday Wish</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Blow Out The Candles 🎂
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          {allExtinguished 
            ? "Your wish has been cast! You can relight the candles or proceed to the next surprise."
            : "Press and hold the glowing button below to blow out your birthday candles! 🌬️"
          }
        </p>
      </div>

      {/* Layered Strawberry Cream Cake Illustration */}
      <div className="relative w-full max-w-[320px] h-[250px] my-auto flex flex-col items-center justify-end pb-3">
        {/* Cake Glow Aura */}
        <div className="absolute inset-0 bg-gradient-to-t from-blush-200/40 via-lavender-100/30 to-transparent blur-2xl rounded-full" />

        {/* 3 Candles and Flames */}
        <div className="relative z-10 flex items-end justify-center space-x-9 mb-[-8px]">
          {[0, 1, 2].map((idx) => {
            const isLit = candlesLit[idx];
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  if (allExtinguished) return;
                  const newLit = [...candlesLit];
                  newLit[idx] = false;
                  setCandlesLit(newLit);
                  playBlowSound();
                  if (newLit.every(lit => !lit)) {
                    extinguishAllCandles();
                  }
                }}
              >
                {/* Flame or Rising Smoke */}
                <div className="h-10 flex items-end justify-center relative">
                  <AnimatePresence>
                    {isLit ? (
                      <motion.div
                        key="flame"
                        animate={
                          isBlowingHold
                            ? {
                                scaleY: [0.75, 0.45, 0.8, 0.5],
                                scaleX: [1.3, 1.55, 1.25, 1.6],
                                rotate: [18, 30, 22, 34],
                                x: [3, 8, 5, 9],
                                opacity: [0.95, 0.65, 0.9, 0.55],
                              }
                            : {
                                scaleY: [1, 1.25, 0.95, 1.15, 1],
                                scaleX: [1, 0.88, 1.05, 0.92, 1],
                                rotate: [-3, 3, -2, 2, 0],
                                x: 0,
                                opacity: 1,
                              }
                        }
                        transition={{
                          duration: isBlowingHold ? 0.22 : 1.2 + idx * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-4 h-8 rounded-full candle-flame relative -top-1 origin-bottom"
                      >
                        {/* Inner white glow */}
                        <div className="absolute bottom-1 left-1.5 w-1.5 h-3 bg-white/90 rounded-full blur-[0.5px]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
                        animate={{ opacity: 0, y: -28, scale: 1.5, x: (idx - 1) * 6 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        className="w-3 h-6 rounded-full bg-slate-300/80 candle-smoke"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Wick */}
                <div className="w-0.5 h-2 bg-plum/70 rounded-full" />

                {/* Candle Stick */}
                <div className="w-3 h-14 rounded-t-sm bg-gradient-to-r from-blush-200 via-white to-rosegold-light shadow-sm border-x border-t border-rosegold/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-stripes opacity-40" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Cake Tier (Strawberry Glaze & Cream) */}
        <div className="relative z-10 w-48 h-16 rounded-t-3xl bg-gradient-to-r from-[#FFF5F8] via-[#FFE4EE] to-[#FFF0F5] border-t-2 border-x-2 border-white shadow-soft-glow flex items-start justify-center">
          {/* Dripping Strawberry Glaze */}
          <div className="w-full flex justify-around px-2 -mt-1">
            {['w-4 h-6', 'w-5 h-8', 'w-4 h-5', 'w-6 h-9', 'w-4 h-7'].map((cls, i) => (
              <div
                key={i}
                className={`${cls} bg-gradient-to-b from-[#F48BA7] to-[#D48C9E] rounded-b-full shadow-sm`}
              />
            ))}
          </div>

          {/* Strawberries on top */}
          <div className="absolute -top-3 w-full flex justify-between px-6">
            <span className="text-base transform -rotate-12">🍓</span>
            <span className="text-base transform rotate-6">🍓</span>
            <span className="text-base transform -rotate-6">🍓</span>
          </div>
        </div>

        {/* Bottom Cake Tier (Layered Sponge & Frosting) */}
        <div className="relative z-10 w-64 h-22 rounded-b-3xl bg-gradient-to-r from-[#FFEAD9] via-[#FFF9F6] to-[#EDE4FF] border-2 border-white shadow-float flex flex-col justify-between py-2 px-4 overflow-hidden">
          <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-rosegold-light via-blush-200 to-rosegold shadow-inner" />
          <div className="flex justify-around items-center w-full px-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-white shadow-sm border border-blush-100" />
            ))}
          </div>
        </div>

        {/* Ceramic Cake Plate */}
        <div className="relative z-0 w-72 h-3.5 rounded-full bg-white/95 border-b-2 border-rosegold/20 shadow-md -mt-1.5" />
      </div>

      {/* Action / State Area */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center">
        {!allExtinguished ? (
          <div className="w-full flex flex-col items-center">
            {/* Prominent Hold to Blow Button */}
            <div className="relative w-full flex items-center justify-center">
              <button
                type="button"
                onPointerDown={handleHoldStart}
                onPointerUp={handleHoldEnd}
                onPointerLeave={handleHoldEnd}
                onPointerCancel={handleHoldEnd}
                onContextMenu={(e) => e.preventDefault()}
                className="relative overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-sm shadow-lg shadow-rose-500/30 border border-white/25 flex items-center justify-center gap-2 select-none touch-none cursor-pointer active:scale-[0.98] transition-transform"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
              >
                {/* Smooth Filling Progress Bar Highlight */}
                <div
                  className="absolute inset-0 bg-white/35 transition-[width] duration-75 ease-linear origin-left"
                  style={{ width: `${holdProgress}%` }}
                />

                <Wind className={`w-4 h-4 text-white relative z-10 ${isBlowingHold ? 'animate-bounce' : ''}`} />
                <span className="relative z-10 text-white font-bold tracking-wide">
                  {isBlowingHold ? `Blowing... ${Math.round(holdProgress)}% 🌬️` : 'Hold to Blow Candles 🌬️'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-plum/60 mt-2.5 font-medium">
              {isBlowingHold ? "Keep holding until candles go out! ✨" : "Press and hold for 1.5s to blow out candles"}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-2"
          >
            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-300 shadow-soft-glow w-full">
              <p className="font-script text-2xl text-[#D81B60] font-bold">
                {config?.cakeWishTitle || "✨ Close your eyes & make a wish ✨"}
              </p>
              <p className="text-xs text-plum/85 font-medium mt-1">
                {config?.cakeWishMessage || "May every single dream in your heart find its way home."}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 border border-white/20"
            >
              <span>Continue Surprise →</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>

            {/* Relight button */}
            <button
              onClick={handleRelight}
              className="text-xs font-semibold text-[#4A1530] hover:text-[#D81B60] bg-white/95 px-3 py-1.5 rounded-full border border-rose-300 shadow-sm flex items-center justify-center gap-1.5 mt-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Light candles again</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
