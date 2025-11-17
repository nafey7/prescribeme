# PrescribeMe API

Modern FastAPI backend for PrescribeMe application with MongoDB, Beanie ODM, JWT authentication, and async/await throughout.

## Features

- ⚡ **FastAPI 0.115+** - Modern, fast web framework
- 🗄️ **MongoDB + Beanie ODM** - Document database with Pydantic models
- 🔐 **JWT Authentication** - Secure token-based auth
- 📊 **Pydantic V2** - Data validation and serialization
- 🏗️ **Domain-Driven Architecture** - Clean, scalable project structure
- 🧪 **Pytest** - Comprehensive testing setup
- 📝 **API Versioning** - `/api/v1` prefix for future-proof APIs
- 🐳 **Docker Support** - MongoDB and FastAPI in containers

## Project Structure

```
backend/
├── app/
│   ├── core/              # Core configs, security, settings
│   ├── db/                # Database session, base models
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic request/response schemas
│   ├── api/               # API dependencies and utilities
│   ├── modules/           # Domain modules (auth, users, etc.)
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # User management module
│   │   └── health/       # Health check module
│   └── main.py            # FastAPI app initialization
├── tests/                 # Test suite
├── main.py                # Entry point
├── pyproject.toml         # Python dependencies
├── pytest.ini             # Pytest configuration
└── README.md
```

## Quick Start

### 1. Installation

```bash
cd backend
pip install -e ".[dev]"
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your MongoDB connection
# MONGODB_URL=mongodb://localhost:27017
# MONGODB_DB_NAME=prescribeme
```

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB (https://docs.mongodb.com/manual/installation/)
# Start MongoDB service
mongod

# MongoDB runs on localhost:27017 by default
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0-alpine
```

### 4. Run Development Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Health
- `GET /health` - Health check

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Users
- `GET /api/v1/users/me` - Get current user (requires auth)
- `GET /api/v1/users/{user_id}` - Get user by ID
- `GET /api/v1/users` - List all users (requires auth)

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run in verbose mode
pytest -v
```

## Development

### Code Quality Tools

```bash
# Format code
black app tests

# Lint
ruff check app tests

# Type checking
mypy app
```

### Creating New Modules

Follow the domain-driven structure. Example for a new "prescriptions" module:

```
app/modules/prescriptions/
├── __init__.py
├── router.py      # API endpoints
├── service.py     # Business logic
├── schemas.py     # Request/response models (optional)
└── models.py      # Database models (optional)
```

Then register the router in `app/main.py`:

```python
from app.modules.prescriptions.router import router as prescriptions_router

app.include_router(prescriptions_router, prefix=settings.API_V1_STR)
```

## Authentication Flow

1. User registers with email and password
2. Password is hashed with bcrypt
3. User logs in with credentials
4. API returns JWT token with 30-minute expiration
5. Client includes token in Authorization header: `Bearer <token>`
6. Protected routes verify token and fetch user from database

## Configuration

Key environment variables in `.env`:

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/prescribeme
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
API_V1_STR=/api/v1
PROJECT_NAME=PrescribeMe API
```

## Best Practices Implemented

- ✅ Async/await throughout for I/O operations
- ✅ Dependency injection for testability
- ✅ Type hints on all functions
- ✅ Separation of concerns (routers, services, models, schemas)
- ✅ Exception handling and validation
- ✅ CORS middleware configuration
- ✅ API versioning support
- ✅ Comprehensive test setup
- ✅ Security best practices (password hashing, JWT validation)

## Next Steps

1. Add prescription model and endpoints
2. Add doctor model and endpoints
3. Implement role-based access control
4. Add request logging and monitoring
5. Set up CI/CD pipeline and deployment
6. Add integration tests for endpoints
7. Implement rate limiting
8. Add caching layer (Redis)

## Support

For issues or questions, open an issue in the GitHub repository.
