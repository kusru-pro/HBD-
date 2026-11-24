import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundFX() {
  // Generate random stable petals and sparkles
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: `petal-${i}`,
      left: `${(i * 7.5 + (i % 3) * 4) % 96}%`,
      delay: (i * 0.9) % 7,
      duration: 12 + (i % 5) * 2.5,
      size: 16 + (i % 4) * 6,
      rotateInit: (i * 45) % 360,
      opacity: 0.35 + (i % 3) * 0.15,
      hue: i % 2 === 0 ? '#FFD1DC' : '#E8D7FF'
    }));
  }, []);

  const sparkles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: `sparkle-${i}`,
      top: `${(i * 6.2 + 8) % 92}%`,
      left: `${(i * 9.1 + 5) % 92}%`,
      delay: (i * 0.4) % 3,
      duration: 2.5 + (i % 3),
      size: 4 + (i % 3) * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dreamy Ambient Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blush-100/70 via-blush-200/40 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-lavender-100/70 via-lavender-200/40 to-transparent blur-3xl" />
      <div className="absolute top-[40%] right-[-10%] w-[320px] h-[320px] rounded-full bg-gradient-to-l from-peach-100/50 via-cream-200/40 to-transparent blur-2xl" />

      {/* Floating Gentle Petals */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: p.left,
            top: '-40px',
            opacity: p.opacity,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80, 0],
            rotate: [p.rotateInit, p.rotateInit + 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C7 8 0 16 0 22C0 27.5 5.4 32 12 32C18.6 32 24 27.5 24 22C24 16 17 8 12 0Z"
              fill={p.hue}
              fillOpacity="0.8"
            />
            <path
              d="M12 4C8 10 3 17 3 22C3 25 7 28 12 28"
              stroke="#FFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}

      {/* Twinkling Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white shadow-soft-glow"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.7, 1.25, 0.7],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
