/**
 * Futuristic Background - Enhanced Visible City
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export function FuturisticBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePosition = useMousePosition();
    const [isMounted, setIsMounted] = useState(false);

    // Defer parallax to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Particle system
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
            color: string;
        }> = [];

        // Create more visible particles
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: ['#4a9eff', '#a855f7', '#fbbf24'][Math.floor(Math.random() * 3)],
            });
        }

        function animate() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update particles
            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
                ctx.fill();

                // Glow
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 4
                );
                gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 0.5 * 255).toString(16).padStart(2, '0'));
                gradient.addColorStop(1, particle.color + '00');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Calculate parallax offset only on client after mount
    const parallaxX = isMounted && typeof window !== 'undefined'
        ? (mousePosition.x / window.innerWidth - 0.5) * 30
        : 0;
    const parallaxY = isMounted && typeof window !== 'undefined'
        ? (mousePosition.y / window.innerHeight - 0.5) * 30
        : 0;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.3s ease-out',
            }}
        >
            {/* Neon City - More Visible */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '40%',
                    background: `linear-gradient(to bottom, 
            rgba(26, 26, 26, 0) 0%,
            rgba(50, 50, 70, 0.3) 40%,
            rgba(40, 40, 60, 0.5) 100%
          )`,
                    filter: 'blur(1px)', // Less blur
                    opacity: 0.9, // More visible
                }}
            >
                {/* City building shapes - more visible with neon */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '5%',
                        width: '12%',
                        height: '70%',
                        background: 'linear-gradient(to top, rgba(70, 70, 90, 0.4), rgba(50, 50, 70, 0.2))',
                        boxShadow: '0 0 30px rgba(74, 158, 255, 0.3), inset 0 0 20px rgba(74, 158, 255, 0.1)',
                        borderTop: '2px solid rgba(74, 158, 255, 0.5)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        width: '15%',
                        height: '85%',
                        background: 'linear-gradient(to top, rgba(70, 70, 90, 0.4), rgba(50, 50, 70, 0.2))',
                        boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                        borderTop: '2px solid rgba(168, 85, 247, 0.5)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '38%',
                        width: '18%',
                        height: '90%',
                        background: 'linear-gradient(to top, rgba(70, 70, 90, 0.4), rgba(50, 50, 70, 0.2))',
                        boxShadow: '0 0 40px rgba(74, 158, 255, 0.4), inset 0 0 20px rgba(74, 158, 255, 0.1)',
                        borderTop: '2px solid rgba(74, 158, 255, 0.5)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: '30%',
                        width: '16%',
                        height: '75%',
                        background: 'linear-gradient(to top, rgba(70, 70, 90, 0.4), rgba(50, 50, 70, 0.2))',
                        boxShadow: '0 0 35px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1)',
                        borderTop: '2px solid rgba(251, 191, 36, 0.5)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: '10%',
                        width: '14%',
                        height: '65%',
                        background: 'linear-gradient(to top, rgba(70, 70, 90, 0.4), rgba(50, 50, 70, 0.2))',
                        boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                        borderTop: '2px solid rgba(168, 85, 247, 0.5)',
                    }}
                />
            </div>

            {/* Subtle fog */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: `linear-gradient(to top, 
            rgba(26, 26, 26, 0.6) 0%,
            rgba(26, 26, 26, 0.3) 50%,
            rgba(26, 26, 26, 0) 100%
          )`,
                    filter: 'blur(20px)',
                }}
            />

            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
