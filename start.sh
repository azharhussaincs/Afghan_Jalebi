#!/usr/bin/env bash

# ==============================================================================
# Enterprise Data Platform Startup Script
# ==============================================================================

# Kill any existing processes on ports 8001, 8000 and 5173
fuser -k 8001/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

echo "======================================================================"
echo "  Starting Enterprise Civil Registry Data Platform"
echo "======================================================================"

# Activate virtual environment if present
if [ -f "$BASE_DIR/.venv/bin/activate" ]; then
    source "$BASE_DIR/.venv/bin/activate"
fi

# Determine uvicorn command
UVICORN_CMD="python3 -m uvicorn"
if [ -x "$BASE_DIR/.venv/bin/uvicorn" ]; then
    UVICORN_CMD="$BASE_DIR/.venv/bin/uvicorn"
elif command -v /home/albaloshi/.local/bin/uvicorn &> /dev/null; then
    UVICORN_CMD="/home/albaloshi/.local/bin/uvicorn"
fi

# 1. Start Backend
echo "[*] Starting FastAPI Backend on http://0.0.0.0:8001..."
$UVICORN_CMD backend.main:app --host 0.0.0.0 --port 8001 --reload > backend.log 2>&1 &
BACKEND_PID=$!

# 2. Start Frontend
echo "[*] Starting Vite React Frontend on http://127.0.0.1:5173..."
cd frontend
node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 2

echo ""
echo "======================================================================"
echo "  🚀 Platform is running successfully!"
echo "======================================================================"
echo "  📊 Dashboard URL:      http://localhost:5173"
echo "  📖 API Documentation:  http://localhost:8001/docs"
echo "  🩺 Health Status:      http://localhost:8001/api/health"
echo "======================================================================"
echo "  Press Ctrl+C to stop both services."
echo ""

# Trap SIGINT and SIGTERM to clean up background processes
trap "echo '[*] Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" SIGINT SIGTERM

wait
