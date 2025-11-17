# Backend Project Index

Complete reference guide for the PrescribeMe FastAPI backend.

## 📖 Documentation

| File | Purpose |
|------|---------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ Get running in 5 minutes |
| **[SETUP.md](SETUP.md)** | 🔧 Detailed setup instructions |
| **[README.md](README.md)** | 📚 Full project documentation |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ System design & patterns |
| **[INDEX.md](INDEX.md)** | 📑 This file |

**Start here:** [QUICK_START.md](QUICK_START.md)

## 🚀 Core Files

### Configuration & Setup
- **`pyproject.toml`** - Dependencies & project metadata
- **`.env.example`** - Environment variables template
- **`.gitignore`** - Git ignore rules
- **`main.py`** - Application entry point

### Docker
- **`Dockerfile`** - Container image definition
- **`docker-compose.yml`** - Multi-service development stack

### Migrations
- **`alembic.ini`** - Database migration configuration

## 📦 Application Structure

```
app/
├── main.py                   # FastAPI app initialization
├── core/
│   ├── config.py            # Settings management
│   └── security.py          # JWT & password hashing
├── db/
│   ├── base.py              # SQLAlchemy base
│   └── session.py           # Async session factory
├── models/
│   └── user.py              # User ORM model
├── schemas/
│   └── user.py              # Pydantic schemas
├── api/
│   └── dependencies.py      # FastAPI dependencies
└── modules/
    ├── auth/                # Authentication
    ├── users/               # User management
    └── health/              # Health check
```

## 🔐 Key Modules

### Authentication (`app/modules/auth/`)
- **`router.py`** - Login/register endpoints
- **`service.py`** - Authentication logic

**Endpoints:**
- `POST /api/v1/auth/register` - Create new user
- `POST /api/v1/auth/login` - Get JWT token

### Users (`app/modules/users/`)
- **`router.py`** - User endpoints
- **`service.py`** - User queries

**Endpoints:**
- `GET /api/v1/users/me` - Current user (protected)
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users` - List users (protected)

### Health (`app/modules/health/`)
- **`router.py`** - Health check

**Endpoints:**
- `GET /health` - Health status

## 🧪 Testing

```
tests/
├── conftest.py             # Pytest fixtures & configuration
├── test_auth.py            # Auth endpoint tests
└── pytest.ini              # Pytest config
```

**Run tests:**
```bash
pytest                      # Run all tests
pytest -v                   # Verbose output
pytest --cov=app            # With coverage
```

## 📊 Database

### Models
- `app/models/user.py` - User model with email, password, timestamps

### Schemas
- `app/schemas/user.py` - Request/response validation

### ORM
- SQLAlchemy 2.0 (async)
- PostgreSQL with asyncpg
- Connection pooling

## 🔑 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ Bearer token validation
- ✅ Input validation with Pydantic
- ✅ SQLAlchemy ORM (SQL injection protection)
- ✅ HTTPBearer security scheme
- ✅ CORS middleware

## 🛠️ Development Commands

### Installation
```bash
pip install -e ".[dev]"
```

### Run Server
```bash
python main.py
```

### Run Tests
```bash
pytest
```

### Code Quality
```bash
black app tests          # Format
ruff check app tests     # Lint
mypy app                 # Type check
```

### Docker
```bash
docker-compose up       # Start all services
docker-compose down     # Stop services
```

## 📡 API Documentation

**Interactive Docs:** http://localhost:8000/docs (Swagger UI)
**Alternative Docs:** http://localhost:8000/redoc (ReDoc)

## 🎯 Quick Reference

### Request Format
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Authentication Header
```bash
Authorization: Bearer <access_token>
```

### Response Format
```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 🌳 Project Statistics

| Category | Count |
|----------|-------|
| Python Modules | 23 |
| Documentation Files | 5 |
| Test Files | 2 |
| Configuration Files | 6 |
| **Total Files** | **36+** |

## 📝 File Manifest

### Application Code (23 files)
```
app/
├── __init__.py
├── main.py
├── api/
│   ├── __init__.py
│   └── dependencies.py
├── core/
│   ├── __init__.py
│   ├── config.py
│   └── security.py
├── db/
│   ├── __init__.py
│   ├── base.py
│   └── session.py
├── models/
│   ├── __init__.py
│   └── user.py
├── modules/
│   ├── __init__.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── service.py
│   ├── health/
│   │   ├── __init__.py
│   │   └── router.py
│   └── users/
│       ├── __init__.py
│       ├── router.py
│       └── service.py
└── schemas/
    ├── __init__.py
    └── user.py
```

### Tests (3 files)
```
tests/
├── __init__.py
├── conftest.py
└── test_auth.py
```

### Configuration (6 files)
```
.env.example
.gitignore
alembic.ini
pyproject.toml
pytest.ini
main.py
```

### Documentation (5 files)
```
QUICK_START.md
SETUP.md
README.md
ARCHITECTURE.md
INDEX.md (this file)
```

### Docker (2 files)
```
Dockerfile
docker-compose.yml
```

## 🎓 Learning Path

1. **New to the project?**
   - Start with [QUICK_START.md](QUICK_START.md)
   - Run the server
   - Try API endpoints in browser at `/docs`

2. **Want to understand architecture?**
   - Read [ARCHITECTURE.md](ARCHITECTURE.md)
   - Review module structure
   - Study data flow diagrams

3. **Need detailed setup?**
   - Follow [SETUP.md](SETUP.md)
   - Resolve any issues
   - Run test suite

4. **Adding new features?**
   - Check module structure in `app/modules/`
   - Follow the same pattern
   - Add tests in `tests/`

5. **Full documentation?**
   - See [README.md](README.md)
   - Explore code comments
   - Review test examples

## 🔗 External Resources

- **FastAPI** - https://fastapi.tiangolo.com
- **SQLAlchemy** - https://docs.sqlalchemy.org
- **Pydantic** - https://docs.pydantic.dev
- **JWT** - https://jwt.io
- **PostgreSQL** - https://www.postgresql.org

## ✨ Key Features

- ⚡ Async/await throughout
- 🏗️ Domain-driven architecture
- 🔐 JWT authentication
- 📊 SQLAlchemy 2.0 ORM
- 🧪 Comprehensive tests
- 📚 Full documentation
- 🐳 Docker support
- 🔍 Type hints everywhere

## 📞 Support

- **Questions?** Check [SETUP.md](SETUP.md) troubleshooting
- **Architecture?** See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Running?** Visit [QUICK_START.md](QUICK_START.md)
- **Full docs?** Read [README.md](README.md)

---

**Version:** 1.0
**Python:** 3.11+
**Framework:** FastAPI 0.115+
**Database:** PostgreSQL + SQLAlchemy
**Last Updated:** 2024
