# FastAPI Backend Setup Guide

This guide will walk you through setting up the PrescribeMe API backend.

## Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip/poetry/uv for package management

## Installation Steps

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

**Using venv:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Using uv (faster):**
```bash
uv venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
# Install with dev dependencies
pip install -e ".[dev]"

# Or using uv
uv pip install -e ".[dev]"
```

### 4. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set DATABASE_URL pointing to your PostgreSQL instance
```

### 5. Create PostgreSQL Database

```bash
# Using psql
createdb prescribeme

# Or use pgAdmin/DBeaver GUI
```

### 6. Verify Installation

```bash
# Check dependencies are installed
pip list | grep fastapi

# Try importing main package
python -c "from app.main import app; print('✓ Installation successful')"
```

## Development Workflow

### Start Development Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

### Access API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Run Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app
```

### Format and Lint Code

```bash
# Format with Black
black app tests

# Lint with Ruff
ruff check app tests --fix

# Type check with MyPy
mypy app
```

## Docker Setup (Alternative)

### Using Docker Compose

```bash
# Start all services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

The API will be available at `http://localhost:8000`

### Manual Docker Build

```bash
# Build image
docker build -t prescribeme-api .

# Run container (requires running PostgreSQL)
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://user:pass@localhost:5432/prescribeme" \
  prescribeme-api
```

## Troubleshooting

### Import Errors

If you see `ModuleNotFoundError` when running the app:

```bash
# Ensure you're in the backend directory
cd backend

# Reinstall in editable mode
pip install -e .
```

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env matches your setup
3. Test connection: `psql postgresql://user:password@localhost/prescribeme`

### Port Already in Use

If port 8000 is in use, change it in `main.py`:

```python
uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=8001,  # Change port here
    reload=True,
)
```

## Key Files

| File | Purpose |
|------|---------|
| `pyproject.toml` | Dependencies and project metadata |
| `.env` | Environment configuration (not in git) |
| `app/main.py` | FastAPI application setup |
| `app/core/config.py` | Settings management |
| `app/core/security.py` | Password hashing and JWT handling |
| `app/db/session.py` | Database session management |
| `app/modules/*/router.py` | API endpoint definitions |
| `tests/` | Test suite |

## Next Steps

1. ✓ Backend boilerplate set up
2. Create `.env` file with database credentials
3. Start PostgreSQL database
4. Run `python main.py` to test
5. Access `http://localhost:8000/docs` to see API
6. Run `pytest` to verify tests pass
7. Create additional modules as needed (e.g., prescriptions)

## API Quick Test

Once running, test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN with actual token from login)
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer TOKEN"
```

## Production Checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in `.env`
- [ ] Generate secure `SECRET_KEY` (min 32 characters)
- [ ] Use strong database password
- [ ] Configure CORS origins appropriately
- [ ] Set up database backups
- [ ] Enable HTTPS/TLS
- [ ] Add environment-specific logging
- [ ] Set up monitoring and alerting
- [ ] Test all endpoints thoroughly
- [ ] Review security best practices

## Support

For issues or questions:
1. Check the README.md
2. Review test files for usage examples
3. Check FastAPI documentation: https://fastapi.tiangolo.com
4. Open an issue on GitHub
