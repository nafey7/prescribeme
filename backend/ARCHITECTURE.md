# FastAPI Backend Architecture

## Overview

The PrescribeMe backend follows a **domain-driven, layered architecture** optimized for scalability and maintainability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Requests                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    FastAPI Application                      │
│                   (app/main.py)                             │
├─────────────────────────────────────────────────────────────┤
│                   CORS Middleware                           │
│              Error Handling Middleware                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐ ┌──────▼────────┐ ┌────▼──────────┐
│   /health    │ │  /api/v1/auth │ │ /api/v1/users │
│   (Health)   │ │   (Auth)      │ │   (Users)     │
└───────┬──────┘ └──────┬────────┘ └────┬──────────┘
        │                │               │
        │    ┌───────────┴────────────┬──┘
        │    │                        │
┌───────▼────▼─────────────┐ ┌───────▼──────────────────┐
│  API Layer (Routers)     │ │ Dependencies & Security  │
│  • router.py             │ │ • api/dependencies.py    │
│  • Pydantic schemas      │ │ • HTTPBearer auth        │
│  • Request validation    │ │ • JWT verification      │
└──────────┬───────────────┘ └───────┬──────────────────┘
           │                         │
           └────────────┬────────────┘
                        │
        ┌───────────────▼────────────────┐
        │   Service Layer (Business Logic)│
        │ • service.py                   │
        │ • AuthService                  │
        │ • UserService                  │
        │ • Business rules               │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │   Data Access Layer (Models)   │
        │ • SQLAlchemy ORM               │
        │ • Database models              │
        │ • Query builders               │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │   Database Layer               │
        │ • PostgreSQL (async)           │
        │ • Connection pooling           │
        │ • Session management           │
        └────────────────────────────────┘
```

## Directory Structure

```
backend/
│
├── app/                          # Main application package
│   │
│   ├── main.py                  # FastAPI app initialization
│   │                             # - Mount routers
│   │                             # - Configure middleware
│   │                             # - Set up CORS
│   │
│   ├── core/                    # Core configuration & utilities
│   │   ├── config.py            # Settings (env variables)
│   │   └── security.py          # Password hashing, JWT tokens
│   │
│   ├── db/                      # Database configuration
│   │   ├── base.py              # SQLAlchemy declarative base
│   │   └── session.py           # Async session factory & dependency
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   └── user.py              # User model
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   └── user.py              # User schemas (Create, Response, etc.)
│   │
│   ├── api/                     # API layer utilities
│   │   └── dependencies.py      # FastAPI dependencies (auth, db)
│   │
│   └── modules/                 # Domain modules (features)
│       ├── auth/                # Authentication module
│       │   ├── router.py        # /api/v1/auth endpoints
│       │   └── service.py       # Auth business logic
│       ├── users/               # User management module
│       │   ├── router.py        # /api/v1/users endpoints
│       │   └── service.py       # User business logic
│       └── health/              # Health check module
│           └── router.py        # /health endpoint
│
├── tests/                       # Test suite
│   ├── conftest.py             # Pytest fixtures & configuration
│   └── test_auth.py            # Auth endpoint tests
│
├── alembic/                    # Database migrations (future)
│
├── main.py                     # Application entry point
├── pyproject.toml              # Dependencies & project metadata
├── pytest.ini                  # Pytest configuration
├── Dockerfile                  # Container image
├── docker-compose.yml          # Local development stack
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── SETUP.md                    # Setup instructions
└── ARCHITECTURE.md             # This file
```

## Layered Architecture Pattern

### 1. **Presentation Layer** (Routers)
- `app/modules/*/router.py`
- Handles HTTP requests/responses
- Input validation with Pydantic
- Converts domain objects to schemas

### 2. **Service Layer** (Business Logic)
- `app/modules/*/service.py`
- Implements business rules
- Orchestrates database operations
- No direct HTTP knowledge

### 3. **Data Access Layer** (Models & ORM)
- `app/models/`
- SQLAlchemy ORM models
- Database schema definitions
- Query logic

### 4. **Infrastructure Layer** (Database)
- `app/db/`
- Database connections
- Async session management
- Connection pooling

### 5. **Cross-Cutting Concerns**
- `app/core/` - Configuration, security, constants
- `app/api/` - Shared dependencies (auth, db)
- `app/schemas/` - Data serialization

## Module Structure

Each feature module follows this pattern:

```
app/modules/feature_name/
├── __init__.py
├── router.py          # API routes (@router.get, @router.post, etc.)
├── service.py         # Business logic (async methods)
├── schemas.py         # Request/response models (optional)
├── models.py          # Database models (if domain-specific)
└── exceptions.py      # Custom exceptions (optional)
```

### Example: Auth Module Flow

```
HTTP POST /api/v1/auth/login
    ↓
