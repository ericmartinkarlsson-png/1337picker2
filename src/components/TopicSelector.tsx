/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Sparkles, Pin } from 'lucide-react';

interface TopicSelectorProps {
  topic: string;
  onTopicChange: (val: string) => void;
}

export default function TopicSelector({ topic, onTopicChange }: TopicSelectorProps) {
  const presets = [
    { label: '🍕 Vad ska vi äta?', value: 'Vad ska vi äta till middag?' },
    { label: '🎬 Filmkväll', value: 'Vilken film ska vi se?' },
    { label: '🧼 Vem diskar?', value: 'Vem tar hand om disken idag?' },
    { label: '🎵 Välja musik', value: 'Vem bestämmer musiken i bilen?' },
    { label: '🚗 Helgplaner', value: 'Vad ska vi hitta på i helgen?' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white font-sans">Vad bestämmer ni om?</h3>
      </div>

      {/* Input Field */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Skriv vad ni ska besluta om... (valfritt)"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 focus:border-pink-500 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          {topic.trim() && (
            <button
              onClick={() => onTopicChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-300 hover:text-white bg-black/50 px-2 py-1 rounded border border-white/10"
            >
              Rensa
            </button>
          )}
        </div>

        {/* Preset Suggestions */}
        <div>
          <span className="text-[11px] font-bold text-pink-300/80 uppercase tracking-wider font-mono block mb-2">
            Populära snabbval:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const isSelected = topic === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => onTopicChange(p.value)}
                  className={`text-xs px-3 py-2 rounded-xl border transition-all transform active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/10 font-bold'
                      : 'bg-black/35 hover:bg-black/50 text-slate-300 hover:text-white border-white/5'
                  }`}
                >
                  <Pin className={`w-3 h-3 ${isSelected ? 'text-yellow-300' : 'text-slate-500'}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
