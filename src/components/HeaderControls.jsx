import React from 'react';
import { Volume2, VolumeX, Sparkles, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { playTapSound } from '../utils/soundEffects';

export default function HeaderControls({ 
  currentStep, 
  maxUnlockedStep = 1,
  totalSteps = 9, 
  isMusicPlaying, 
  onToggleMusic, 
  onBack,
  onSelectStep,
  cleanView,
  onReset 
}) {
  if (cleanView) return null;

  const showBackButton = currentStep > 1;

  const handleStepClick = (stepNum) => {
    if (stepNum === currentStep) return;
    if (stepNum <= maxUnlockedStep) {
      playTapSound();
      onSelectStep(stepNum);
    }
  };

  const handleBackClick = () => {
    playTapSound();
    onBack();
  };

  return (
    <header className="relative z-30 pt-4 pb-2 px-4 flex items-center justify-between w-full max-w-[430px] mx-auto select-none">
      {/* Top Left: Circular Back Button (or Branding pill on Screen 1) */}
      <div className="w-10 h-10 flex items-center justify-start">
        {showBackButton ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleBackClick}
            aria-label="Go back to previous screen"
            className="w-9 h-9 rounded-full bg-white/95 text-[#4A1530] border border-rose-300 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-[#4A1530] -ml-0.5 stroke-[2.5]" />
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-9 h-9 rounded-full bg-white/95 border border-rose-300 shadow-md flex items-center justify-center"
            title="Birthday Surprise"
          >
            <Sparkles className="w-4 h-4 text-[#D81B60] animate-pulse" />
          </motion.div>
        )}
      </div>

      {/* Progress Dots: Interactive for visited/unlocked screens */}
      <div className="flex items-center space-x-2 bg-white/65 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/85 shadow-sm">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isUnlocked = stepNum <= maxUnlockedStep;

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={!isUnlocked}
              onClick={() => handleStepClick(stepNum)}
              whileHover={isUnlocked ? { scale: 1.3 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              aria-label={`Go to screen ${stepNum}`}
              className={`rounded-full transition-all duration-300 focus:outline-none ${
                isActive
                  ? 'w-4 h-1.5 bg-gradient-to-r from-rosegold to-rosegold-light shadow-sm cursor-default'
                  : isUnlocked
                  ? 'w-1.5 h-1.5 bg-rosegold/70 hover:bg-rosegold cursor-pointer'
                  : 'w-1.5 h-1.5 bg-plum/20 cursor-not-allowed opacity-50'
              }`}
              layout
            />
          );
        })}
      </div>

      {/* Top Right: Music Toggle Button */}
      <div className="w-10 h-10 flex items-center justify-end">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleMusic}
          aria-label="Toggle background music"
          className={`relative w-9 h-9 rounded-full border transition-all duration-300 shadow-md flex items-center justify-center ${
            isMusicPlaying
              ? 'bg-white text-[#D81B60] border-rose-400 shadow-rose-500/20'
              : 'bg-white/95 text-[#4A1530] border-rose-300 hover:bg-white hover:text-[#D81B60]'
          }`}
        >
          {isMusicPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#D81B60]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D81B60] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D81B60]"></span>
              </span>
            </>
          ) : (
            <VolumeX className="w-4 h-4 stroke-[2]" />
          )}
        </motion.button>
      </div>
    </header>
  );
}
