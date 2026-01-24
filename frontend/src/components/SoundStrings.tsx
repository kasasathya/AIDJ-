/**
 * SoundStrings Component
 * ======================
 * Animated neon sound strings that appear behind selected songs.
 * Each song gets its own uniquely colored string that pulses and waves.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface SoundStringsProps {
  songCount: number;
  isRemixing: boolean;
  progressPercent: number;
  stage: 'idle' | 'analyzing' | 'mixing' | 'rendering' | 'complete';
}

// Neon color palette for strings
const NEON_COLORS = [
  { primary: '#00ffff', glow: 'rgba(0, 255, 255, 0.6)' },    // Cyan
  { primary: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' },    // Magenta
  { primary: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' },    // Green
  { primary: '#ffaa00', glow: 'rgba(255, 170, 0, 0.6)' },    // Orange
  { primary: '#ff3366', glow: 'rgba(255, 51, 102, 0.6)' },   // Pink
  { primary: '#4a9eff', glow: 'rgba(74, 158, 255, 0.6)' },   // Blue
  { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },   // Purple
  { primary: '#22d3ee', glow: 'rgba(34, 211, 238, 0.6)' },   // Teal
];

export function SoundStrings({ songCount, isRemixing, progressPercent, stage }: SoundStringsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const stringsRef = useRef<StringData[]>([]);
  const timeRef = useRef<number>(0);

  interface StringData {
    color: typeof NEON_COLORS[0];
    phase: number;
    amplitude: number;
    frequency: number;
    opacity: number;
    targetOpacity: number;
  }

  // Update strings when song count changes
  useEffect(() => {
    const currentCount = stringsRef.current.length;
    
    if (songCount > currentCount) {
      // Add new strings with fade-in
      for (let i = currentCount; i < songCount; i++) {
        stringsRef.current.push({
          color: NEON_COLORS[i % NEON_COLORS.length],
          phase: Math.random() * Math.PI * 2,
          amplitude: 15 + Math.random() * 10,
          frequency: 0.02 + Math.random() * 0.01,
          opacity: 0,
          targetOpacity: 0.8,
        });
      }
    } else if (songCount < currentCount) {
      // Fade out removed strings
      for (let i = songCount; i < currentCount; i++) {
        if (stringsRef.current[i]) {
          stringsRef.current[i].targetOpacity = 0;
        }
      }
      // Remove after fade
      setTimeout(() => {
        stringsRef.current = stringsRef.current.slice(0, songCount);
      }, 500);
    }
  }, [songCount]);

  // Handle canvas resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const strings = stringsRef.current;
      const centerY = dimensions.height / 2;

      strings.forEach((string, index) => {
        // Smooth opacity transition
        string.opacity += (string.targetOpacity - string.opacity) * 0.1;
        
        if (string.opacity < 0.01) return;

        // Calculate wave parameters
        const baseY = centerY + (index - (strings.length - 1) / 2) * 25;
        const speed = isRemixing ? 2 : 0.5;
        const intensityMultiplier = isRemixing ? 1.5 + (progressPercent / 100) * 0.5 : 1;

        // Draw the string as a wave
        ctx.beginPath();
        ctx.strokeStyle = string.color.primary;
        ctx.lineWidth = isRemixing ? 3 : 2;
        ctx.shadowColor = string.color.glow;
        ctx.shadowBlur = isRemixing ? 20 + progressPercent / 5 : 10;
        ctx.globalAlpha = string.opacity;

        for (let x = 0; x <= dimensions.width; x += 2) {
          const progress = x / dimensions.width;
          const wave1 = Math.sin((x * string.frequency + timeRef.current * speed + string.phase) * 2) * string.amplitude * intensityMultiplier;
          const wave2 = Math.sin((x * string.frequency * 0.7 + timeRef.current * speed * 1.3 + string.phase) * 2) * (string.amplitude * 0.5) * intensityMultiplier;
          const envelope = Math.sin(progress * Math.PI) * 0.7 + 0.3;
          
          const y = baseY + (wave1 + wave2) * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw glow layer
        ctx.beginPath();
        ctx.strokeStyle = string.color.glow;
        ctx.lineWidth = isRemixing ? 8 : 5;
        ctx.shadowBlur = isRemixing ? 30 + progressPercent / 3 : 15;
        ctx.globalAlpha = string.opacity * 0.4;

        for (let x = 0; x <= dimensions.width; x += 2) {
          const progress = x / dimensions.width;
          const wave1 = Math.sin((x * string.frequency + timeRef.current * speed + string.phase) * 2) * string.amplitude * intensityMultiplier;
          const wave2 = Math.sin((x * string.frequency * 0.7 + timeRef.current * speed * 1.3 + string.phase) * 2) * (string.amplitude * 0.5) * intensityMultiplier;
          const envelope = Math.sin(progress * Math.PI) * 0.7 + 0.3;
          
          const y = baseY + (wave1 + wave2) * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Reset shadow and alpha
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isRemixing, progressPercent]);

  if (songCount === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: isRemixing ? 1 : 0.7,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
}

// Get blended gradient colors from selected songs for progress bar
export function getBlendedGradient(songCount: number): string {
  if (songCount === 0) return 'linear-gradient(90deg, #4a9eff, #a855f7)';
  
  const colors = [];
  for (let i = 0; i < Math.min(songCount, NEON_COLORS.length); i++) {
    colors.push(NEON_COLORS[i].primary);
  }
  
  if (colors.length === 1) {
    return `linear-gradient(90deg, ${colors[0]}, ${colors[0]}88)`;
  }
  
  return `linear-gradient(90deg, ${colors.join(', ')})`;
}

// Export colors for use elsewhere
export { NEON_COLORS };
