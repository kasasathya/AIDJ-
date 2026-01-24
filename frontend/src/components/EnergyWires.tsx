/**
 * Energy Wires - Neon connections between song cards during remix
 */

'use client';

import { useEffect, useState } from 'react';

interface Point {
    x: number;
    y: number;
}

interface EnergyWiresProps {
    stage: 'idle' | 'analyzing' | 'mixing' | 'rendering' | 'complete';
    selectedCount: number;
}

export function EnergyWires({ stage, selectedCount }: EnergyWiresProps) {
    const [connections, setConnections] = useState<Array<{ from: Point; to: Point }>>([]);

    useEffect(() => {
        if (selectedCount < 2 || stage === 'idle') {
            setConnections([]);
            return;
        }

        // Generate wire paths between cards
        const newConnections: Array<{ from: Point; to: Point }> = [];

        // Simplified: create connections in a flow pattern
        for (let i = 0; i < selectedCount - 1; i++) {
            newConnections.push({
                from: { x: i * 180 + 90, y: 100 },
                to: { x: (i + 1) * 180 + 90, y: 100 },
            });
        }

        setConnections(newConnections);
    }, [selectedCount, stage]);

    // Speed based on stage
    const animationSpeed =
        stage === 'analyzing' ? '3s' :
            stage === 'mixing' ? '1s' :
                stage === 'rendering' ? '4s' :
                    '2s';

    const wireColor =
        stage === 'analyzing' ? '#4ade80' :
            stage === 'mixing' ? '#a855f7' :
                stage === 'rendering' ? '#fbbf24' :
                    '#4a9eff';

    if (connections.length === 0) return null;

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={wireColor} stopOpacity="0" />
                    <stop offset="50%" stopColor={wireColor} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={wireColor} stopOpacity="0" />
                </linearGradient>
            </defs>

            {connections.map((conn, idx) => {
                const midX = (conn.from.x + conn.to.x) / 2;
                const midY = (conn.from.y + conn.to.y) / 2 - 30; // Curve upward

                return (
                    <g key={idx}>
                        {/* Wire path */}
                        <path
                            d={`M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY} ${conn.to.x} ${conn.to.y}`}
                            stroke="url(#wireGradient)"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="10 5"
                            style={{
                                animation: `wireFlow ${animationSpeed} linear infinite`,
                            }}
                        />

                        {/* Glow */}
                        <path
                            d={`M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY} ${conn.to.x} ${conn.to.y}`}
                            stroke={wireColor}
                            strokeWidth="1"
                            fill="none"
                            opacity="0.3"
                            filter="blur(3px)"
                        />
                    </g>
                );
            })}

            <style jsx>{`
        @keyframes wireFlow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -15;
          }
        }
      `}</style>
        </svg>
    );
}
