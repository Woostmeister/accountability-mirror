@echo off
echo.
echo ========================================
echo   Starting Accountability Mirror
echo ========================================
echo.
echo Opening browser to http://localhost:8000
echo.
echo KEEP THIS WINDOW OPEN while using the app
echo Close this window when you're done
echo.
echo ========================================
echo.

start http://localhost:8000

python server.py

pause
