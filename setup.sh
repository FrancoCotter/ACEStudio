#!/bin/bash
# APEXFlow Setup Script

set -e

echo "=================================="
echo "  APEXFlow Setup"
echo "=================================="

# Check if ACE-Step exists
ACESTEP_PATH="${ACESTEP_PATH:-../ACE-Step-1.5}"

if [ ! -d "$ACESTEP_PATH" ]; then
    echo "Error: ACE-Step not found at $ACESTEP_PATH"
    echo ""
    echo "Please clone ACE-Step first:"
    echo "  cd .."
    echo "  git clone https://github.com/ace-step/ACE-Step-1.5"
    echo "  cd ACE-Step-1.5"
    echo "  uv venv && uv pip install -e ."
    echo "  cd ../ace-step-ui"
    echo "  ./setup.sh"
    exit 1
fi

ACESTEP_VENV_FOUND=""
for venv_dir in env .venv venv; do
    if [ -d "$ACESTEP_PATH/$venv_dir" ]; then
        ACESTEP_VENV_FOUND="$venv_dir"
        break
    fi
done

if [ -z "$ACESTEP_VENV_FOUND" ]; then
    echo "Error: ACE-Step virtual environment not found under env, .venv, or venv. Please set up ACE-Step first:"
    echo "  cd $ACESTEP_PATH"
    echo "  uv sync"
    exit 1
fi

echo "Found ACE-Step at: $ACESTEP_PATH"

# Install subject detection dependencies in ACE-Step venv
echo "Installing subject detection python dependencies (opencv-python, mediapipe) in ACE-Step venv..."
ACESTEP_PYTHON=""
ACESTEP_PIP=""
for venv_dir in env .venv venv; do
    if [ -z "$ACESTEP_PYTHON" ] && [ -f "$ACESTEP_PATH/$venv_dir/bin/python" ]; then
        ACESTEP_PYTHON="$ACESTEP_PATH/$venv_dir/bin/python"
    elif [ -z "$ACESTEP_PYTHON" ] && [ -f "$ACESTEP_PATH/$venv_dir/Scripts/python.exe" ]; then
        ACESTEP_PYTHON="$ACESTEP_PATH/$venv_dir/Scripts/python.exe"
    fi

    if [ -z "$ACESTEP_PIP" ] && [ -f "$ACESTEP_PATH/$venv_dir/bin/pip" ]; then
        ACESTEP_PIP="$ACESTEP_PATH/$venv_dir/bin/pip"
    elif [ -z "$ACESTEP_PIP" ] && [ -f "$ACESTEP_PATH/$venv_dir/Scripts/pip.exe" ]; then
        ACESTEP_PIP="$ACESTEP_PATH/$venv_dir/Scripts/pip.exe"
    fi
done

if [ -n "$ACESTEP_PYTHON" ]; then
    echo "Using ACE-Step Python: $ACESTEP_PYTHON"
    if [ -n "$ACESTEP_PIP" ]; then
        "$ACESTEP_PIP" install opencv-python mediapipe --quiet || echo "Warning: Failed to install python dependencies automatically. Please run: \"$ACESTEP_PYTHON\" -m pip install opencv-python mediapipe"
    else
        "$ACESTEP_PYTHON" -m pip install opencv-python mediapipe --quiet || echo "Warning: Failed to install python dependencies automatically. Please run: \"$ACESTEP_PYTHON\" -m pip install opencv-python mediapipe"
    fi

    echo "Verifying subject detection dependencies..."
    "$ACESTEP_PYTHON" server/scripts/check_subject_detection_env.py || echo "Warning: mediapipe/opencv verification failed in the selected ACE-Step environment."
else
    echo "Warning: No ACE-Step virtual environment was found under env, .venv, or venv."
    echo "Please manually install: pip install opencv-python mediapipe"
fi

# Get absolute path
ACESTEP_PATH=$(cd "$ACESTEP_PATH" && pwd)

# Create .env file
echo "Creating .env file..."
cat > .env << EOF
# APEXFlow Configuration

# Path to ACE-Step installation
ACESTEP_PATH=$ACESTEP_PATH

# Server ports
PORT=3001
FRONTEND_PORT=3000

# Database
DATABASE_PATH=./server/data/acestep.db
EOF

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
npm install

# Install server dependencies
echo ""
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Initialize database
echo ""
echo "Initializing database..."
cd server
npm run migrate 2>/dev/null || echo "Migration script not found, skipping..."
cd ..

echo ""
echo "=================================="
echo "  Setup Complete!"
echo "=================================="
echo ""
echo "To start the application:"
echo ""
echo "  # Terminal 1 - Start backend"
echo "  cd server && npm run dev"
echo ""
echo "  # Terminal 2 - Start frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo ""
