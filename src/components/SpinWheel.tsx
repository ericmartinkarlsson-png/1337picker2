/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ParticipantName, Segment } from '../types';
import { Crown, Flame, Shield, Sparkles } from 'lucide-react';

interface SpinWheelProps {
  segments: Segment[];
  isSpinning: boolean;
  onSpinComplete: (winner: ParticipantName) => void;
  targetRotation: number;
}

export default function SpinWheel({
  segments,
  isSpinning,
  onSpinComplete,
  targetRotation,
}: SpinWheelProps) {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [tickerActive, setTickerActive] = useState(false);

  // Keep track of rotation to prevent resetting backward
  useEffect(() => {
    if (targetRotation > 0) {
      setCurrentRotation(targetRotation);
      setTickerActive(true);

      // Reset ticker effect after spin completes
      const timer = setTimeout(() => {
        setTickerActive(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [targetRotation]);

  // Utility to convert polar coordinates to cartesian for SVG pathing
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Generate path coordinates for a pie wedge
  const describeWedge = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', x, y,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const center = 250;
  const radius = 230;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Glow Ring & Shadows */}
      <div className="absolute inset-0 m-auto w-[470px] h-[470px] rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

      {/* Main Wheel Container */}
      <div className="relative w-[480px] h-[480px] max-w-full aspect-square flex items-center justify-center">
        
        {/* Physical Wheel Frame */}
        <div className="absolute inset-2 rounded-full border-[8px] border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.3),_inset_0_4px_12px_rgba(255,255,255,0.15)] bg-slate-900 pointer-events-none z-0" />
        
        {/* Lights / Pins on the outer rim */}
        <div className="absolute inset-2 w-[464px] h-[464px] pointer-events-none z-10 rounded-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const style = {
              transform: `rotate(${angle}deg) translateY(-222px)`,
            };
            return (
              <div
                key={i}
                style={style}
                className={`absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full shadow-[0_0_8px_currentColor] transition-all duration-300 ${
                  tickerActive
                    ? i % 2 === 0
                      ? 'bg-amber-400 text-amber-300 scale-110'
                      : 'bg-indigo-400 text-indigo-300 scale-90'
                    : 'bg-amber-400/80 text-amber-400/80'
                }`}
              />
            );
          })}
        </div>

        {/* SVG Spinning Wheel */}
        <svg
          ref={wheelRef}
          viewBox="0 0 500 500"
          className="w-[440px] h-[440px] z-10 transition-transform select-none"
          style={{
            transform: `rotate(${-currentRotation}deg)`,
            transition: isSpinning
              ? 'transform 4000ms cubic-bezier(0.12, 0.8, 0.15, 1)'
              : 'none',
          }}
        >
          <defs>
            {/* High-quality gradients for the segments */}
            {/* Eric Gradients (Vibrant Blue) */}
            <linearGradient id="grad-eric-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="grad-eric-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            {/* Oliver Gradients (Vibrant Pink) */}
            <linearGradient id="grad-oliver-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            <linearGradient id="grad-oliver-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Elin Sparkle Gold Gradient */}
            <linearGradient id="grad-elin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Inner center glass glow */}
            <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="85%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            
            {/* Drop shadow filter for texts */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <stop offset="0" stopColor="#000" stopOpacity="0.5"/>
            </filter>
          </defs>

          {/* Render Wedges */}
          <g>
            {segments.map((seg, i) => {
              // Determine exact gradient
              let fillGradient = 'url(#grad-elin)';
              if (seg.name === 'Eric') {
                fillGradient = i % 2 === 0 ? 'url(#grad-eric-1)' : 'url(#grad-eric-2)';
              } else if (seg.name === 'Oliver') {
                fillGradient = i % 2 === 0 ? 'url(#grad-oliver-1)' : 'url(#grad-oliver-2)';
              }

              return (
                <path
                  key={seg.id}
                  d={describeWedge(center, center, radius, seg.angleStart, seg.angleEnd)}
                  fill={fillGradient}
                  stroke="#1e293b"
                  strokeWidth="2.5"
                  className="transition-colors duration-200"
                />
              );
            })}
          </g>

          {/* Render Labels on Top of Wedges */}
          <g>
            {segments.map((seg) => {
              const midAngle = seg.angleStart + (seg.angleEnd - seg.angleStart) / 2;
              // Position text at about 62% of the radius for readability
              const textPos = polarToCartesian(center, center, radius * 0.62, midAngle);
              // Rotate text to align with the wedge's central radial line
              const textRotation = midAngle;

              return (
                <g key={`text-${seg.id}`} className="pointer-events-none select-none">
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={seg.name === 'Elin' ? '#451a03' : '#ffffff'}
                    className={`font-sans tracking-wide select-none ${
                      seg.name === 'Elin'
                        ? 'font-extrabold text-[15px]'
                        : 'font-semibold text-[13px]'
                    }`}
                    style={{
                      textShadow: seg.name === 'Elin' ? 'none' : '0px 1.5px 3px rgba(0,0,0,0.6)',
                    }}
                  >
                    {seg.name}
                  </text>
                  
                  {/* Subtle small dot/symbol below the name to look like a high-end wheel */}
                  {seg.name === 'Elin' && (
                    <circle
                      cx={textPos.x}
                      cy={textPos.y + 12}
                      r="2"
                      fill="#451a03"
                      transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Premium Inner Center Hub */}
          <circle
            cx={center}
            cy={center}
            r="42"
            fill="url(#center-glow)"
            stroke="#475569"
            strokeWidth="3.5"
            className="shadow-2xl"
          />

          {/* Inner ring of small metallic pins */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const pos = polarToCartesian(center, center, 32, angle);
            return (
              <circle
                key={`hub-pin-${i}`}
                cx={pos.x}
                cy={pos.y}
                r="2"
                fill="#94a3b8"
              />
            );
          })}

          {/* Center decorative crown/sparkle */}
          <g transform={`translate(${center - 10}, ${center - 10})`} className="pointer-events-none">
            <path
              d="M10 2L13 7H7L10 2Z"
              fill="#fbbf24"
              className="animate-pulse"
              opacity="0.3"
            />
          </g>
        </svg>

        {/* Outer Pointer / Clapper at the TOP (points directly down at the top wedge) */}
        <div 
          className={`absolute top-0 left-1/2 -ml-5 w-10 h-12 z-30 pointer-events-none transition-transform origin-top ${
            tickerActive ? 'animate-[bounce_0.15s_infinite_alternate]' : ''
          }`}
          style={{
            transform: tickerActive ? 'scale(1.05)' : 'none',
          }}
        >
          {/* Real physical look with metallic finish */}
          <svg viewBox="0 0 40 48" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            {/* The pin joint */}
            <circle cx="20" cy="8" r="7" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <circle cx="20" cy="8" r="3" fill="#e2e8f0" />
            
            {/* The pointer triangle pointer */}
            <path
              d="M12 8 L28 8 L20 44 Z"
              fill="#ef4444"
              stroke="#991b1b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Highlight highlight on the pointer */}
            <path
              d="M17 11 L23 11 L20 38 Z"
              fill="#fca5a5"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Center Golden Crown Button Decor */}
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border border-amber-300 z-20 pointer-events-none animate-pulse">
          <Crown className="w-6 h-6 text-amber-950" />
        </div>
      </div>
    </div>
  );
}
