import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, MicOff, Wind, ArrowRight, RotateCcw } from 'lucide-react';
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
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);

  const holdIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  // Initialize Microphone blowing detection
  const startMicDetection = async () => {
    if (allExtinguished) return;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: false } 
      });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicActive(true);
      setMicError(false);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let blowStreak = 0;

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sum volume across mid/high frequencies typical of blowing noise
        let sum = 0;
        for (let i = 10; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / (bufferLength - 10);

        if (average > 48) { // Sound threshold for blowing
          blowStreak += 1;
          if (blowStreak > 6) { // ~200-300ms sustained
            extinguishAllCandles();
            return;
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1);
        }

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.log("Mic detection not available:", err);
      setMicError(true);
      setMicActive(false);
    }
  };

  const stopMicDetection = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMicActive(false);
  };

  useEffect(() => {
    if (!allExtinguished) {
      startMicDetection();
    }
    return () => {
      stopMicDetection();
    };
  }, [allExtinguished]);

  // Extinguish all candles with celebration
  const extinguishAllCandles = () => {
    if (allExtinguished) return;
    playBlowSound();
    setCandlesLit([false, false, false]);
    setAllExtinguished(true);
    stopMicDetection();

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
  };

  // Hold-to-blow fallback interactions
  const handleHoldStart = (e) => {
    if (allExtinguished) return;
    e.preventDefault();
    setIsBlowingHold(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 1200; // 1.2s hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsBlowingHold(false);
        extinguishAllCandles();
      }
    }, 30);
  };

  const handleHoldEnd = () => {
    if (allExtinguished) return;
    setIsBlowingHold(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
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
          <span>Make a Birthday Wish</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Blow Out The Candles 🎂
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          {allExtinguished 
            ? "Your wish has been cast! You can relight the candles or proceed to the next surprise."
            : "Blow into your microphone or hold the button below to blow out your birthday candles!"
          }
        </p>

        {/* Mic Status Badge */}
        {!allExtinguished && (
          <div className="mt-2 flex items-center justify-center">
            {micActive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Mic className="w-3 h-3 animate-pulse text-emerald-600" />
                Mic listening: blow softly 🌬️
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum/50 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80">
                <Wind className="w-3 h-3" />
                Use button or tap candles
              </span>
            )}
          </div>
        )}
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
                        animate={{
                          scaleY: [1, 1.25, 0.95, 1.15, 1],
                          scaleX: [1, 0.88, 1.05, 0.92, 1],
                          rotate: [-3, 3, -2, 2, 0],
                        }}
                        transition={{
                          duration: 1.2 + idx * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-4 h-8 rounded-full candle-flame relative -top-1"
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
            {/* Hold to Blow Button */}
            <div className="relative w-full flex items-center justify-center">
              <motion.button
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-sm shadow-lg shadow-rose-500/30 border border-white/20 flex items-center justify-center gap-2 select-none"
              >
                <div
                  className="absolute inset-0 bg-white/30 transition-all duration-75 origin-left"
                  style={{ width: `${holdProgress}%` }}
                />

                <Wind className={`w-4 h-4 text-white relative z-10 ${isBlowingHold ? 'animate-bounce' : ''}`} />
                <span className="relative z-10 text-white font-bold">
                  {isBlowingHold ? 'Blowing... Keep Holding 🌬️' : 'Hold to Blow Candles 🌬️'}
                </span>
              </motion.button>
            </div>

            <p className="text-[11px] text-plum/50 mt-2 font-medium">
              Tip: You can also tap each candle to blow it out 🎂
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-2"
          >
            <div className="p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-rosegold/30 shadow-soft-glow w-full">
              <p className="font-script text-2xl text-rosegold">
                {config?.cakeWishTitle || "✨ Close your eyes & make a wish ✨"}
              </p>
              <p className="text-xs text-plum/80 font-medium mt-1">
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
