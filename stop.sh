#!/usr/bin/env bash
echo "[*] Stopping Data Analytics Platform services..."
fuser -k 8001/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
echo "[+] Services stopped successfully."
