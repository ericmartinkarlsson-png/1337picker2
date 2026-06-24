/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ParticipantName, Segment, SpinResult } from './types';
import SpinWheel from './components/SpinWheel';
import WinnerModal from './components/WinnerModal';
import StatsCard from './components/StatsCard';
import HistoryList from './components/HistoryList';
import TopicSelector from './components/TopicSelector';
import PinGate from './components/PinGate';
import { Crown, HelpCircle, Info, Play, Sparkles, Trophy, HelpCircle as HelpIcon, LogOut } from 'lucide-react';

const sliceAngle = 360 / 13;
const participantOrder: ParticipantName[] = [
  'Eric', 'Oliver', 'Eric', 'Oliver', 'Eric', 'Oliver',
  'Elin', // Bonus segment
  'Eric', 'Oliver', 'Eric', 'Oliver', 'Eric', 'Oliver'
];

const segments: Segment[] = participantOrder.map((name, index) => {
  const start = index * sliceAngle;
  const end = (index + 1) * sliceAngle;
  
  let color = '';
  let textColor = 'text-white';
  let iconName = 'User';
  
  if (name === 'Eric') {
    color = index % 2 === 0 ? '#1d4ed8' : '#3b82f6';
    iconName = 'Shield';
  } else if (name === 'Oliver') {
    color = index % 2 === 0 ? '#be185d' : '#ec4899';
    iconName = 'Flame';
  } else {
    color = '#f59e0b';
    textColor = 'text-amber-950';
    iconName = 'Crown';
  }
  
  return {
    id: index,
    name,
    angleStart: start,
    angleEnd: end,
    color,
    textColor,
    iconName,
  };
});

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('vem_bestammer_unlocked') === 'true';
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [topic, setTopic] = useState('Vem bestämmer?');
  const [winner, setWinner] = useState<ParticipantName | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('vem_bestammer_unlocked', 'true');
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('vem_bestammer_unlocked');
  };

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vem_bestammer_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Kunde inte läsa historik från localStorage:', e);
      }
    }
  }, []);

  // Spin handler with forward-only angle logic
  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Choose a random winning segment index (0 to 12)
    const winnerIndex = Math.floor(Math.random() * 13);
    const selectedSegment = segments[winnerIndex];
    
    // Calculate mid-angle of winner segment
    const midAngle = selectedSegment.angleStart + (selectedSegment.angleEnd - selectedSegment.angleStart) / 2;
    
    // Determine extra full rotations for visual velocity (4 to 6 spins)
    const extraRounds = 4 + Math.floor(Math.random() * 3);
    const baseSpins = extraRounds * 360;
    
    // Calculate target counter-clockwise angle relative to top pointer (270 degrees)
    const angleOffset = (midAngle - 270 + 360) % 360;
    const target = baseSpins + angleOffset;
    
    // Compute forward-only accumulative target rotation
    const currentRotationBase = Math.floor(targetRotation / 360) * 360;
    const finalTarget = currentRotationBase + 1440 + angleOffset; // Always add at least 4 spins to current base
    
    setTargetRotation(finalTarget);
    
    // Lock for 4 seconds (transition duration)
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedSegment.name);
      setShowWinnerModal(true);
      
      // Save results
      const date = new Date();
      const timeString = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
      const dateString = date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
      const formattedTimestamp = `${dateString}, ${timeString}`;
      
      const newResult: SpinResult = {
        id: crypto.randomUUID(),
        winner: selectedSegment.name,
        topic: topic.trim() || 'Allmänt beslut',
        timestamp: formattedTimestamp,
      };
      
      const updatedHistory = [newResult, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('vem_bestammer_history', JSON.stringify(updatedHistory));
    }, 4000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Är du säker på att du vill rensa hela historiken?')) {
      setHistory([]);
      localStorage.removeItem('vem_bestammer_history');
    }
  };

  const handleDeleteResult = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('vem_bestammer_history', JSON.stringify(updatedHistory));
  };

  // Compute dynamic winner counts for statistics
  const totalSpins = history.length;
  const winnerCounts = history.reduce(
    (acc, curr) => {
      acc[curr.winner] = (acc[curr.winner] || 0) + 1;
      return acc;
    },
    { Eric: 0, Oliver: 0, Elin: 0 } as Record<ParticipantName, number>
  );

  if (!isUnlocked) {
    return <PinGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120e2e] via-[#241335] to-[#08051a] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Decorative ambient backgrounds */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-700" />

      {/* Top Header Navigation */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl shadow-lg shadow-pink-500/15">
              <Crown className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-yellow-400 bg-clip-text text-transparent">
                VEM BESTÄMMER?
              </h1>
              <p className="text-[10px] text-pink-300 font-mono tracking-wider uppercase">
                DET ULTIMATA LYCKOHJULET
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Hur funkar det?</span>
            </button>

            <button
              onClick={handleLock}
              className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Lås appen"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lås</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        
        {/* Interactive Rules / Instructions Info Card */}
        {showGuide && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden animate-[fadeIn_0.3s_ease]">
            <div className="absolute right-4 top-4 text-white/5 font-mono text-7xl select-none font-bold opacity-10">
              SLUMPEN
            </div>
            <h3 className="text-md font-extrabold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Spelregler & Förutsättningar
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Är det svårt att enas om middagen, disken eller vilken film ni ska titta på? Låt hjulet avgöra!
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
              <li>
                <strong className="text-blue-400 font-bold">Eric</strong> har <strong className="text-white">6 platser</strong> på hjulet (~46.2% chans).
              </li>
              <li>
                <strong className="text-pink-400 font-bold">Oliver</strong> har <strong className="text-white">6 platser</strong> på hjulet (~46.2% chans).
              </li>
              <li>
                <strong className="text-yellow-400 font-bold">Elin</strong> har <strong className="text-white">1 bonusplats</strong> på hjulet (~7.7% chans). Sällsynt men kraftfullt!
              </li>
              <li>
                Skriv in ett specifikt ämne nedan för att spara vad beslutet handlade om i historiken!
              </li>
            </ul>
          </div>
        )}

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Wheel Container & Main Spin Action */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow inside the panel */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header overlay displaying current topic */}
            <div className="text-center mb-6 max-w-md">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest font-mono block mb-1">
                Beslutsfokus just nu:
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white italic truncate px-4">
                "{topic.trim() ? topic : 'Vem Bestämmer?'}"
              </h2>
            </div>

            {/* Spin Wheel Component */}
            <SpinWheel
              segments={segments}
              isSpinning={isSpinning}
              onSpinComplete={() => {}}
              targetRotation={targetRotation}
            />

            {/* Spin Trigger Button */}
            <div className="w-full max-w-md mt-6 flex flex-col items-center">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4.5 px-8 rounded-2xl bg-white hover:bg-yellow-400 text-indigo-950 hover:text-indigo-950 font-black text-xl tracking-wide shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                {/* Shining flare effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                
                <Play className="w-5 h-5 fill-indigo-950" />
                {isSpinning ? 'Snurrar hjulet...' : 'SNURRA HJULET!'}
              </button>

              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                {isSpinning ? 'Ödet är i rullning...' : 'Klicka för att avgöra direkt!'}
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Settings, Stats, and History list */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Topic Input Selector */}
            <TopicSelector
              topic={topic}
              onTopicChange={setTopic}
            />

            {/* Statistical Breakdowns */}
            <StatsCard
              totalSpins={totalSpins}
              winnerCounts={winnerCounts}
            />

            {/* Previous Spins History Logs */}
            <HistoryList
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteResult={handleDeleteResult}
            />
            
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/10 py-6 mt-12 bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs text-slate-300 font-medium">
              Vem Bestämmer? — Ett skräddarsytt lyckohjul för Eric, Oliver & Elin.
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Genererad med precision & omsorg • 13 platser • Teoretisk balans
            </p>
          </div>
          <div className="text-xs text-yellow-400 font-bold tracking-wide">
            Må turen vara på din sida! 🍀
          </div>
        </div>
      </footer>

      {/* Pop-up Celebration Modal when wheel completes its spin */}
      <WinnerModal
        isOpen={showWinnerModal}
        winner={winner}
        topic={topic}
        onClose={() => setShowWinnerModal(false)}
      />
    </div>
  );
}
