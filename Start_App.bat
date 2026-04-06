@echo off
setlocal

:: Launch Backend
echo Starting Backend...
start "SkillPath Backend" cmd /k "cd skillpath-ai\backend && venv\Scripts\activate && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Launch Frontend
echo Starting Frontend...
start "SkillPath Frontend" cmd /k "cd skillpath-ai\frontend && npm run dev"

:: Wait and Open Dashboard
echo Opening Dashboard...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo SkillPath AI is starting up!
echo.
pause
exit /b
