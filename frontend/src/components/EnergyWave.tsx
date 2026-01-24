/**
 * Energy Wave Background - Dynamic Neon Waves
 */

'use client';

import { useEffect, useRef } from 'react';

interface EnergyWaveProps {
    intensity: number; // 0-1: controls wave speed and amplitude
    isActive: boolean;
}

export function EnergyWave({ intensity, isActive }: EnergyWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let time = 0;

        function drawWave() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const waveCount = 3;
            const baseSpeed = 0.02 + intensity * 0.05;
            const baseAmplitude = 20 + intensity * 30;

            for (let i = 0; i < waveCount; i++) {
                ctx.beginPath();

                const opacity = isActive ? 0.15 + intensity * 0.2 : 0.05;
                const hue = 220 + i * 30; // Blue to purple range

                ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
                ctx.lineWidth = 2;

                for (let x = 0; x <= canvas.width; x += 5) {
                    const frequency = 0.01 + i * 0.005;
                    const phase = time * baseSpeed + i * 0.5;
                    const amplitude = baseAmplitude * (1 + Math.sin(time * 0.5 + i) * 0.3);

                    const y =
                        canvas.height / 2 +
                        Math.sin(x * frequency + phase) * amplitude +
                        Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.5);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.stroke();
            }

            time += 1;
            animationRef.current = requestAnimationFrame(drawWave);
        }

        drawWave();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [intensity, isActive]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: isActive ? 1 : 0.3,
                transition: 'opacity 0.5s ease',
            }}
        />
    );
}
