@echo off
echo ======================================================================
echo   Starting Enterprise Civil Registry Data Platform (Windows)
echo ======================================================================

start "FastAPI Backend" /b python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
cd frontend
start "Vite React Frontend" /b npm run dev -- --host 0.0.0.0 --port 5173
cd ..

echo.
echo ======================================================================
echo   Dashboard URL:      http://localhost:5173
echo   API Documentation:  http://localhost:8001/docs
echo ======================================================================
echo.
echo Close this window or terminate processes to stop.
pause
