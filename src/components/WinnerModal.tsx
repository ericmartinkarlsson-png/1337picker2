/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ParticipantName } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Crown, Flame, Shield, Sparkles, X } from 'lucide-react';

interface WinnerModalProps {
  isOpen: boolean;
  winner: ParticipantName | null;
  topic: string;
  onClose: () => void;
}

export default function WinnerModal({
  isOpen,
  winner,
  topic,
  onClose,
}: WinnerModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!winner) return null;

  // Personalization based on the winner
  const getWinnerConfig = (name: ParticipantName) => {
    switch (name) {
      case 'Eric':
        return {
          title: 'Eric Bestämmer!',
          sub: 'Rättvisan har talat. Eric drar det längsta strået!',
          bgColor: 'bg-blue-950/95',
          borderColor: 'border-blue-500/40',
          accentColor: 'text-blue-400 bg-blue-500/10',
          buttonColor: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
          icon: <Shield className="w-12 h-12 text-blue-400 animate-pulse" />,
          decor: 'bg-blue-500/20',
          textClass: 'text-blue-200',
        };
      case 'Oliver':
        return {
          title: 'Oliver Bestämmer!',
          sub: 'Segern är säkrad. Oliver tar över rodret!',
          bgColor: 'bg-pink-950/95',
          borderColor: 'border-pink-500/40',
          accentColor: 'text-pink-400 bg-pink-500/10',
          buttonColor: 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30',
          icon: <Flame className="w-12 h-12 text-pink-400 animate-pulse" />,
          decor: 'bg-pink-500/20',
          textClass: 'text-pink-200',
        };
      case 'Elin':
        return {
          title: 'Sensation! Elin Bestämmer!',
          sub: 'BOOM! Elin knep bonusplatsen (1 av 13) och äger beslutsmakten!',
          bgColor: 'bg-amber-950/95',
          borderColor: 'border-amber-500/50',
          accentColor: 'text-amber-400 bg-amber-500/20',
          buttonColor: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-amber-950 font-bold shadow-amber-500/30',
          icon: <Crown className="w-14 h-14 text-amber-400 animate-[bounce_1s_infinite_alternate]" />,
          decor: 'bg-amber-400/30 shadow-[0_0_50px_rgba(245,158,11,0.25)]',
          textClass: 'text-amber-300 font-medium',
        };
    }
  };

  const config = getWinnerConfig(winner);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 shadow-2xl z-10 flex flex-col items-center text-center`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sparkle effects for special wins (Elin gets ultimate sparkles!) */}
            {winner === 'Elin' && (
              <>
                <div className="absolute top-10 left-10 animate-ping duration-1000">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div className="absolute top-20 right-10 animate-ping duration-1000 delay-300">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div className="absolute bottom-20 left-12 animate-ping duration-1000 delay-700">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
              </>
            )}

            {/* Circular Badge Background Glow */}
            <div className={`relative w-28 h-28 rounded-full ${config.decor} flex items-center justify-center mb-6`}>
              <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25" />
              {config.icon}
            </div>

            {/* Winner Pronouncement */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${config.accentColor}`}>
              <Award className="w-3.5 h-3.5" />
              Hjulet Har Talat
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-sans">
              {config.title}
            </h2>

            {topic.trim() && (
              <div className="mb-4 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-mono">
                  Gäller beslut för:
                </span>
                <span className="text-white text-lg font-semibold block italic">
                  "{topic}"
                </span>
              </div>
            )}

            <p className={`text-sm mb-8 leading-relaxed max-w-sm ${config.textClass}`}>
              {config.sub}
            </p>

            {/* Accept / Done Button */}
            <button
              onClick={onClose}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${config.buttonColor}`}
            >
              Klockrent!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
