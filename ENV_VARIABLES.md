# Environment Variables

This document lists all environment variables needed for the PrescribeMe application.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=prescribeme

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production-use-env-variable

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000

# Optional: JWT Token Expiration (defaults shown)
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Backend Variable Descriptions:

- **MONGODB_URL**: MongoDB connection string

  - Local: `mongodb://localhost:27017`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

- **MONGODB_DATABASE**: Database name (default: `prescribeme`)

- **JWT_SECRET_KEY**: Secret key for JWT token signing (CHANGE IN PRODUCTION!)

  - Generate a secure random string for production
  - Example: Use `openssl rand -hex 32` to generate a secure key

- **CORS_ORIGINS**: Comma-separated list of allowed frontend origins
  - Development: `http://localhost:5173,http://localhost:3000`
  - Production: `https://yourdomain.com,https://www.yourdomain.com`
  - No spaces between URLs, just commas

## Frontend Environment Variables

Create a `.env` file (or `.env.local`) in the `frontend/` directory with the following variables:

```env
# API Base URL
VITE_API_URL=http://localhost:8000/api/v1
```

### Frontend Variable Descriptions:

- **VITE_API_URL**: Backend API base URL
  - Development: `http://localhost:8000/api/v1`
  - Production: `https://api.yourdomain.com/api/v1`
  - **Important**: Must include the `/api/v1` prefix

## Example Configuration

### Development Setup

**Backend `.env`** (in `backend/` directory):

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=prescribeme
JWT_SECRET_KEY=dev-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend `.env`** (in `frontend/` directory):

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Production Setup

**Backend `.env`**:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=prescribeme_prod
JWT_SECRET_KEY=<generate-secure-random-key-here>
CORS_ORIGINS=https://prescribeme.com,https://www.prescribeme.com
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
```

**Frontend `.env.production`**:

```env
VITE_API_URL=https://api.prescribeme.com/api/v1
```

## Notes

1. **VITE\_ prefix**: Frontend environment variables must be prefixed with `VITE_` to be accessible in the browser
2. **Security**: Never commit `.env` files to version control. Add them to `.gitignore`
3. **CORS**: Make sure your frontend URL is included in the `CORS_ORIGINS` list
4. **Port mismatch**: If your backend runs on a different port (e.g., 5000), update `VITE_API_URL` accordingly
