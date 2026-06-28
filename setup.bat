@echo off
REM APEXFlow Setup Script for Windows
setlocal enabledelayedexpansion

echo ==================================
echo   APEXFlow Setup (Windows)
echo ==================================
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Show Node version
for /f "tokens=*" %%i in ('node --version') do echo Node.js version: %%i

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install server dependencies
echo.
echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Create server .env if it doesn't exist
if not exist "server\.env" (
    echo.
    echo Creating server\.env from example...
    copy server\.env.example server\.env
)

REM Create data directory
if not exist "server\data" (
    mkdir server\data
)

REM Install and verify subject detection python dependencies
set "ACESTEP_ENV=..\ACE-Step-1.5"
if exist "ACE-Step-1.5" set "ACESTEP_ENV=ACE-Step-1.5"
set "ACESTEP_PYTHON="
set "ACESTEP_PIP="

for %%d in (env .venv venv) do (
    if not defined ACESTEP_PYTHON if exist "%ACESTEP_ENV%\%%d\Scripts\python.exe" (
        set "ACESTEP_PYTHON=%ACESTEP_ENV%\%%d\Scripts\python.exe"
    )
    if not defined ACESTEP_PIP if exist "%ACESTEP_ENV%\%%d\Scripts\pip.exe" (
        set "ACESTEP_PIP=%ACESTEP_ENV%\%%d\Scripts\pip.exe"
    )
)

if defined ACESTEP_PYTHON (
    echo.
    echo Using ACE-Step Python: %ACESTEP_PYTHON%
    echo Installing subject detection python dependencies (opencv-python, mediapipe)...
    if defined ACESTEP_PIP (
        "%ACESTEP_PIP%" install opencv-python mediapipe --quiet
    ) else (
        "%ACESTEP_PYTHON%" -m pip install opencv-python mediapipe --quiet
    )
    if !ERRORLEVEL! EQU 0 (
        echo Python dependencies installed successfully.
    ) else (
        echo Warning: Failed to install python dependencies automatically. Please run: "%ACESTEP_PYTHON%" -m pip install opencv-python mediapipe
    )

    echo Verifying subject detection dependencies...
    "%ACESTEP_PYTHON%" server\scripts\check_subject_detection_env.py
    if !ERRORLEVEL! NEQ 0 (
        echo Warning: mediapipe/opencv verification failed in the selected ACE-Step environment.
        echo Please resolve the Python error above before relying on avatar/banner auto-cropping.
    )
) else (
    echo.
    echo Warning: No ACE-Step virtual environment was found under env, .venv, or venv.
    echo Please install mediapipe manually in the Python environment used by ACE-Step.
)

echo.
echo ==================================
echo   Setup Complete!
echo ==================================
echo.
echo Next steps:
echo.
echo   1. Start ACE-Step API (in ACE-Step folder):
echo      cd path\to\ACE-Step
echo      uv run acestep-api --port 8001
echo.
echo   2. Start APEXFlow:
echo      start.bat
echo.
echo   3. Open http://localhost:3000
echo.
pause
