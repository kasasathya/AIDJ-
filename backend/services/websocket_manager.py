"""
WebSocket Manager for Real-Time Pipeline Updates
================================================

Manages WebSocket connections and broadcasts progress updates
during mix generation to connected clients.
"""

from typing import Dict, List, Set
from fastapi import WebSocket
import asyncio
import json


class ConnectionManager:
    """Manages WebSocket connections for real-time mix progress updates"""
    
    def __init__(self):
        # Map job_id -> set of connected WebSockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Store latest state per job for reconnection
        self.job_states: Dict[str, dict] = {}
    
    async def connect(self, websocket: WebSocket, job_id: str):
        """Accept new WebSocket connection for a job"""
        await websocket.accept()
        
        if job_id not in self.active_connections:
            self.active_connections[job_id] = set()
        
        self.active_connections[job_id].add(websocket)
        print(f"🔌 WebSocket connected for job {job_id}")
        
        # Send current state if job is in progress
        if job_id in self.job_states:
            await websocket.send_json(self.job_states[job_id])
    
    def disconnect(self, websocket: WebSocket, job_id: str):
        """Remove WebSocket connection"""
        if job_id in self.active_connections:
            self.active_connections[job_id].discard(websocket)
            if not self.active_connections[job_id]:
                del self.active_connections[job_id]
        print(f"🔌 WebSocket disconnected for job {job_id}")
    
    async def broadcast(self, job_id: str, message: dict):
        """Broadcast message to all clients watching a job"""
        self.job_states[job_id] = message
        
        if job_id not in self.active_connections:
            return
        
        dead_connections = set()
        
        for connection in self.active_connections[job_id]:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.add(connection)
        
        # Clean up dead connections
        for dead in dead_connections:
            self.active_connections[job_id].discard(dead)
    
    async def send_stage_update(self, job_id: str, stage: int, name: str, status: str):
        """Send pipeline stage update"""
        await self.broadcast(job_id, {
            "type": "stage_update",
            "stage": stage,
            "name": name,
            "status": status,
            "total_stages": 5
        })
    
    async def send_log(self, job_id: str, message: str, level: str = "info"):
        """Send log message"""
        await self.broadcast(job_id, {
            "type": "log",
            "message": message,
            "level": level
        })
    
    async def send_progress(self, job_id: str, percent: float, stage: int = None):
        """Send progress percentage update"""
        await self.broadcast(job_id, {
            "type": "progress",
            "percent": percent,
            "stage": stage
        })
    
    async def send_complete(self, job_id: str, mix_url: str, duration: float = None):
        """Send completion notification"""
        await self.broadcast(job_id, {
            "type": "complete",
            "mix_url": mix_url,
            "duration": duration,
            "success": True
        })
        # Clean up job state after a delay
        await asyncio.sleep(60)
        self.job_states.pop(job_id, None)
    
    async def send_error(self, job_id: str, message: str):
        """Send error notification"""
        await self.broadcast(job_id, {
            "type": "error",
            "message": message,
            "success": False
        })
    
    async def send_paused(self, job_id: str):
        """Send paused notification"""
        await self.broadcast(job_id, {
            "type": "paused",
            "message": "Mix generation paused"
        })
    
    async def send_resumed(self, job_id: str):
        """Send resumed notification"""
        await self.broadcast(job_id, {
            "type": "resumed",
            "message": "Mix generation resumed"
        })
    
    async def send_cancelled(self, job_id: str):
        """Send cancelled notification"""
        await self.broadcast(job_id, {
            "type": "cancelled",
            "message": "Mix generation cancelled"
        })
    
    def cleanup_job(self, job_id: str):
        """Clean up all connections and state for a job"""
        self.active_connections.pop(job_id, None)
        self.job_states.pop(job_id, None)


# Global WebSocket manager instance
manager = ConnectionManager()
