#!/bin/bash

# Development server startup script
# Usage: ./dev.sh or bash dev.sh

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the development server
echo "Starting development server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

