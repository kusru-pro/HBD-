import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, X, Check, ArrowRight } from 'lucide-react';
import { CONFIG } from '../../config';
import { playTapSound, playSuccessChime } from '../../utils/soundEffects';
import { firePastelConfetti } from '../../utils/confetti';

export default function Screen5Bouquet({ onNext, openedCards, setOpenedCards, config }) {
  const compliments = config?.complimentsList || CONFIG.complimentsList || [];
  const [activeCard, setActiveCard] = useState(null);

  // Positions of the 6 floating tags around the bouquet
  const tagPositions = [
    { top: '6%', left: '4%', label: '✨ Smile', delay: 0 },
    { top: '4%', right: '4%', label: '🌸 Warmth', delay: 0.3 },
    { top: '38%', left: '-2%', label: '🦢 Grace', delay: 0.6 },
    { top: '36%', right: '-2%', label: '🌙 Soul', delay: 0.2 },
    { bottom: '10%', left: '8%', label: '🎶 Joy', delay: 0.5 },
    { bottom: '8%', right: '8%', label: '💖 Always', delay: 0.4 },
  ];

  const handleOpenCard = (item, index, e) => {
    playTapSound();
    setActiveCard({ ...item, index });

    if (!openedCards.has(item.id)) {
      const nextOpened = new Set(openedCards).add(item.id);
      setOpenedCards(nextOpened);

      // Mini confetti when first opening
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      firePastelConfetti({ x, y });

      if (nextOpened.size === 3 || nextOpened.size === compliments.length) {
        setTimeout(playSuccessChime, 300);
      }
    }
  };

  const closeCard = () => {
    playTapSound();
    setActiveCard(null);
  };

  const unlockedNext = openedCards.size >= 3;

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100dvh-90px)] px-4 py-3 w-full max-w-[420px] mx-auto text-center select-none relative">
      {/* Top Header */}
      <div className="w-full flex flex-col items-center mt-1">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-rosegold text-xs font-semibold shadow-sm mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Garden of Compliments</span>
        </motion.div>

        <h2 className="font-serif text-2xl font-bold text-plum mb-1 tracking-tight">
          Bloom For You 💐
        </h2>
        <p className="text-xs text-plum/70 font-medium max-w-[280px]">
          Tap the glowing tags around the floral bouquet to reveal sweet notes written for you.
        </p>

        {/* Discovery Tracker Badge */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-rosegold/30 shadow-sm text-xs font-semibold text-plum">
          <Heart className="w-3 h-3 text-rosegold fill-rosegold" />
          <span>
            {openedCards.size} of {compliments.length} discovered
          </span>
          {unlockedNext && <span className="text-emerald-600 font-bold ml-1">✓ Unlocked!</span>}
        </div>
      </div>

      {/* Center Bouquet Illustration & 6 Floating Tag Buttons */}
      <div className="relative w-full max-w-[340px] h-[320px] my-auto flex items-center justify-center">
        {/* Soft Floral Aura */}
        <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-blush-200/50 via-lavender-200/40 to-cream-100 blur-2xl" />

        {/* The 6 Floating Tags */}
        {compliments.map((item, index) => {
          const pos = tagPositions[index % tagPositions.length];
          const isOpened = openedCards.has(item.id);

          return (
            <motion.button
              key={item.id}
              style={{
                position: 'absolute',
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
              }}
              animate={{
                y: [0, -6, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 3 + index * 0.3,
                repeat: Infinity,
                delay: pos.delay,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => handleOpenCard(item, index, e)}
              className={`z-20 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-md flex items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                isOpened
                  ? 'bg-white/95 text-rosegold border-rosegold/40 shadow-rose-glow'
                  : 'bg-white/85 text-plum border-white/90 hover:bg-white animate-pulse-slow'
              }`}
            >
              <span>{item.emoji}</span>
              <span className="text-[11px] font-semibold">{item.tag}</span>
              {isOpened && <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />}
            </motion.button>
          );
        })}

        {/* Central Floral Bouquet Illustration (Roses, Lavender, Ribbons) */}
        <div className="relative z-10 w-48 h-56 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full drop-shadow-md" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 120 L70 190" stroke="#7BAE7F" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 120 L80 195" stroke="#689F6D" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M80 120 L92 190" stroke="#7BAE7F" strokeWidth="4" strokeLinecap="round" />
            
            <polygon points="62,145 98,145 90,185 70,185" fill="#FFE4EE" stroke="#E5A9B8" strokeWidth="1.5" />
            <ellipse cx="80" cy="155" rx="14" ry="4" fill="#D48C9E" />
            <circle cx="80" cy="155" r="4.5" fill="#B86F81" />
            <path d="M80 155 Q65 170 58 190" stroke="#D48C9E" strokeWidth="2" fill="none" />
            <path d="M80 155 Q95 170 102 190" stroke="#D48C9E" strokeWidth="2" fill="none" />

            <path d="M55 105 Q35 95 45 80 Q65 90 55 105 Z" fill="#9AC89C" />
            <path d="M105 105 Q125 95 115 80 Q95 90 105 105 Z" fill="#9AC89C" />

            <g transform="translate(40, 45) rotate(-20)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#7BAE7F" strokeWidth="2" />
              <ellipse cx="-4" cy="5" rx="3" ry="5" fill="#C7ADFF" />
              <ellipse cx="4" cy="10" rx="3" ry="5" fill="#DCCBFF" />
              <ellipse cx="-4" cy="15" rx="3" ry="5" fill="#B490FF" />
              <ellipse cx="4" cy="20" rx="3" ry="5" fill="#C7ADFF" />
            </g>
            <g transform="translate(115, 35) rotate(20)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#7BAE7F" strokeWidth="2" />
              <ellipse cx="-4" cy="5" rx="3" ry="5" fill="#C7ADFF" />
              <ellipse cx="4" cy="10" rx="3" ry="5" fill="#DCCBFF" />
              <ellipse cx="-4" cy="15" rx="3" ry="5" fill="#B490FF" />
            </g>

            <g transform="translate(80, 85)">
              <circle cx="0" cy="0" r="22" fill="#FFAEC2" />
              <path d="M-15 -5 C-12 -18 12 -18 15 -5 C18 10 -18 12 -15 -5 Z" fill="#F48BA7" />
              <path d="M-8 -3 C-5 -10 5 -10 8 -3 C10 5 -10 6 -8 -3 Z" fill="#D48C9E" />
              <circle cx="0" cy="0" r="5" fill="#FFF" fillOpacity="0.4" />
            </g>

            <g transform="translate(56, 75)">
              <circle cx="0" cy="0" r="17" fill="#FFCCD9" />
              <path d="M-10 -4 C-8 -12 8 -12 10 -4 C12 8 -12 9 -10 -4 Z" fill="#FFAEC2" />
            </g>

            <g transform="translate(104, 75)">
              <circle cx="0" cy="0" r="17" fill="#EDE4FF" />
              <path d="M-10 -4 C-8 -12 8 -12 10 -4 C12 8 -12 9 -10 -4 Z" fill="#DCCBFF" />
            </g>

            <g transform="translate(80, 52)">
              <circle cx="0" cy="0" r="14" fill="#FFEAD9" />
              <circle cx="0" cy="0" r="8" fill="#FFBCA1" />
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Button Area */}
      <div className="w-full max-w-[320px] pb-4 flex flex-col items-center">
        {unlockedNext ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rosegold via-rosegold-light to-rosegold text-white font-bold text-sm shadow-rose-glow flex items-center justify-center gap-2 border border-white/50"
          >
            <span>Next Surprise →</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <p className="text-[11px] text-plum/50 font-medium">
            Discover at least 3 cards to continue ({openedCards.size}/3)
          </p>
        )}
      </div>

      {/* Polaroid Modal Card Pop-up */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeCard}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30, rotate: -4 }}
              animate={{ scale: 1, y: 0, rotate: ((activeCard.index % 2 === 0) ? -2 : 2) }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[300px] bg-[#FFFDF9] rounded-2xl p-5 polaroid-shadow border-4 border-white flex flex-col items-center text-center select-none"
            >
              <div className="absolute -top-3 w-28 h-6 washi-tape rounded-sm rotate-[-2deg] shadow-sm" />

              <button
                onClick={closeCard}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-blush-50 text-plum/60 hover:text-plum hover:bg-blush-100 transition-colors"
                aria-label="Close card"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-36 mt-2 rounded-xl bg-gradient-to-tr from-blush-100 via-cream-100 to-lavender-100 border border-white flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner">
                <span className="text-4xl filter drop-shadow-sm mb-1 animate-bounce">
                  {activeCard.emoji}
                </span>
                <span className="font-script text-xl text-rosegold font-bold">
                  {activeCard.title}
                </span>
              </div>

              <div className="mt-4 px-1 pb-1">
                <p className="font-serif text-sm text-plum/85 leading-relaxed italic">
                  "{activeCard.text}"
                </p>

                <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-rosegold uppercase tracking-wider">
                  <Heart className="w-3 h-3 fill-rosegold" />
                  <span>{activeCard.tag}</span>
                </div>
              </div>

              <button
                onClick={closeCard}
                className="mt-4 w-full py-2 rounded-xl bg-blush-100/70 text-plum font-semibold text-xs hover:bg-blush-200/70 transition-colors"
              >
                Keep in Heart 💖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
