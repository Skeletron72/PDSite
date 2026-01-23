@echo off
echo Building Pocket Dale for Production Preview...
call npm run build
echo.
echo Starting Preview Server...
npm run preview
pause
