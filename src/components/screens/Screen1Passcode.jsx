import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart, Delete, Sparkles, Shield } from 'lucide-react';
import { playTapSound, playErrorSound, playSuccessChime } from '../../utils/soundEffects';
import { firePastelConfetti } from '../../utils/confetti';

export default function Screen1Passcode({ onUnlock, config, onOpenAdmin }) {
  const [digits, setDigits] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Secret 5-tap gesture on padlock to launch Admin
  const [padlockTaps, setPadlockTaps] = useState(0);
  const lastTapTimeRef = useRef(0);

  const targetCode = config?.passcode || '1205';

  const handlePress = (num) => {
    if (isUnlocked || digits.length >= 4) return;
    playTapSound();
    const newDigits = digits + num;
    setDigits(newDigits);

    if (newDigits.length === 4) {
      validateCode(newDigits);
    }
  };

  const handleDelete = () => {
    if (isUnlocked || digits.length === 0) return;
    playTapSound();
    setDigits(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const validateCode = (enteredCode) => {
    if (enteredCode === targetCode) {
      setIsUnlocked(true);
      playSuccessChime();
      firePastelConfetti({ x: 0.5, y: 0.45 });
      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      setIsShaking(true);
      playErrorSound();
      setErrorMessage("Oops! Try again 🙈");
      setTimeout(() => {
        setDigits('');
        setIsShaking(false);
      }, 700);
    }
  };

  const handlePadlockSecretTap = () => {
    const now = Date.now();
    if (now - lastTapTimeRef.current > 1500) {
      setPadlockTaps(1);
    } else {
      const nextTaps = padlockTaps + 1;
      setPadlockTaps(nextTaps);
      if (nextTaps >= 5) {
        setPadlockTaps(0);
        playSuccessChime();
        onOpenAdmin?.();
        return;
      }
    }
    lastTapTimeRef.current = now;
  };

  // Allow physical keyboard entry too
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, isUnlocked, targetCode]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-6 w-full max-w-[420px] mx-auto select-none">
      {/* Top Header & Padlock */}
      <div className="flex flex-col items-center mt-2 text-center w-full">
        {/* Animated 3D-effect Padlock (5-tap secret trigger for Admin) */}
        <motion.div
          onClick={handlePadlockSecretTap}
          animate={
            isShaking
              ? { x: [-12, 12, -8, 8, -4, 4, 0] }
              : isUnlocked
              ? { scale: [1, 1.25, 1], rotate: [0, -10, 0] }
              : { y: [0, -6, 0] }
          }
          transition={{
            duration: isShaking ? 0.45 : isUnlocked ? 0.6 : 3.5,
            repeat: isShaking || isUnlocked ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className={`cursor-pointer relative w-24 h-24 rounded-3xl flex items-center justify-center p-5 shadow-rose-glow border transition-colors duration-500 active:scale-95 ${
            isUnlocked
              ? 'bg-gradient-to-tr from-rosegold-shimmer via-white to-rosegold-light border-rosegold'
              : 'bg-white/80 backdrop-blur-xl border-white/90 shadow-soft-glow'
          }`}
          title="Tap 5 times to open Admin Settings"
        >
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 rounded-3xl bg-rosegold/20 blur-xl animate-pulse" />

          {isUnlocked ? (
            <Unlock className="w-11 h-11 text-rosegold relative z-10 transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center z-10">
              <Lock className="w-10 h-10 text-rosegold" />
              <Heart className="w-4 h-4 text-rosegold-light absolute fill-rosegold-light top-4" />
            </div>
          )}

          {isUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-rosegold text-white p-1 rounded-full shadow-md"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          )}

          {/* Secret tap feedback */}
          {padlockTaps > 1 && padlockTaps < 5 && (
            <span className="absolute -bottom-2 bg-rosegold text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm animate-ping">
              {padlockTaps}
            </span>
          )}
        </motion.div>

        {/* Title & Hint */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-2xl font-bold text-plum mt-5 tracking-tight"
        >
          A Secret For You
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs text-plum/70 font-medium mt-1.5 flex items-center justify-center gap-1.5"
        >
          <span>{config?.passcodeHint || "Enter your special date 💖"}</span>
        </motion.p>

        {/* Passcode Heart Indicators */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center space-x-4 my-6"
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = digits.length > index;
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9 }}
                animate={isFilled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                  isFilled
                    ? 'bg-gradient-to-tr from-rosegold to-rosegold-light border-rosegold shadow-rose-glow text-white'
                    : 'bg-white/70 border-white/90 shadow-inner'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFilled
                      ? 'fill-white text-white drop-shadow-sm scale-110'
                      : 'text-rosegold/35'
                  }`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Error Toast */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="px-3 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold border border-rose-200/80 shadow-sm"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Glassmorphic Numeric Keypad */}
      <div className="w-full max-w-[320px] pb-2">
        <div className="grid grid-cols-3 gap-3.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePress(num)}
              disabled={isUnlocked}
              className="h-14 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-glass text-xl font-bold text-plum/90 hover:bg-white hover:text-rosegold transition-colors flex items-center justify-center active:bg-rosegold-shimmer/40"
            >
              {num}
            </motion.button>
          ))}

          {/* Empty spacer / Heart decor */}
          <div className="h-14 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rosegold/30 fill-rosegold/10 animate-pulse" />
          </div>

          {/* Digit 0 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePress('0')}
            disabled={isUnlocked}
            className="h-14 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-glass text-xl font-bold text-plum/90 hover:bg-white hover:text-rosegold transition-colors flex items-center justify-center active:bg-rosegold-shimmer/40"
          >
            0
          </motion.button>

          {/* Backspace Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleDelete}
            disabled={isUnlocked || digits.length === 0}
            className={`h-14 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-glass flex items-center justify-center transition-colors ${
              digits.length > 0
                ? 'text-plum hover:bg-white hover:text-rose-600 cursor-pointer active:bg-rose-50'
                : 'text-plum/30 cursor-not-allowed'
            }`}
            aria-label="Delete last digit"
          >
            <Delete className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Small hint footer */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <p className="text-[11px] text-plum/50 font-medium">
            Hint: Default code is {targetCode} 🌸
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[10px] text-rosegold/40 hover:text-rosegold ml-1 underline decoration-dotted"
            title="Open Admin Dashboard"
          >
            (Admin)
          </button>
        </div>
      </div>
    </div>
  );
}
