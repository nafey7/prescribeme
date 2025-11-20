.PHONY: dev install clean

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python3
VENV := venv
PIP := $(VENV)/bin/pip
UVICORN := $(VENV)/bin/uvicorn

help: ## Show this help message
	@echo "Available commands:"
	@echo "  make dev       - Start development server"
	@echo "  make install   - Install dependencies"
	@echo "  make clean     - Remove virtual environment and cache files"
	@echo "  make help      - Show this help message"

install: ## Install dependencies
	@if [ ! -d "$(VENV)" ]; then \
		echo "Creating virtual environment..."; \
		$(PYTHON) -m venv $(VENV); \
	fi
	@echo "Installing dependencies..."
	@$(PIP) install --upgrade pip
	@$(PIP) install -r requirements.txt
	@echo "Dependencies installed!"

dev: install ## Start development server
	@echo "Starting development server..."
	@$(UVICORN) app.main:app --reload --host 0.0.0.0 --port 8000

clean: ## Remove virtual environment and cache files
	@echo "Cleaning up..."
	@rm -rf $(VENV)
	@find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@echo "Cleanup complete!"

