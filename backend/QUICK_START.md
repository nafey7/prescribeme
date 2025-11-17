# Quick Start Guide - 5 Minutes

Get the FastAPI backend running in under 5 minutes with MongoDB.

## TL;DR

```bash
# 1. Install dependencies
pip install -e ".[dev]"

# 2. Start MongoDB (in another terminal)
docker run -d -p 27017:27017 mongo:7.0-alpine

# 3. Start the server
python main.py

# 4. Open browser
# API Docs: http://localhost:8000/docs
```

## Step-by-Step

### Prerequisites
- Python 3.11+
- Docker (for MongoDB) OR MongoDB installed locally
- Terminal access

### 1️⃣ Install Dependencies (1 min)

```bash
cd backend
pip install -e ".[dev]"
```

### 2️⃣ Start MongoDB (30 seconds)

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name prescribeme_mongo mongo:7.0-alpine
```

**Option B: Local MongoDB**
```bash
# Install from https://www.mongodb.com/try/download/community
mongod  # Starts MongoDB on localhost:27017
```

### 3️⃣ Setup Environment (30 seconds)

```bash
cp .env.example .env
```

Default settings should work if MongoDB is running locally on port 27017.

**Example .env:**
```
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=prescribeme
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

### 4️⃣ Run Server (30 seconds)

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

### 5️⃣ Test the API (30 seconds)

Open your browser: **http://localhost:8000/docs**

You should see the interactive Swagger UI with all API endpoints.

Or test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Register a user
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

# Copy the access_token from login response and use it:
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer <your_token_here>"
```

## Docker Alternative

Use Docker Compose for both MongoDB and API:

```bash
docker-compose up
```

This starts both MongoDB and the API in containers automatically.

## Running Tests

```bash
pytest
```

## Common Issues

### ❌ "ModuleNotFoundError: No module named 'app'"

**Solution:** Ensure you're in the `backend` directory and installed with `-e` flag:
```bash
cd backend
pip install -e .
```

### ❌ "connection refused" on MONGODB_URL

**Solution:** Check MongoDB is running:
```bash
# Check if running
mongosh

# Or start with Docker
docker run -d -p 27017:27017 mongo:7.0-alpine
```

### ❌ "ServerSelectionTimeoutError"

**Solution:** MongoDB isn't accessible. Verify:
1. MongoDB is running on port 27017
2. MONGODB_URL in .env is correct (e.g., `mongodb://localhost:27017`)
3. If using Docker, container is running: `docker ps`

### ❌ Port 8000 already in use

**Solution:** Change port in main.py:
```python
uvicorn.run(..., port=8001)
```

### ❌ "Tests failing with mongomock errors"

**Solution:** Ensure `mongomock-motor` is installed:
```bash
pip install -e ".[dev]"
```

## API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | ❌ |
| POST | `/api/v1/auth/register` | Register user | ❌ |
| POST | `/api/v1/auth/login` | Login & get token | ❌ |
| GET | `/api/v1/users/me` | Get current user | ✅ |
| GET | `/api/v1/users/{id}` | Get user by ID | ❌ |
| GET | `/api/v1/users` | List all users | ✅ |

**Note:** ✅ requires `Authorization: Bearer <token>` header

## What's Included

✅ FastAPI boilerplate with best practices
✅ PostgreSQL + SQLAlchemy async ORM
✅ JWT authentication
✅ Pydantic validation
✅ Pytest testing setup
✅ Docker support
✅ Domain-driven architecture
✅ Type hints throughout
✅ CORS configured
✅ Error handling

## Next Steps

1. ✅ Backend running?
2. Add more endpoints (prescriptions, doctors, etc.)
3. Implement database migrations with Alembic
4. Add more tests
5. Deploy to production

## File Structure Quick Reference

```
backend/
├── app/
│   ├── core/              # Config & security
│   ├── db/                # Database setup
│   ├── models/            # Database models
│   ├── schemas/           # Request/response schemas
│   ├── api/               # Shared dependencies
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Login/register
│   │   ├── users/        # User management
│   │   └── health/       # Health check
│   └── main.py            # FastAPI app
├── tests/                 # Test files
├── main.py                # Entry point
└── pyproject.toml         # Dependencies
```

## IDE Setup

### VSCode

Install extensions:
- Python
- Pylance
- FastAPI
- SQLAlchemy

### PyCharm

- Already has great Python support
- Configure interpreter to use backend venv
- Mark `app/` as Sources Root

## Debugging

Enable debug mode in `.env`:
```
DEBUG=True
```

Then start server:
```bash
python main.py
```

For breakpoints with pdb:
```python
import pdb; pdb.set_trace()
```

## File Watching & Auto-reload

The development server auto-reloads on code changes. If it doesn't:

```bash
# Reinstall with editable mode
pip install -e .

# Restart server
python main.py
```

## Next: Adding a New Feature

To add a new feature (e.g., prescriptions):

1. Create model in `app/models/prescription.py`
2. Create schemas in `app/schemas/prescription.py`
3. Create service in `app/modules/prescriptions/service.py`
4. Create router in `app/modules/prescriptions/router.py`
5. Import router in `app/main.py`
6. Add tests in `tests/test_prescriptions.py`

See ARCHITECTURE.md for detailed examples.

---

**Questions?** Check README.md for full documentation.
