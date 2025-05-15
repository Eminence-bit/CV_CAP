#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}CV-CAP Setup and Run Script${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if dependencies are installed
echo -e "${YELLOW}Checking dependencies...${NC}"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} is installed${NC}"
else
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js v14+ and try again.${NC}"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ ${PYTHON_VERSION} is installed${NC}"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓ ${PYTHON_VERSION} is installed${NC}"
else
    echo -e "${RED}✗ Python is not installed. Please install Python 3.8+ and try again.${NC}"
    exit 1
fi

# Check Truffle
if command -v truffle &> /dev/null; then
    TRUFFLE_VERSION=$(truffle version | grep Truffle | cut -d' ' -f2)
    echo -e "${GREEN}✓ Truffle ${TRUFFLE_VERSION} is installed${NC}"
else
    echo -e "${YELLOW}! Truffle is not installed. Installing...${NC}"
    npm install -g truffle
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install Truffle. Please install it manually: npm install -g truffle${NC}"
        exit 1
    fi
fi

# Check Ganache CLI
if command -v ganache-cli &> /dev/null; then
    echo -e "${GREEN}✓ Ganache CLI is installed${NC}"
else
    echo -e "${YELLOW}! Ganache CLI is not installed. Installing...${NC}"
    npm install -g ganache-cli
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install Ganache CLI. Please install it manually: npm install -g ganache-cli${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Setting up blockchain...${NC}"

# Start Ganache CLI in background
echo "Starting Ganache CLI..."
ganache-cli > ganache.log 2>&1 &
GANACHE_PID=$!
echo -e "${GREEN}✓ Ganache CLI started (PID: ${GANACHE_PID})${NC}"

# Sleep to ensure Ganache is fully started
sleep 3

# Navigate to blockchain directory and compile/deploy smart contract
cd blockchain
echo "Compiling smart contract..."
truffle compile
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Smart contract compilation failed${NC}"
    kill $GANACHE_PID
    exit 1
fi

echo "Deploying smart contract..."
truffle migrate --network development
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Smart contract deployment failed${NC}"
    kill $GANACHE_PID
    exit 1
fi
echo -e "${GREEN}✓ Smart contract deployed successfully${NC}"

# Get the deployed contract address
CONTRACT_ADDRESS=$(truffle networks | grep -oP '(?<=0x)[a-fA-F0-9]{40}' | head -1)
if [ -n "$CONTRACT_ADDRESS" ]; then
    CONTRACT_ADDRESS="0x$CONTRACT_ADDRESS"
    echo -e "${GREEN}✓ Contract deployed at: ${CONTRACT_ADDRESS}${NC}"
    # Update .env file with contract address
    cd ..
    if [ -f .env ]; then
        sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=${CONTRACT_ADDRESS}/" .env
    else
        echo "CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> .env
    fi
else
    echo -e "${YELLOW}! Could not extract contract address${NC}"
    cd ..
fi

echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Setting up backend...${NC}"

# Navigate to backend directory and set up Python environment
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv || python -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to create Python virtual environment${NC}"
        kill $GANACHE_PID
        exit 1
    fi
fi

# Activate virtual environment
source venv/bin/activate || source venv/Scripts/activate
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to activate Python virtual environment${NC}"
    kill $GANACHE_PID
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install Python dependencies${NC}"
    kill $GANACHE_PID
    exit 1
fi
echo -e "${GREEN}✓ Python dependencies installed successfully${NC}"

# Start Flask server in background
echo "Starting Flask server..."
python app.py > flask.log 2>&1 &
FLASK_PID=$!
echo -e "${GREEN}✓ Flask server started (PID: ${FLASK_PID})${NC}"

# Sleep to ensure Flask server is fully started
sleep 3

echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Setting up frontend...${NC}"

# Navigate to frontend directory and install dependencies
cd ../frontend
echo "Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install Node.js dependencies${NC}"
    kill $GANACHE_PID
    kill $FLASK_PID
    exit 1
fi
echo -e "${GREEN}✓ Node.js dependencies installed successfully${NC}"

# Start React development server
echo "Starting React development server..."
npm start &
REACT_PID=$!
echo -e "${GREEN}✓ React server started (PID: ${REACT_PID})${NC}"

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}CV-CAP setup completed!${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Services running:${NC}"
echo -e "- Ganache CLI (blockchain): PID ${GANACHE_PID}"
echo -e "- Flask (backend): PID ${FLASK_PID} - http://localhost:5000"
echo -e "- React (frontend): PID ${REACT_PID} - http://localhost:3000"
echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user input to stop all services
trap "kill $GANACHE_PID $FLASK_PID $REACT_PID; echo -e '${RED}All services stopped${NC}'; exit 0" INT TERM
wait
