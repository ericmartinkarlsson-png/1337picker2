/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ParticipantName } from '../types';
import { motion } from 'motion/react';
import { Crown, Flame, Shield, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

interface StatsCardProps {
  totalSpins: number;
  winnerCounts: Record<ParticipantName, number>;
}

export default function StatsCard({ totalSpins, winnerCounts }: StatsCardProps) {
  const [simulationResult, setSimulationResult] = useState<{
    Eric: number;
    Oliver: number;
    Elin: number;
    total: number;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Theoretical stats
  const participants = [
    {
      name: 'Eric' as ParticipantName,
      slots: 6,
      pct: '46.2%',
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      sub: '6 av 13 platser'
    },
    {
      name: 'Oliver' as ParticipantName,
      slots: 6,
      pct: '46.2%',
      color: 'bg-pink-500',
      textColor: 'text-pink-400',
      icon: <Flame className="w-4 h-4 text-pink-400" />,
      sub: '6 av 13 platser'
    },
    {
      name: 'Elin' as ParticipantName,
      slots: 1,
      pct: '7.7%',
      color: 'bg-yellow-400',
      textColor: 'text-yellow-400',
      icon: <Crown className="w-4 h-4 text-yellow-400" />,
      sub: '1 av 13 platser (Bonus!)'
    }
  ];

  // Run a quick Monte Carlo simulation of 1000 spins for fun!
  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const counts = { Eric: 0, Oliver: 0, Elin: 0 };
      const wheelOrder: ParticipantName[] = [
        'Eric', 'Oliver', 'Eric', 'Oliver', 'Eric', 'Oliver',
        'Elin',
        'Eric', 'Oliver', 'Eric', 'Oliver', 'Eric', 'Oliver'
      ];
      
      for (let i = 0; i < 1000; i++) {
        const randIndex = Math.floor(Math.random() * 13);
        const winner = wheelOrder[randIndex];
        counts[winner]++;
      }
      
      setSimulationResult({
        ...counts,
        total: 1000
      });
      setIsSimulating(false);
    }, 600); // Small delay to feel like computation is happening
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white font-sans">Sannolikhet & Statistik</h3>
      </div>

      <p className="text-slate-300 text-sm mb-6 font-medium">
        Hjulet är indelat i 13 delar baserat på era platser. Här ser ni era teoretiska chanser att få bestämma:
      </p>

      {/* Grid of Theoretical Chances */}
      <div className="space-y-4 mb-6">
        {participants.map((p) => {
          // Calculate actual real wins pct if any spins exist
          const realPct = totalSpins > 0 
            ? ((winnerCounts[p.name] / totalSpins) * 100).toFixed(1) + '%' 
            : '0%';

          return (
            <div key={p.name} className="bg-black/30 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                    {p.icon}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block">{p.sub}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white block">{p.pct}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Faktiskt: {winnerCounts[p.name]} vinst{winnerCounts[p.name] !== 1 ? 'er' : ''} ({realPct})
                  </span>
                </div>
              </div>

              {/* Progress bar representing weight */}
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full ${p.color} rounded-full`}
                  style={{ width: p.name === 'Elin' ? '7.7%' : '46.2%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Monte Carlo Simulator Playground */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Snabbsimulator (1000 snurr)
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Provkör ödet! Testa slumpen med 1000 blixtsnabba snurr.
            </p>
          </div>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="p-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400/30 text-pink-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {simulationResult ? (
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
            {(['Eric', 'Oliver', 'Elin'] as ParticipantName[]).map((name) => {
              const val = simulationResult[name];
              const pct = ((val / 1000) * 100).toFixed(1);
              const color = name === 'Eric' 
                ? 'text-blue-400 font-bold' 
                : name === 'Oliver' 
                  ? 'text-pink-400 font-bold' 
                  : 'text-yellow-400 font-bold';
              return (
                <div key={name} className="text-center bg-black/40 py-2 rounded-lg">
                  <span className="text-[11px] text-slate-300 block font-sans">{name}</span>
                  <span className={`text-sm font-extrabold block ${color}`}>{val}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400 italic font-mono mt-2">
            Ingen simulation körd än. Klicka för att testa!
          </div>
        )}
      </div>
    </div>
  );
}
