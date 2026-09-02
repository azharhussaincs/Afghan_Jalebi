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

# 6. Check for Database or Raw Dataset
if [ -s "database/data.db" ]; then
    echo "[+] Ready: Found existing database/data.db! Skipping re-ingestion."
elif [ -f "./data/two.txt" ] || [ -f "./two.txt" ]; then
    echo "[*] Running zero-loss data ingestion and analytics pre-computation from two.txt..."
    python3 scripts/ingest_fast.py
else
    echo "[!] Warning: Neither database/data.db nor two.txt were found."
    echo "[*] Please place data.db into ./database/ or raw two.txt into ./data/."
fi

echo "======================================================================"
echo "  Setup Complete! Run ./start.sh to launch the platform."
echo "======================================================================"
