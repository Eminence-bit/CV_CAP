@echo off
echo ================================================
echo CV-CAP Setup and Run Script
echo ================================================

:: Check dependencies
echo Checking dependencies...

:: Check Node.js
where node >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=1,2,3 delims=." %%a in ('node -v') do set NODE_VERSION=%%a.%%b.%%c
    echo [OK] Node.js %NODE_VERSION:~1% is installed
) else (
    echo [ERROR] Node.js is not installed. Please install Node.js v14+ and try again.
    exit /b 1
)

:: Check Python
where python >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=1,2 delims= " %%a in ('python --version') do set PYTHON_VERSION=%%b
    echo [OK] Python %PYTHON_VERSION% is installed
) else (
    echo [ERROR] Python is not installed. Please install Python 3.8+ and try again.
    exit /b 1
)

:: Check Truffle
where truffle >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Truffle is installed
) else (
    echo [WARNING] Truffle is not installed. Installing...
    call npm install -g truffle
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Truffle. Please install it manually: npm install -g truffle
        exit /b 1
    )
)

:: Check Ganache CLI
where ganache-cli >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Ganache CLI is installed
) else (
    echo [WARNING] Ganache CLI is not installed. Installing...
    call npm install -g ganache-cli
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Ganache CLI. Please install it manually: npm install -g ganache-cli
        exit /b 1
    )
)

echo ================================================
echo Setting up blockchain...

:: Start Ganache CLI in a new terminal
echo Starting Ganache CLI...
start "Ganache CLI" cmd /k "ganache-cli"
timeout /t 5 /nobreak >nul

:: Navigate to blockchain directory and compile/deploy smart contract
cd blockchain
echo Compiling smart contract...
call truffle compile
if %errorlevel% neq 0 (
    echo [ERROR] Smart contract compilation failed
    exit /b 1
)

echo Deploying smart contract...
call truffle migrate --network development
if %errorlevel% neq 0 (
    echo [ERROR] Smart contract deployment failed
    exit /b 1
)
echo [OK] Smart contract deployed successfully

:: Navigate back to the root directory
cd ..

echo ================================================
echo Setting up backend...

:: Navigate to backend directory and set up Python environment
cd backend

:: Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create Python virtual environment
        exit /b 1
    )
)

:: Activate virtual environment
echo Activating Python virtual environment...
call venv\Scripts\activate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate Python virtual environment
    exit /b 1
)

:: Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    exit /b 1
)
echo [OK] Python dependencies installed successfully

:: Start Flask server in a new terminal
echo Starting Flask server...
start "Flask Server" cmd /k "venv\Scripts\activate && python app.py"
timeout /t 5 /nobreak >nul

:: Navigate back to the root directory
cd ..

echo ================================================
echo Setting up frontend...

:: Navigate to frontend directory and install dependencies
cd frontend
echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    exit /b 1
)
echo [OK] Node.js dependencies installed successfully

:: Start React development server in a new terminal
echo Starting React development server...
start "React Server" cmd /k "npm start"
timeout /t 5 /nobreak >nul

:: Navigate back to the root directory
cd ..

echo ================================================
echo CV-CAP setup completed!
echo ================================================
echo Services running:
echo - Ganache CLI (blockchain): http://localhost:8545
echo - Flask (backend): http://localhost:5000
echo - React (frontend): http://localhost:3000
echo ================================================

echo Press any key to close this window. The services will continue running in their respective terminals.
pause >nul
