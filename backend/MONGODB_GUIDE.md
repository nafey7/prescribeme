# MongoDB + Beanie Setup Guide

Complete guide for using MongoDB with Beanie ODM in this FastAPI application.

## What is Beanie?

**Beanie** is a modern async ODM (Object Document Mapper) for MongoDB that uses Pydantic models. It provides:

- ✅ Type-safe queries
- ✅ Pydantic integration (same validation)
- ✅ Async/await support
- ✅ Automatic indexing
- ✅ Migrations support
- ✅ Clean, intuitive API

## Installation

Already included in `pyproject.toml`:
```toml
beanie==1.26.0
motor==3.5.0
pymongo==4.9.2
```

## Database Setup

### Option 1: Local MongoDB Installation

**macOS (Homebrew)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Windows**
- Download from: https://www.mongodb.com/try/download/community
- Run installer
- MongoDB will run as service on `localhost:27017`

**Verify Installation**
```bash
mongosh  # Opens MongoDB shell
> db.version()  # Shows version
> exit
```

### Option 2: Docker

**Quick Start**
```bash
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  mongo:7.0-alpine
```

**With Authentication**
```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  --name mongodb \
  mongo:7.0-alpine
```

**Using Docker Compose**
```bash
docker-compose up
```

## Environment Configuration

### .env file

```env
# MongoDB Connection
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=prescribeme

# With authentication
MONGODB_URL=mongodb://admin:password123@localhost:27017/?authSource=admin
MONGODB_DB_NAME=prescribeme
```

## Creating Models with Beanie

Beanie models are Pydantic models that extend `Document`:

```python
from beanie import Document, Indexed
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional

class User(Document):
    """User model with Beanie."""

    email: EmailStr = Field(..., index=True, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "users"
```

### Key Features

| Feature | Example | Purpose |
|---------|---------|---------|
| Indexing | `Field(..., index=True)` | Create database index |
| Uniqueness | `Field(..., unique=True)` | Enforce unique values |
| Collections | `Settings.collection` | MongoDB collection name |
| Defaults | `Field(default_factory=...)` | Default values |

## Querying with Beanie

### Basic Operations

```python
from bson import ObjectId
from app.models.user import User

# Create
user = User(
    email="test@example.com",
    full_name="Test User",
    hashed_password="hashed"
)
await user.save()

# Read by ID
user = await User.get(ObjectId(user_id))

# Read by field
user = await User.find_one(User.email == "test@example.com")

# Read all
users = await User.find_all().to_list()

# List with pagination
users = await User.find_all().skip(0).limit(10).to_list()

# Count
count = await User.find_all().count()

# Update
user.full_name = "Updated Name"
await user.save()

# Delete
await user.delete()

# Delete by filter
await User.delete_many(User.is_active == False)
```

### Advanced Queries

```python
# Multiple conditions
users = await User.find(
    User.is_active == True,
    User.email != "admin@example.com"
).to_list()

# Sort
users = await User.find_all().sort(-User.created_at).to_list()

# Projection (select fields)
users = await User.find_all().project(User.email, User.full_name).to_list()

# Text search
users = await User.find(
    {"$text": {"$search": "test"}}
).to_list()
```

## Database Connection

The connection is managed in `app/db/mongo.py`:

```python
from beanie import init_beanie
from motor.motor_asyncio import AsyncClient
from app.core.config import settings

async def init_db():
    """Initialize MongoDB and Beanie."""
    client = AsyncClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        models=[User],  # Register all models
    )
    return client

async def close_db(client: AsyncClient):
    """Close connection."""
    client.close()
```

## Using in FastAPI Endpoints

Models work directly in endpoints thanks to Pydantic integration:

```python
from fastapi import APIRouter, HTTPException
from app.models.user import User
from bson import ObjectId

router = APIRouter()

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID."""
    try:
        user = await User.get(ObjectId(user_id))
        return user
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")

@router.get("/users", response_model=list[User])
async def list_users(skip: int = 0, limit: int = 10):
    """List all users."""
    users = await User.find_all().skip(skip).limit(limit).to_list()
    return users

@router.post("/users", response_model=User)
async def create_user(user: User):
    """Create new user."""
    await user.save()
    return user
```

## Adding New Models

### 1. Create the Model

```python
# app/models/prescription.py
from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional
from bson import ObjectId

class Prescription(Document):
    """Prescription model."""

    user_id: ObjectId = Field(..., index=True)
    medication_name: str
    dosage: str
    frequency: str
    instructions: Optional[str] = None
    status: str = "active"  # active, expired, filled
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "prescriptions"
```

### 2. Register the Model

Update `app/db/mongo.py`:
```python
from app.models.prescription import Prescription

await init_beanie(
    database=client[settings.MONGODB_DB_NAME],
    models=[User, Prescription],  # Add here
)
```

### 3. Create Service Layer

