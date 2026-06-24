/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SpinResult, ParticipantName } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Crown, Flame, History, Search, Shield, Trash2, HelpCircle } from 'lucide-react';

interface HistoryListProps {
  history: SpinResult[];
  onClearHistory: () => void;
  onDeleteResult: (id: string) => void;
}

export default function HistoryList({
  history,
  onClearHistory,
  onDeleteResult,
}: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.winner.toLowerCase().includes(query) ||
      item.topic.toLowerCase().includes(query)
    );
  });

  const getWinnerBadge = (name: ParticipantName) => {
    switch (name) {
      case 'Eric':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Shield className="w-3.5 h-3.5" />
            Eric
          </span>
        );
      case 'Oliver':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Flame className="w-3.5 h-3.5" />
            Oliver
          </span>
        );
      case 'Elin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 shadow-[0_0_8px_rgba(234,179,8,0.15)] animate-pulse">
            <Crown className="w-3.5 h-3.5 animate-bounce" />
            Elin (Bonus!)
          </span>
        );
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col h-[490px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white font-sans">Historik</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            Rensa allt
          </button>
        )}
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Sök på vinnare eller ämne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      )}

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-black/35 p-3 rounded-xl border border-white/5 flex justify-between items-center hover:bg-black/50 transition-all duration-200"
              >
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getWinnerBadge(item.winner)}
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                  </div>
                  
                  {item.topic.trim() ? (
                    <span className="text-sm text-slate-200 font-medium truncate italic">
                      "{item.topic}"
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic font-medium">Inget specifikt ämne</span>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => onDeleteResult(item.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Radera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="p-3 bg-black/40 rounded-full border border-white/10 mb-3">
                <HelpCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                {history.length === 0 ? 'Inga beslut fattade än' : 'Inga resultat matchar sökningen'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                {history.length === 0
                  ? 'Snurra på hjulet för att se din historik och avgöra saken!'
                  : 'Testa att söka efter något annat sökord.'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
