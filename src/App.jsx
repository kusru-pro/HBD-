import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BackgroundFX from './components/BackgroundFX';
import HeaderControls from './components/HeaderControls';
import Screen1Passcode from './components/screens/Screen1Passcode';
import Screen2Welcome from './components/screens/Screen2Welcome';
import Screen3PopHearts from './components/screens/Screen3PopHearts';
import Screen4CakeBlow from './components/screens/Screen4CakeBlow';
import Screen5Bouquet from './components/screens/Screen5Bouquet';
import Screen6Envelope from './components/screens/Screen6Envelope';
import Screen7GiftBox from './components/screens/Screen7GiftBox';
import Screen8Finale from './components/screens/Screen8Finale';
import Screen9Reply from './components/screens/Screen9Reply';
import AdminDashboard from './components/admin/AdminDashboard';
import { musicBox } from './utils/musicBox';
import { useAppConfig } from './context/AppConfigContext';

export default function App() {
  const { config } = useAppConfig();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [cleanView, setCleanView] = useState(false);

  // Admin Dashboard modal state (accessible via #admin or 5-tap gesture)
  const [isAdminOpen, setIsAdminOpen] = useState(
    typeof window !== 'undefined' && window.location.hash === '#admin'
  );

  // Lifted screen states to preserve interactions when navigating back & forth
  const [poppedHearts, setPoppedHearts] = useState([false, false, false, false]);
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [cakeExtinguished, setCakeExtinguished] = useState(false);
  const [openedComplimentCards, setOpenedComplimentCards] = useState(new Set());
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [letterTypingDone, setLetterTypingDone] = useState(false);
  const [giftTapCount, setGiftTapCount] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);

  // Resume Web Audio on first user interaction
  useEffect(() => {
    const handleFirstTouch = () => {
      musicBox.init();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };

    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  // Listen to #admin hash navigation
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);



  const handleToggleMusic = () => {
    const playing = musicBox.toggle();
    setIsMusicPlaying(playing);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentStep(prev => {
      const nextStep = Math.min(9, prev + 1);
      setMaxUnlockedStep(max => Math.max(max, nextStep));
      return nextStep;
    });
  };

  const handleBack = () => {
    if (currentStep <= 1) return;
    setDirection(-1);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSelectStep = (stepNum) => {
    if (stepNum === currentStep || stepNum > maxUnlockedStep) return;
    setDirection(stepNum > currentStep ? 1 : -1);
    setCurrentStep(stepNum);
  };

  const handleReplay = () => {
    setDirection(-1);
    setCurrentStep(1);
    setMaxUnlockedStep(1);
    setCleanView(false);
    // Reset all mini-games
    setPoppedHearts([false, false, false, false]);
    setCandlesLit([true, true, true]);
    setCakeExtinguished(false);
    setOpenedComplimentCards(new Set());
    setEnvelopeOpened(false);
    setLetterTypingDone(false);
    setGiftTapCount(0);
    setGiftOpened(false);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleConfigSaved = (newConfig) => {
    setConfig({ ...newConfig });
  };

  // Directional Screen transition variants (smooth forward/backward slides)
  const pageVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 35 : -35,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -35 : 35,
      scale: 0.98,
      transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] }
    })
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-x-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF9F6] to-[#EDE4FF]">
      {/* Floating Petals & Ambient Sparkles Background */}
      <BackgroundFX />

      {/* Mobile-First Frame Container */}
      <main className="relative z-10 w-full max-w-[430px] min-h-[100dvh] flex flex-col justify-between mx-auto shadow-2xl shadow-rosegold/10 sm:border-x border-white/60 bg-white/30 backdrop-blur-[2px]">
        {/* Global Floating Header (Back Button, Clickable 9 Progress Dots & Music Toggle) */}
        <HeaderControls
          currentStep={currentStep}
          maxUnlockedStep={maxUnlockedStep}
          totalSteps={9}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onBack={handleBack}
          onSelectStep={handleSelectStep}
          cleanView={cleanView}
          onReset={handleReplay}
        />

        {/* Dynamic Screen View with Directional Framer Motion transitions */}
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen1Passcode 
                  onUnlock={handleNext} 
                  onOpenAdmin={() => setIsAdminOpen(true)}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen2Welcome 
                  onNext={handleNext} 
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen3PopHearts
                  onNext={handleNext}
                  popped={poppedHearts}
                  setPopped={setPoppedHearts}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen4CakeBlow
                  onNext={handleNext}
                  candlesLit={candlesLit}
                  setCandlesLit={setCandlesLit}
                  allExtinguished={cakeExtinguished}
                  setAllExtinguished={setCakeExtinguished}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen5Bouquet
                  onNext={handleNext}
                  openedCards={openedComplimentCards}
                  setOpenedCards={setOpenedComplimentCards}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen6Envelope
                  onNext={handleNext}
                  isOpen={envelopeOpened}
                  setIsOpen={setEnvelopeOpened}
                  isTypingDone={letterTypingDone}
                  setIsTypingDone={setLetterTypingDone}
                />
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="step-7"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen7GiftBox
                  onNext={handleNext}
                  tapCount={giftTapCount}
                  setTapCount={setGiftTapCount}
                  isOpened={giftOpened}
                  setIsOpened={setGiftOpened}
                />
              </motion.div>
            )}

            {currentStep === 8 && (
              <motion.div
                key="step-8"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen8Finale
                  onReplay={handleReplay}
                  onGoToReply={handleNext}
                  cleanView={cleanView}
                  setCleanView={setCleanView}
                />
              </motion.div>
            )}

            {currentStep === 9 && (
              <motion.div
                key="step-9"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex justify-center"
              >
                <Screen9Reply
                  onReplay={handleReplay}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
