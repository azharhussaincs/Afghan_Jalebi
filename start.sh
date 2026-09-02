#!/usr/bin/env bash

# ==============================================================================
# Enterprise Data Platform Startup Script (Zero-Downtime Multi-Service Boot)
# ==============================================================================

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

# Cleanly free ports 8001, 8000 and 5173
fuser -k 8001/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

echo "======================================================================"
echo "  Starting Enterprise Civil Registry Data Platform"
echo "======================================================================"

# Activate virtual environment if present
if [ -f "$BASE_DIR/.venv/bin/activate" ]; then
    source "$BASE_DIR/.venv/bin/activate"
fi

# Determine Python & Uvicorn executable
if [ -x "$BASE_DIR/.venv/bin/python3" ]; then
    PYTHON_BIN="$BASE_DIR/.venv/bin/python3"
else
    PYTHON_BIN="python3"
fi

if [ -x "$BASE_DIR/.venv/bin/uvicorn" ]; then
    UVICORN_CMD="$BASE_DIR/.venv/bin/uvicorn"
elif command -v uvicorn &> /dev/null; then
    UVICORN_CMD="uvicorn"
else
    UVICORN_CMD="$PYTHON_BIN -m uvicorn"
fi

# Ensure requirements are satisfied
if [ -f "$BASE_DIR/requirements.txt" ]; then
    $PYTHON_BIN -m pip install --quiet -r "$BASE_DIR/requirements.txt" 2>/dev/null || true
fi

# 1. Start Backend on Port 8001
echo "[*] Starting FastAPI Backend on http://0.0.0.0:8001..."
$UVICORN_CMD backend.main:app --host 0.0.0.0 --port 8001 --reload > "$BASE_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# 2. Start Frontend on Port 5173
echo "[*] Starting Vite React Cyber-HUD Frontend on http://0.0.0.0:5173..."
cd "$BASE_DIR/frontend"
if [ -f "node_modules/vite/bin/vite.js" ]; then
    node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173 > "$BASE_DIR/frontend.log" 2>&1 &
else
    npx vite --host 0.0.0.0 --port 5173 > "$BASE_DIR/frontend.log" 2>&1 &
fi
FRONTEND_PID=$!
cd "$BASE_DIR"

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

# Trap SIGINT and SIGTERM to cleanly kill both processes
trap "echo '[*] Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; fuser -k 8001/tcp 5173/tcp 2>/dev/null || true; exit 0" SIGINT SIGTERM

wait
