import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoAsset from '../assets/images/skillswap_logo_1788606818943.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let current = 0;
    const durationMs = 2400; // ~2.4 seconds total for a clear 0% -> 100% progress
    const stepMs = 30;
    const stepIncrement = 100 / (durationMs / stepMs);

    const interval = setInterval(() => {
      current += stepIncrement;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);

        // Pause at 100% so user sees completion
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onCompleteRef.current();
          }, 450);
        }, 350);
      } else {
        setProgress(Math.floor(current));
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-4 select-none overflow-hidden"
        >
          {/* Subtle background aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-tr from-sky-100/60 via-teal-50/50 to-emerald-100/60 rounded-full blur-3xl pointer-events-none" />

          {/* Central Authentic Logo Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
          >
            {/* The exact logo photo as provided by the user as-is */}
            <img
              src="/logo.jpg"
              alt="SkillSwap Logo"
              className="w-64 sm:w-72 max-w-[85vw] h-auto object-contain"
            />

            {/* Horizontal Loading Line 0% -> 100% */}
            <div className="w-64 sm:w-72 mt-6">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/70 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Real-time Percentage & Loading Status */}
              <div className="flex justify-between items-center mt-2 px-1 text-xs font-semibold text-slate-500">
                <span className="text-slate-400 font-normal">Loading...</span>
                <span className="font-mono text-sky-600 font-bold">{progress}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
