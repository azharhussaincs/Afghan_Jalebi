#!/usr/bin/env bash
set -e

# ==============================================================================
# Automated First-Run Setup & Ingestion Engine
# ==============================================================================

echo "======================================================================"
echo "  Enterprise Civil Registry Data Platform - Setup & Ingestion"
echo "======================================================================"

# 1. Check Python
if ! command -v python3 &> /dev/null; then
    echo "[-] Error: Python 3 is required but not installed."
    exit 1
fi
echo "[+] Python version: $(python3 --version)"

# 2. Check Node.js & npm
if ! command -v node &> /dev/null; then
    echo "[-] Error: Node.js (v18+) is required but not installed."
    exit 1
fi
echo "[+] Node.js version: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "[-] Error: npm is required but not installed."
    exit 1
fi
echo "[+] npm version: $(npm --version)"

# 3. Environment configuration
if [ ! -f .env ]; then
    echo "[*] Creating .env from .env.example..."
    cp .env.example .env
fi

# 4. Install Python Dependencies
echo "[*] Installing Python backend packages..."
python3 -m pip install --quiet --upgrade pip
python3 -m pip install --quiet fastapi uvicorn pydantic numpy scipy aiosqlite pandas

# 5. Install Frontend Dependencies & Build
echo "[*] Installing Frontend packages & building assets..."
if [ -d "frontend" ]; then
    cd frontend
    npm install --silent
    npm run build
    cd ..
fi

# 6. Verify Dataset File
DATA_PATH="./data/two.txt"
if [ ! -f "$DATA_PATH" ] && [ ! -f "/media/albaloshi/USB_SHARED/two.txt" ]; then
    echo "[!] Warning: two.txt not found in ./data/two.txt."
    echo "[*] Please place your raw UTF-16 LE two.txt in ./data/two.txt"
fi

# 7. Run High-Speed Ingestion & Indexing Pipeline
echo "[*] Running zero-loss data ingestion and analytics pre-computation..."
python3 scripts/ingest_fast.py

echo "======================================================================"
echo "  Setup Complete! Run ./start.sh to launch the platform."
echo "======================================================================"
