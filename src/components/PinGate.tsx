import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';

interface PinGateProps {
  onUnlock: () => void;
}

export default function PinGate({ onUnlock }: PinGateProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const CORRECT_PIN = '1337';

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setError(false);
          setPin(prev => prev + e.key);
        }
      } else if (e.key === 'Backspace') {
        setError(false);
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pin, isSuccess]);

  // Handle PIN submissions automatically or manually
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pin]);

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      setIsSuccess(true);
      setError(false);
      // Play a short sound if desired, or just trigger success callback after visual success transition
      setTimeout(() => {
        onUnlock();
      }, 800);
    } else {
      setError(true);
      // Shake animation trigger
      const timer = setTimeout(() => {
        setPin('');
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  const handleNumberClick = (num: string) => {
    if (isSuccess) return;
    if (pin.length < 4) {
      setError(false);
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (isSuccess) return;
    setError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isSuccess) return;
    setError(false);
    setPin('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120e2e] via-[#241335] to-[#08051a] text-slate-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      
      {/* Decorative ambient backgrounds */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top visual shield badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            animate={
              isSuccess 
                ? { scale: [1, 1.2, 1], rotate: [0, 360, 360], backgroundColor: '#22c55e' }
                : error 
                  ? { x: [-10, 10, -10, 10, 0] }
                  : {}
            }
            transition={{ duration: error ? 0.3 : 0.6 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
              isSuccess 
                ? 'bg-green-500 border-green-400 text-white shadow-green-500/20'
                : error 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/10'
                  : 'bg-white/5 border-white/10 text-pink-400 shadow-pink-500/10'
            }`}
          >
            {isSuccess ? (
              <Unlock className="w-8 h-8" />
            ) : error ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </motion.div>

          <h2 className="text-2xl font-black mt-4 tracking-tight bg-gradient-to-r from-white via-slate-200 to-yellow-400 bg-clip-text text-transparent uppercase">
            SÄKERHETSVerifiering
          </h2>
          <p className="text-xs text-pink-300 font-mono tracking-wider uppercase mt-1">
            Endast godkända beslutsfattare
          </p>
        </div>

        {/* Pin display indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-4 justify-center items-center h-12 mb-3">
            {[0, 1, 2, 3].map((index) => {
              const hasDigit = pin.length > index;
              return (
                <motion.div
                  key={index}
                  animate={
                    isSuccess
                      ? { scale: [1, 1.2, 1], backgroundColor: '#22c55e' }
                      : error
                        ? { scale: [1, 1.1, 1], backgroundColor: '#f43f5e' }
                        : hasDigit 
                          ? { scale: [1, 1.2, 1] } 
                          : {}
                  }
                  className={`w-5 h-5 rounded-full border transition-all duration-150 ${
                    isSuccess
                      ? 'bg-green-500 border-green-400 shadow-[0_0_8px_#22c55e]'
                      : error
                        ? 'bg-rose-500 border-rose-400 shadow-[0_0_8px_#f43f5e]'
                        : hasDigit
                          ? 'bg-pink-500 border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.8)]'
                          : 'bg-black/40 border-white/15'
                  }`}
                />
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-xs text-rose-400 font-bold font-mono tracking-wide"
              >
                Felaktig pinkod! Försök igen.
              </motion.span>
            ) : isSuccess ? (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-xs text-green-400 font-bold font-mono tracking-wide"
              >
                Korrekt kod! Låser upp...
              </motion.span>
            ) : (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-slate-400 font-medium font-sans"
              >
                Ange 4-siffrig pinkod för att öppna lyckohjulet
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Numerical Keyboard */}
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleNumberClick(num)}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 hover:border-white/10 text-white font-extrabold text-xl font-sans transition-all flex items-center justify-center cursor-pointer select-none"
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleClear}
            className="h-14 rounded-2xl bg-black/20 hover:bg-black/30 active:bg-black/40 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase transition-all flex items-center justify-center cursor-pointer select-none"
          >
            Rensa
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleNumberClick('0')}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 hover:border-white/10 text-white font-extrabold text-xl font-sans transition-all flex items-center justify-center cursor-pointer select-none"
          >
            0
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-black/20 hover:bg-black/30 active:bg-black/40 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase transition-all flex items-center justify-center cursor-pointer select-none"
          >
            Radera
          </motion.button>
        </div>

        {/* Bottom indicator badge */}
        <div className="border-t border-white/5 pt-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
            <KeyRound className="w-3 h-3" />
            Lösenordsskyddad applikation
          </span>
        </div>
      </motion.div>
    </div>
  );
}
