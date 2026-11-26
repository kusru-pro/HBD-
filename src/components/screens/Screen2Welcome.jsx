import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Crown, Gift, ArrowRight } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { firePastelConfetti } from '../../utils/confetti';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';

export default function Screen2Welcome({ onNext }) {
  const { config } = useAppConfig();
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [funMessage, setFunMessage] = useState('');
  const containerRef = useRef(null);

  const playfulMessages = [
    "Can't catch me! 😜",
    "You know you want to! 💖",
    "Nope, try again! 🌸",
    "Too slow, birthday girl! ✨",
    "Just tap YES already! 🥰",
    "I believe in you! 🏃‍♀️💨"
  ];

  const dodgeNoButton = (e) => {
    e?.preventDefault?.();
    playTapSound();
    
    // Choose random displacement within mobile bounds
    const maxOffset = 110;
    const randomX = (Math.random() - 0.5) * maxOffset * 2;
    const randomY = (Math.random() - 0.5) * maxOffset * 1.5;

    setNoPos({ x: randomX, y: randomY });
    setDodgeCount(prev => prev + 1);
    setFunMessage(playfulMessages[dodgeCount % playfulMessages.length]);
  };

  const handleYes = () => {
    playSuccessChime();
    firePastelConfetti({ x: 0.5, y: 0.5 });
    onNext();
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-4 w-full max-w-[420px] mx-auto text-center select-none"
    >
      {/* Top Welcome Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col items-center mt-2"
      >
        {/* Crown Badge */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosegold/15 border border-rosegold/30 text-rosegold text-xs font-semibold mb-3 shadow-sm"
        >
          <Crown className="w-3.5 h-3.5 fill-rosegold/30" />
          <span>Special Day Edition</span>
        </motion.div>

        {/* Script & Serif Typography */}
        <h2 className="font-script text-3xl md:text-4xl text-rosegold tracking-wide mb-1 drop-shadow-sm">
          {config?.welcomeTitle || "Happy Birthday"}
        </h2>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-plum tracking-tight leading-tight mb-2">
          {config?.recipientName || "Princess"} ✨
        </h1>

        <p className="text-xs text-plum/75 max-w-[280px] font-medium leading-relaxed">
          {config?.welcomeSubtitle || "Today is all about celebrating the most radiant, wonderful person in the world."}
        </p>
      </motion.div>

      {/* Aesthetic Pastel SVG Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative my-4 flex items-center justify-center"
      >
        {/* Glowing background ring */}
        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-blush-200/50 via-lavender-100/60 to-cream-200/50 blur-xl animate-pulse-slow" />

        {/* Decorative Glass Circle */}
        <div className="relative w-48 h-48 rounded-full glass-panel flex flex-col items-center justify-center p-6 border-2 border-white/90 shadow-float">
          {/* Animated Ribbon & Sparkles SVG */}
          <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft Gift Box Body */}
            <rect x="25" y="45" width="70" height="60" rx="14" fill="url(#giftGrad)" stroke="#FFE4EE" strokeWidth="2" />
            {/* Lid */}
            <rect x="20" y="36" width="80" height="15" rx="6" fill="#FFAEC2" stroke="#FFF" strokeWidth="1.5" />
            {/* Satin Vertical Ribbon */}
            <rect x="52" y="36" width="16" height="69" fill="#D48C9E" />
            <rect x="56" y="36" width="8" height="69" fill="#FFF" fillOpacity="0.35" />
            
            {/* Bow loop Left */}
            <path d="M60 36 C45 15, 30 25, 45 36 Z" fill="#D48C9E" stroke="#B86F81" strokeWidth="1" />
            {/* Bow loop Right */}
            <path d="M60 36 C75 15, 90 25, 75 36 Z" fill="#E5A9B8" stroke="#B86F81" strokeWidth="1" />
            <circle cx="60" cy="36" r="5" fill="#FFE4EE" stroke="#D48C9E" strokeWidth="2" />

            {/* Sparkles around */}
            <circle cx="20" cy="24" r="3" fill="#FFD700" />
            <circle cx="100" cy="30" r="2.5" fill="#FFAEC2" />
            <circle cx="95" cy="85" r="3.5" fill="#C7ADFF" />
            <circle cx="15" cy="75" r="2" fill="#E5A9B8" />

            <defs>
              <linearGradient id="giftGrad" x1="25" y1="45" x2="95" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF2EB" />
                <stop offset="0.6" stopColor="#FFE4EE" />
                <stop offset="1" stopColor="#EDE4FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Sweet Floating Tag */}
          <div className="absolute -bottom-2 bg-white/95 px-3 py-0.5 rounded-full shadow-md border border-rosegold/20 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rosegold fill-rosegold animate-pulse" />
            <span className="text-[11px] font-bold text-plum tracking-wide">Made with love</span>
          </div>
        </div>
      </motion.div>

      {/* Question & Interactive Buttons */}
      <div className="w-full max-w-[320px] flex flex-col items-center pb-4">
        <p className="font-serif italic text-base text-plum font-semibold mb-4">
          Are you ready for your little surprise?
        </p>

        {/* Fun dodge reaction message */}
        <div className="h-6 flex items-center justify-center mb-2">
          <AnimatePresence mode="wait">
            {funMessage && (
              <motion.span
                key={funMessage}
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.9 }}
                className="text-xs font-bold text-rosegold bg-white/80 px-2.5 py-0.5 rounded-full border border-rosegold/30 shadow-sm"
              >
                {funMessage}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* The Two Choice Buttons */}
        <div className="relative w-full flex flex-col gap-3 items-center">
          {/* YES Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleYes}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E11D48] to-[#9C27B0] text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-all"
          >
            <span>Yes, show me! 💖</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          {/* Playful Evasive NO Button */}
          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            onMouseEnter={dodgeNoButton}
            onTouchStart={dodgeNoButton}
            onClick={dodgeNoButton}
            className="py-2.5 px-5 rounded-xl bg-white/95 text-[#4A1530] font-bold text-xs border border-rose-300 shadow-md hover:bg-white active:bg-rose-100 transition-colors"
          >
            No 🙈
          </motion.button>
        </div>
      </div>
    </div>
  );
}