```python
# app/modules/prescriptions/service.py
from app.models.prescription import Prescription
from bson import ObjectId

class PrescriptionService:
    @staticmethod
    async def create(data: dict) -> Prescription:
        """Create prescription."""
        prescription = Prescription(**data)
        await prescription.save()
        return prescription

    @staticmethod
    async def get_by_user(user_id: str, skip: int = 0, limit: int = 10):
        """Get user prescriptions."""
        prescriptions = await Prescription.find(
            Prescription.user_id == ObjectId(user_id)
        ).skip(skip).limit(limit).to_list()
        return prescriptions
```

### 4. Create Endpoints

```python
# app/modules/prescriptions/router.py
from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import User
from app.modules.prescriptions.service import PrescriptionService

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

@router.post("")
async def create_prescription(data: dict, current_user: User = Depends(get_current_user)):
    """Create prescription for current user."""
    data["user_id"] = current_user.id
    return await PrescriptionService.create(data)

@router.get("")
async def get_my_prescriptions(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get current user's prescriptions."""
    return await PrescriptionService.get_by_user(str(current_user.id), skip, limit)
```

### 5. Register Router

Update `app/main.py`:
```python
from app.modules.prescriptions.router import router as prescriptions_router

app.include_router(prescriptions_router, prefix=settings.API_V1_STR)
```

## Testing with MongoDB

Tests use `mongomock-motor` for in-memory MongoDB:

```python
# tests/conftest.py
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient
from app.models.user import User

@pytest.fixture
async def mock_mongodb():
    """Create mock MongoDB for tests."""
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client["prescribeme"],
        models=[User],
    )
    yield client
    client.close()
```

## Indexing

Beanie automatically creates indexes defined in models:

```python
class User(Document):
    email: EmailStr = Field(..., index=True, unique=True)
    username: str = Field(..., index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

View created indexes:
```bash
mongosh
> use prescribeme
> db.users.getIndexes()
```

## Data Validation

Beanie uses Pydantic for validation:

```python
from pydantic import Field, EmailStr, validator

class User(Document):
    email: EmailStr  # Built-in email validation
    age: int = Field(..., ge=0, le=150)  # Range validation

    @validator('email')
    def email_must_be_lowercase(cls, v):
        return v.lower()
```

## Migrations

Beanie doesn't require explicit migrations like SQL databases. MongoDB is schema-flexible.

For version control, document schema changes in code comments:

```python
class User(Document):
    # v1: Added phone field (2024-01-15)
    phone: Optional[str] = None

    # v2: Changed email to unique index (2024-01-20)
    email: EmailStr = Field(..., unique=True)
```

## Relationships

MongoDB supports document references:

```python
from beanie import Document, Link
from typing import Optional

class Prescription(Document):
    user_id: ObjectId  # Store as reference
    medication: str

class User(Document):
    email: str
    # Lazy load prescriptions when needed
    prescriptions: Optional[list[Link[Prescription]]] = []
```

## Backup and Export

```bash
# Export collection to JSON
mongoexport --db prescribeme --collection users --out users.json

# Import from JSON
mongoimport --db prescribeme --collection users --file users.json

# Backup entire database
mongodump --db prescribeme --out ./backup

# Restore from backup
mongorestore ./backup
```

## Performance Tips

### 1. Use Indexes Wisely
```python
class User(Document):
    email: EmailStr = Field(..., index=True, unique=True)
    status: str = Field(..., index=True)  # Add index if querying frequently
```

### 2. Pagination
```python
# Good: Paginate large datasets
users = await User.find_all().skip(0).limit(10).to_list()

# Bad: Load everything
users = await User.find_all().to_list()  # Could be slow with large dataset
```

### 3. Projections (Select Fields)
```python
# Good: Select only needed fields
data = await User.find_all().project(User.email).to_list()

# Bad: Load entire document
users = await User.find_all().to_list()
```

### 4. Batch Operations
```python
# Create multiple documents
users_data = [User(email=f"user{i}@example.com") for i in range(1000)]
await User.insert_many(users_data)
```

## Common Issues

### Connection Refused
```bash
# Check MongoDB is running
mongosh

# Or start MongoDB
docker run -d -p 27017:27017 mongo:7.0-alpine
```

### Authentication Failed
```env
# Ensure correct credentials in MONGODB_URL
MONGODB_URL=mongodb://admin:password123@localhost:27017/?authSource=admin
```

### Model Not Found
```python
# Make sure to register all models in init_db()
await init_beanie(
    database=client[settings.MONGODB_DB_NAME],
    models=[User, Prescription, Doctor],  # Include all
)
```

## Useful Commands

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use prescribeme

# Show collections
show collections

# Count documents
db.users.countDocuments()

# Find all
db.users.find()

# Find one
db.users.findOne({email: "test@example.com"})

# Delete all
db.users.deleteMany({})

# Drop collection
db.users.drop()

# Create text index
db.users.createIndex({name: "text"})
```

## Resources

- **Beanie Docs**: https://beanie-odm.readthedocs.io/
- **MongoDB Docs**: https://docs.mongodb.com/
- **PyMongo Docs**: https://pymongo.readthedocs.io/
- **Motor Docs**: https://motor.readthedocs.io/

---

You now have a modern, async-first MongoDB setup with Beanie ODM! 🚀
