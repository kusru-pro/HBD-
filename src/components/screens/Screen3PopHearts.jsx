import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useAppConfig } from '../../context/AppConfigContext';
import { playPopSound, playSuccessChime, playTapSound } from '../../utils/soundEffects';
import { firePastelConfetti } from '../../utils/confetti';

const BALLOON_STYLES = [
  {
    bg: 'from-[#FFAEC2] to-[#FFCCD9]',
    border: 'border-[#F48BA7]',
    shadow: 'shadow-[0_10px_25px_rgba(244,139,167,0.35)]',
    string: '#F48BA7',
    label: 'Pink Heart'
  },
  {
    bg: 'from-[#C7ADFF] to-[#EDE4FF]',
    border: 'border-[#B490FF]',
    shadow: 'shadow-[0_10px_25px_rgba(199,173,255,0.35)]',
    string: '#B490FF',
    label: 'Lavender Heart'
  },
  {
    bg: 'from-[#FFBCA1] to-[#FFEAD9]',
    border: 'border-[#FFA882]',
    shadow: 'shadow-[0_10px_25px_rgba(255,188,161,0.35)]',
    string: '#FFA882',
    label: 'Peach Heart'
  },
  {
    bg: 'from-[#E5A9B8] to-[#FFF5F8]',
    border: 'border-[#D48C9E]',
    shadow: 'shadow-[0_10px_25px_rgba(212,140,158,0.35)]',
    string: '#D48C9E',
    label: 'Rose Gold Heart'
  }
];

export default function Screen3PopHearts({ onNext, popped, setPopped }) {
  const { config } = useAppConfig();
  const words = config?.hiddenMessageWords || ["You", "Make", "Everything", "Magical"];
  const allPopped = popped.every(Boolean);

  const handlePop = (index, e) => {
    if (popped[index]) return;
    playPopSound();

    // Calculate approximate coordinates for confetti burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePastelConfetti({ x, y });

    const newPopped = [...popped];
    newPopped[index] = true;
    setPopped(newPopped);

    if (newPopped.every(Boolean)) {
      setTimeout(() => {
        playSuccessChime();
        firePastelConfetti({ x: 0.5, y: 0.3 });
      }, 500);
    }
  };

  const handleResetBalloons = (e) => {
    e.stopPropagation();
    playTapSound();
    setPopped([false, false, false, false]);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-4 w-full max-w-[420px] mx-auto text-center select-none">
      {/* Top Header & Instructions */}
      <div className="w-full flex flex-col items-center mt-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-rosegold text-xs font-semibold shadow-sm mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Mini-Game</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Pop The Sweet Hearts
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[260px]">
          Tap each floating pastel heart balloon to unlock a hidden secret message 🎈
        </p>

        {/* Revealed Words Banner */}
        <div className="mt-4 w-full p-3 rounded-2xl glass-panel border border-white/90 shadow-soft-glow flex items-center justify-around gap-1.5">
          {words.map((word, i) => {
            const isRevealed = popped[i];
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.9 }}
                animate={isRevealed ? { scale: [1, 1.15, 1], y: [0, -3, 0] } : {}}
                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all duration-400 ${
                  isRevealed
                    ? 'bg-gradient-to-tr from-rosegold-light/30 to-blush-100 border border-rosegold/40 shadow-sm'
                    : 'bg-white/40 border border-white/60 border-dashed'
                }`}
              >
                {isRevealed ? (
                  <span className="font-serif text-xs md:text-sm font-bold text-plum tracking-wide">
                    {word}
                  </span>
                ) : (
                  <span className="text-[10px] text-plum/30 font-semibold">
                    ? ? ?
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating 4 Balloons Arena */}
      <div className="relative w-full max-w-[340px] h-[310px] my-auto flex items-center justify-center">
        {words.map((word, index) => {
          const style = BALLOON_STYLES[index % BALLOON_STYLES.length];
          const isPopped = popped[index];

          // 2x2 floating positions
          const positions = [
            { top: '8%', left: '8%', delay: 0 },
            { top: '5%', right: '8%', delay: 0.4 },
            { bottom: '8%', left: '12%', delay: 0.8 },
            { bottom: '12%', right: '12%', delay: 0.2 },
          ];
          const pos = positions[index];

          return (
            <AnimatePresence key={index}>
              {!isPopped ? (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                  }}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 3 + index * 0.4,
                    repeat: Infinity,
                    delay: pos.delay,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handlePop(index, e)}
                  className="cursor-pointer group flex flex-col items-center"
                >
                  {/* Balloon Body (Heart with glossy shine) */}
                  <div className={`relative w-24 h-24 rounded-full bg-gradient-to-tr ${style.bg} ${style.border} border-2 ${style.shadow} flex items-center justify-center`}>
                    {/* Glossy top-left highlight */}
                    <div className="absolute top-2.5 left-4 w-7 h-4 bg-white/65 rounded-full blur-[1px] rotate-[-25deg]" />
                    <div className="absolute top-4 left-3 w-2.5 h-2.5 bg-white/80 rounded-full blur-[0.5px]" />

                    {/* Cute inner heart icon */}
                    <Heart className="w-8 h-8 text-white/90 fill-white/80 drop-shadow-sm group-hover:scale-110 transition-transform" />

                    {/* Pop me label badge */}
                    <span className="absolute -bottom-2 bg-white/90 text-plum font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm border border-white">
                      Tap me!
                    </span>
                  </div>

                  {/* Little tied knot & wavy ribbon string */}
                  <div 
                    className="w-2.5 h-2 rounded-sm -mt-0.5" 
                    style={{ backgroundColor: style.string }}
                  />
                  <svg width="18" height="28" viewBox="0 0 18 28" fill="none" className="opacity-60">
                    <path
                      d="M9 0 C14 8, 4 18, 9 28"
                      stroke={style.string}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key={`burst-${index}`}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                  }}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none flex items-center justify-center w-24 h-24"
                >
                  <Sparkles className="w-10 h-10 text-rosegold" />
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center">
        {allPopped ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full flex flex-col gap-2"
          >
            <p className="text-xs font-semibold text-rosegold font-script text-base">
              ✨ "You Make Everything Magical" ✨
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold text-white font-bold text-sm shadow-rose-glow flex items-center justify-center gap-2 border border-white/50 animate-pulse-slow"
            >
              <span>Next Surprise →</span>
            </motion.button>

            {/* Optional replay button for this screen */}
            <button
              onClick={handleResetBalloons}
              className="text-[11px] text-plum/50 hover:text-rosegold flex items-center justify-center gap-1 mt-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Pop balloons again</span>
            </button>
          </motion.div>
        ) : (
          <p className="text-[11px] text-plum/60 font-medium">
            {popped.filter(Boolean).length} of 4 hearts opened
          </p>
        )}
      </div>
    </div>
  );
}