[router.py] - Login endpoint
    ↓ Validate with LoginRequest schema
[service.py] - authenticate_user()
    ↓
[database] - Query user from PostgreSQL
    ↓
[security.py] - verify_password()
    ↓
[service.py] - create_access_token()
    ↓
[router.py] - Return Token schema
    ↓
HTTP 200 {access_token: "...", token_type: "bearer"}
```

## Authentication Flow

```
User Registration
├── POST /api/v1/auth/register
├── Validate: UserCreate schema
├── Hash password: bcrypt
├── Save to database
└── Return: UserResponse

User Login
├── POST /api/v1/auth/login
├── Validate credentials
├── Check password hash
├── Create JWT token (exp: 30 min)
└── Return: access_token

Protected Request
├── GET /api/v1/users/me
├── Bearer token in Authorization header
├── Dependency: get_current_user()
├── Verify JWT signature
├── Fetch user from database
└── Return: UserResponse
```

## Database Design

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIMEZONE,
    updated_at TIMESTAMP WITH TIMEZONE
);
```

**Indexes:**
- `users(email)` - For quick email lookups
- `users(id)` - Automatic primary key index

## Best Practices Implemented

### 1. **Async/Await**
- All I/O operations are non-blocking
- Database queries use `asyncio`
- Better resource utilization

### 2. **Dependency Injection**
- FastAPI's `Depends()` for clean testing
- Decouples components
- Easy to mock in tests

### 3. **Type Hints**
- Full type annotations
- Better IDE support
- Runtime validation with Pydantic

### 4. **Error Handling**
- Specific HTTP status codes
- Consistent error responses
- Validation error details

### 5. **Security**
- Password hashing with bcrypt
- JWT tokens for stateless auth
- Bearer token authentication
- HTTPBearer security scheme

### 6. **Testing**
- Unit tests with pytest
- Async test support
- Test database fixtures
- Coverage tracking

### 7. **Separation of Concerns**
- Models: Data representation
- Schemas: API contracts
- Services: Business logic
- Routers: HTTP endpoints

## Data Flow Example: Get Current User

```
1. Client sends request:
   GET /api/v1/users/me
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

2. FastAPI middleware processes request

3. Route handler executes:
   async def get_current_user_info(current_user: User = Depends(get_current_user))

4. get_current_user dependency:
   - Extracts token from Authorization header
   - Decodes JWT token
   - Validates signature and expiration
   - Queries database for user
   - Returns User object

5. Route handler receives User object

6. User object is serialized with UserResponse schema

7. JSON response is sent to client:
   {
     "id": 1,
     "email": "test@example.com",
     "full_name": "Test User",
     "is_active": true,
     "created_at": "2024-01-15T10:00:00Z",
     "updated_at": "2024-01-15T10:00:00Z"
   }
```

## Scalability Considerations

### Current Design
- ✅ Async database operations
- ✅ Connection pooling
- ✅ Stateless API (JWT)
- ✅ Modular structure

### Future Improvements
- 🔄 Caching layer (Redis)
- 🔄 Message queue (Celery/RabbitMQ)
- 🔄 Search engine (Elasticsearch)
- 🔄 Rate limiting
- 🔄 Request logging
- 🔄 Distributed tracing

## Development vs Production

### Development
- `DEBUG=True` in .env
- Hot reload enabled
- Detailed error messages
- SQLite for testing

### Production
- `DEBUG=False` in .env
- PostgreSQL with backups
- Minimal error details
- Environment-specific secrets
- HTTPS/TLS enabled
- Monitoring and logging

## Testing Strategy

```
Unit Tests
├── Service layer logic
└── Database model behavior

Integration Tests
├── Router endpoints
├── Database operations
└── Authentication flow

End-to-End Tests
├── API workflows
└── User scenarios
```

## Performance Optimization

1. **Database**
   - Connection pooling
   - Async queries
   - Proper indexing

2. **API**
   - Response caching (future)
   - Pagination support
   - Field selection (future)

3. **Application**
   - Async/await throughout
   - Minimal dependencies
   - Dependency injection

## Security Layers

1. **Input Validation** - Pydantic schemas
2. **Authentication** - JWT tokens
3. **Authorization** - Dependencies & role-based access
4. **Password Security** - Bcrypt hashing
5. **Database** - Parameterized queries (SQLAlchemy ORM)
6. **CORS** - Middleware configuration

---

**Last Updated:** 2024
**Architecture Style:** Domain-Driven Design + Layered Architecture
**Target Python:** 3.11+
