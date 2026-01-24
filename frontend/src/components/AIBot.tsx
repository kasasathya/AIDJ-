/**
 * AI Bot - White 3D with Energetic Dance Animation
 * Features: Eye tracking, click to blink, drag interactions, energetic dance with shake, sway, hover
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface AIBotProps {
    state: 'idle' | 'analyzing' | 'remixing' | 'rendering' | 'error' | 'complete';
    isPlaying?: boolean;
    progressPercent?: number;
}

export function AIBot({ state, isPlaying = false, progressPercent = 0 }: AIBotProps) {
    const mousePosition = useMousePosition();
    const botRef = useRef<HTMLDivElement>(null);
    const [botCenter, setBotCenter] = useState({ x: 0, y: 0 });
    const [eyesOpen, setEyesOpen] = useState(true);
    const [isHolding, setIsHolding] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [handsRaised, setHandsRaised] = useState(false);

    // Update bot center position when window resizes or scrolls
    useEffect(() => {
        const updateBotCenter = () => {
            if (botRef.current) {
                const rect = botRef.current.getBoundingClientRect();
                setBotCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
        };

        updateBotCenter();
        window.addEventListener('resize', updateBotCenter);
        window.addEventListener('scroll', updateBotCenter);

        // Update periodically to handle layout changes
        const interval = setInterval(updateBotCenter, 500);

        return () => {
            window.removeEventListener('resize', updateBotCenter);
            window.removeEventListener('scroll', updateBotCenter);
            clearInterval(interval);
        };
    }, []);

    const stateColors = {
        idle: '#4a9eff',
        analyzing: '#4ade80',
        remixing: '#a855f7',
        rendering: '#fbbf24',
        error: '#f87171',
        complete: '#4ade80',
    };

    const eyeColor = stateColors[state];
    // Dance when audio is playing OR during remixing/rendering
    const isDancing = isPlaying || state === 'remixing' || state === 'rendering';
    
    // Intensity scales with progress during remixing
    const intensityScale = state === 'remixing' || state === 'rendering' 
        ? 1 + (progressPercent / 100) * 0.5 
        : 1;

    // Eye tracking - now using actual bot position
    const angle = Math.atan2(
        mousePosition.y - botCenter.y,
        mousePosition.x - botCenter.x
    );

    const maxOffset = isDancing ? 5 * intensityScale : 3; // More movement when dancing
    const eyeOffsetX = Math.cos(angle) * maxOffset;
    const eyeOffsetY = Math.sin(angle) * maxOffset;

    const glowIntensity = state === 'idle' || state === 'complete' ? 0.3 : 0.6 * intensityScale;

    function handleClick() {
        setEyesOpen(!eyesOpen);
        setTimeout(() => setEyesOpen(true), 200);
    }

    function handleMouseDown(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsHolding(true);
        const startX = e.clientX;

        const handleMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            setRotation(delta * 0.3);

            if (moveEvent.clientY < e.clientY - 20) {
                setHandsRaised(true);
            }
        };

        const handleUp = () => {
            setIsHolding(false);
            setRotation(0);
            setHandsRaised(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
    }

    return (
        <div
            ref={botRef}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            style={{
                margin: '10px auto',
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // DISABLE animation when holding so inline transform works
                animation: isHolding
                    ? 'none'
                    : isDancing
                        ? 'danceFloat 0.6s ease-in-out infinite, danceShake 0.25s ease-in-out infinite, danceSpin 2s ease-in-out infinite, discoPulse 1.5s ease-in-out infinite'
                        : 'float 4s ease-in-out infinite',
                cursor: isHolding ? 'grabbing' : 'grab',
                userSelect: 'none',
                transform: `rotate(${rotation}deg) ${handsRaised ? 'scale(1.1)' : 'scale(1)'}`,
                transition: isHolding ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            <svg width="140" height="140" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="botBody" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#e8e8e8" />
                        <stop offset="100%" stopColor="#d0d0d0" />
                    </linearGradient>

                    <linearGradient id="botShine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </linearGradient>

                    <filter id="shadow">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Main body */}
                <rect
                    x="50"
                    y="80"
                    width="100"
                    height="80"
                    rx="20"
                    fill="url(#botBody)"
                    stroke="#a0a0a0"
                    strokeWidth="2"
                    filter="url(#shadow)"
                >
                    {isDancing && (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="0 100 120; -3 100 120; 0 100 120; 3 100 120; 0 100 120"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    )}
                </rect>

                <ellipse
                    cx="80"
                    cy="100"
                    rx="30"
                    ry="20"
                    fill="url(#botShine)"
                    opacity="0.6"
                />

                {/* Head */}
                <rect
                    x="60"
                    y="50"
                    width="80"
                    height="50"
                    rx="15"
                    fill="url(#botBody)"
                    stroke="#a0a0a0"
                    strokeWidth="2"
                    filter="url(#shadow)"
                >
                    {isDancing && (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="0 100 75; 5 100 75; 0 100 75; -5 100 75; 0 100 75"
                            dur="0.4s"
                            repeatCount="indefinite"
                        />
                    )}
                </rect>

                <ellipse
                    cx="90"
                    cy="65"
                    rx="25"
                    ry="15"
                    fill="url(#botShine)"
                    opacity="0.5"
                />

                {/* Antenna */}
                <line
                    x1="100"
                    y1="50"
                    x2="100"
                    y2="30"
                    stroke={eyeColor}
                    strokeWidth="3"
                />
                <circle cx="100" cy="25" r="5" fill={eyeColor}>
                    <animate
                        attributeName="opacity"
                        values={isDancing ? "0.3;1;0.3" : "0.5;1;0.5"}
                        dur={isDancing ? "0.3s" : "2s"}
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Left Eye */}
                {eyesOpen ? (
                    <g>
                        <circle
                            cx={80 + eyeOffsetX}
                            cy={70 + eyeOffsetY}
                            r="8"
                            fill={eyeColor}
                        >
                            {isDancing && (
                                <animate
                                    attributeName="r"
                                    values="8;6;8;10;8"
                                    dur="0.8s"
                                    repeatCount="indefinite"
                                />
                            )}
                        </circle>
                        <circle
                            cx={80 + eyeOffsetX}
                            cy={70 + eyeOffsetY}
                            r="12"
                            fill="none"
                            stroke={eyeColor}
                            strokeWidth="1"
                            opacity={glowIntensity}
                        >
                            <animate
                                attributeName="r"
                                values="12;16;12"
                                dur={isDancing ? "0.5s" : "2s"}
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                ) : (
                    <line x1="72" y1="70" x2="88" y2="70" stroke={eyeColor} strokeWidth="3" />
                )}

                {/* Right Eye */}
                {eyesOpen ? (
                    <g>
                        <circle
                            cx={120 + eyeOffsetX}
                            cy={70 + eyeOffsetY}
                            r="8"
                            fill={eyeColor}
                        >
                            {isDancing && (
                                <animate
                                    attributeName="r"
                                    values="8;10;8;6;8"
                                    dur="0.8s"
                                    repeatCount="indefinite"
                                />
                            )}
                        </circle>
                        <circle
                            cx={120 + eyeOffsetX}
                            cy={70 + eyeOffsetY}
                            r="12"
                            fill="none"
                            stroke={eyeColor}
                            strokeWidth="1"
                            opacity={glowIntensity}
                        >
                            <animate
                                attributeName="r"
                                values="12;16;12"
                                dur={isDancing ? "0.5s" : "2s"}
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                ) : (
                    <line x1="112" y1="70" x2="128" y2="70" stroke={eyeColor} strokeWidth="3" />
                )}

                {/* Mouth */}
                <line
                    x1="80"
                    y1="90"
                    x2="120"
                    y2="90"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    {isDancing && (
                        <animate
                            attributeName="d"
                            values="M 80,90 Q 100,90 120,90; M 80,90 Q 100,95 120,90; M 80,90 Q 100,90 120,90"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    )}
                </line>

                {/* Left Arm - Dancing */}
                <rect
                    x="30"
                    y="100"
                    width="20"
                    height="40"
                    rx="10"
                    fill="url(#botBody)"
                    stroke="#a0a0a0"
                    strokeWidth="2"
                    filter="url(#shadow)"
                >
                    {isDancing ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="-70 40 100; -110 40 100; -90 40 100; -110 40 100; -70 40 100"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    ) : handsRaised ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="-45 40 100"
                            dur="0.3s"
                        />
                    ) : null}
                </rect>

                {/* Right Arm - Dancing */}
                <rect
                    x="150"
                    y="100"
                    width="20"
                    height="40"
                    rx="10"
                    fill="url(#botBody)"
                    stroke="#a0a0a0"
                    strokeWidth="2"
                    filter="url(#shadow)"
                >
                    {isDancing ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="70 160 100; 110 160 100; 90 160 100; 110 160 100; 70 160 100"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    ) : handsRaised ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            values="45 160 100"
                            dur="0.3s"
                        />
                    ) : null}
                </rect>

                {/* Energy rings when dancing */}
                {isDancing && (
                    <g>
                        <circle
                            cx="100"
                            cy="120"
                            r="60"
                            fill="none"
                            stroke={eyeColor}
                            strokeWidth="2"
                            opacity="0.3"
                        >
                            <animate
                                attributeName="r"
                                values="60;80;60"
                                dur="1.2s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="opacity"
                                values="0.3;0;0.3"
                                dur="1.2s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle
                            cx="100"
                            cy="120"
                            r="40"
                            fill="none"
                            stroke={eyeColor}
                            strokeWidth="1"
                            opacity="0.4"
                        >
                            <animate
                                attributeName="r"
                                values="40;60;40"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="opacity"
                                values="0.4;0;0.4"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                )}
            </svg>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes danceFloat {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(-15px); }
          75% { transform: translateY(-8px); }
        }
        
        @keyframes danceShake {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          50% { transform: translateX(0px) rotate(0deg); }
          75% { transform: translateX(3px) rotate(2deg); }
        }
        
        @keyframes danceSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.05); }
          50% { transform: rotate(0deg) scale(1.1); }
          75% { transform: rotate(-5deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }
        
        @keyframes danceBounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(-20px) scaleY(1.1); }
          50% { transform: translateY(-10px) scaleY(0.95); }
          70% { transform: translateY(-15px) scaleY(1.05); }
        }
        
        @keyframes danceWiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        
        @keyframes discoPulse {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          25% { filter: brightness(1.2) hue-rotate(30deg); }
          50% { filter: brightness(1.4) hue-rotate(60deg); }
          75% { filter: brightness(1.2) hue-rotate(30deg); }
        }
      `}</style>
        </div>
    );
}
