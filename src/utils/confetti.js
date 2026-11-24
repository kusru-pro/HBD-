import confetti from 'canvas-confetti';

const PASTEL_COLORS = [
  '#FFE4EE', // blush
  '#EDE4FF', // lavender
  '#FFF9F6', // cream
  '#D48C9E', // rose gold
  '#E5A9B8', // rose gold light
  '#FFCCD9', // soft pink
  '#DCCBFF', // soft purple
  '#FFD7BC'  // soft peach
];

// Single burst of pastel confetti
export function firePastelConfetti(origin = { x: 0.5, y: 0.6 }) {
  confetti({
    particleCount: 50,
    spread: 70,
    origin,
    colors: PASTEL_COLORS,
    disableForReducedMotion: true,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.1
  });
}

// Grand celebratory explosion (used for unlocked lock, candle blow, unwrap, finale)
export function fireGrandCelebration() {
  const count = 120;
  const defaults = {
    origin: { y: 0.65 },
    colors: PASTEL_COLORS,
    disableForReducedMotion: true
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 1.1 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.3 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Side cannons for extra drama
export function fireSideCannons() {
  const end = Date.now() + 1000;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: PASTEL_COLORS
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: PASTEL_COLORS
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// Continuous gentle shower for the grand finale screen
let showerInterval = null;

export function startContinuousShower() {
  if (showerInterval) return;

  showerInterval = setInterval(() => {
    confetti({
      particleCount: 3,
      angle: 90,
      spread: 120,
      origin: { x: Math.random(), y: -0.1 },
      colors: PASTEL_COLORS,
      ticks: 300,
      gravity: 0.5,
      scalar: 0.9,
      drift: (Math.random() - 0.5) * 0.5
    });
  }, 400);
}

export function stopContinuousShower() {
  if (showerInterval) {
    clearInterval(showerInterval);
    showerInterval = null;
  }
}
