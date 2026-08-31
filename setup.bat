@echo off
echo ======================================================================
echo   Enterprise Civil Registry Data Platform - Windows Setup
echo ======================================================================

REM 1. Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [-] Error: Python 3 is required. Please install from python.org.
    exit /b 1
)

REM 2. Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [-] Error: Node.js is required. Please install from nodejs.org.
    exit /b 1
)

REM 3. Setup environment
if not exist .env (
    echo [*] Creating .env from .env.example...
    copy .env.example .env
)

REM 4. Install backend requirements
echo [*] Installing Python backend packages...
pip install --quiet --upgrade pip
pip install --quiet fastapi uvicorn pydantic numpy scipy aiosqlite pandas

REM 5. Install frontend requirements
echo [*] Installing Frontend packages...
cd frontend
call npm install --silent
call npm run build
cd ..

REM 6. Run Ingestion
echo [*] Running high-speed zero-loss ingestion pipeline...
python scripts\ingest_fast.py

echo ======================================================================
echo   Setup Complete! Run start.bat to launch the application.
echo ======================================================================
pause
