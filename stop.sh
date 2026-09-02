#!/usr/bin/env bash
# ==============================================================================
# Enterprise Data Platform Process Termination Script
# ==============================================================================

echo "[*] Stopping Data Analytics Platform services..."
fuser -k 8001/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
pkill -f "uvicorn backend.main:app" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
echo "[+] All Platform services stopped cleanly."
