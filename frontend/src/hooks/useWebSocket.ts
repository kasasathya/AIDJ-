/**
 * WebSocket Hook for Real-Time Mix Progress
 */

import { useEffect, useRef, useCallback } from 'react';
import { getWebSocketUrl } from '@/lib/api';

interface WebSocketMessage {
    type: 'connected' | 'stage_update' | 'log' | 'progress' | 'complete' | 'error' | 'heartbeat';
    [key: string]: any;
}

interface UseWebSocketOptions {
    jobId: string;
    onMessage?: (message: WebSocketMessage) => void;
    onStageUpdate?: (stage: number, name: string, status: string) => void;
    onLog?: (message: string, level: string) => void;
    onProgress?: (percent: number) => void;
    onComplete?: (mixUrl: string) => void;
    onError?: (error: string) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
    const { jobId, onMessage, onStageUpdate, onLog, onProgress, onComplete, onError } = options;
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const connect = useCallback(() => {
        if (!jobId) return;

        const ws = new WebSocket(getWebSocketUrl(jobId));
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected for job:', jobId);
        };

        ws.onmessage = (event) => {
            const message: WebSocketMessage = JSON.parse(event.data);

            // Call generic message handler
            onMessage?.(message);

            // Call specific handlers
            switch (message.type) {
                case 'stage_update':
                    onStageUpdate?.(message.stage, message.name, message.status);
                    break;
                case 'log':
                    onLog?.(message.message, message.level);
                    break;
                case 'progress':
                    onProgress?.(message.percent);
                    break;
                case 'complete':
                    onComplete?.(message.mix_url);
                    break;
                case 'error':
                    onError?.(message.message);
                    break;
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
            // Attempt reconnection after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        // Send periodic ping to keep connection alive
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('ping');
            }
        }, 25000);

        return () => {
            clearInterval(pingInterval);
        };
    }, [jobId, onMessage, onStageUpdate, onLog, onProgress, onComplete, onError]);

    useEffect(() => {
        const cleanup = connect();

        return () => {
            cleanup?.();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        send: (data: string) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(data);
            }
        },
        close: () => {
            wsRef.current?.close();
        },
    };
}
