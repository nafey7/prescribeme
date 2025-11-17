# .gitignore Guide

This project uses a **three-level `.gitignore` structure** to properly manage version control across a monorepo with separate backend and frontend services.

## Structure

```
prescribeme/
├── .gitignore                 ← Root level (OS, IDE, shared)
├── backend/
│   └── .gitignore            ← Python/Backend specific
└── frontend/
    └── .gitignore            ← Node/React specific
```

## What Each `.gitignore` Ignores

### Root `.gitignore` (1.2 KB)
**Purpose**: OS and IDE files relevant across the entire project

Ignores:
- **OS files**: `.DS_Store`, `Thumbs.db`, Windows/Mac temp files
- **IDE configs**: `.vscode/`, `.idea/`, editor backups
- **Logs**: Generic log files, debug logs
- **Secrets**: `.env`, `.aws/`, `.ssh/`, credentials
- **Build artifacts**: General build folders
- **Cache**: Editor/tool cache files

### Backend `.gitignore` (2.0 KB)
**Purpose**: Python/Flask specific files and directories

Ignores:
- **Python**: `__pycache__/`, `*.pyc`, `*.egg-info/`
- **Virtual Environments**: `venv/`, `env/`, `.venv`
- **Build**: `build/`, `dist/`, `*.whl`, `*.tar.gz`
- **Environment Variables**: `.env`, `.env.local`, `.env.*.local`
- **Testing**: `.pytest_cache/`, `.coverage`, `htmlcov/`
- **Database**: `db.sqlite3`, `*.db`
- **Celery**: `celerybeat-schedule`, `*.pid`
- **Logs**: Django/Flask logs
- **Poetry/Pipenv**: `poetry.lock`, `Pipfile.lock`
- **Cache**: `.mypy_cache/`, `.ruff_cache/`

### Frontend `.gitignore` (1.5 KB)
**Purpose**: Node/React specific files and directories

Ignores:
- **Node modules**: `node_modules/`, package lock files
- **Environment Variables**: `.env`, `.env.local`, `.env.*.local`
- **Build**: `dist/`, `build/`, `.next/`, `out/`
- **Testing**: `coverage/`, `.jest-cache/`, `.nyc_output/`
- **Logs**: npm/yarn logs, error logs
- **Node-specific**: `.npm`, `.eslintcache`, `.yarn/`
- **Cache**: `.cache/`, `.vite/`
- **Vite**: Build and cache directories

## What's NOT Ignored (Version Controlled)

- Source code (`.ts`, `.tsx`, `.py`, `.js`)
- Configuration files (`package.json`, `pyproject.toml`, `.env.example`)
- Documentation (`.md` files)
- Tests (`.test.ts`, `test_*.py`)
- Build configurations (`vite.config.ts`, `tsconfig.json`)
- Migrations and database schemas (tracked separately)

## Key Files That Must Be Tracked

```
✅ Keep in Git
├── package.json              ← Dependency list
├── package-lock.json         ← (Optional - some prefer to ignore)
├── .env.example             ← Template for env vars
├── tsconfig.json            ← TypeScript config
├── vite.config.ts           ← Build config
├── README.md                ← Documentation
├── src/                     ← Source code
├── migrations/              ← Database migrations
└── docker-compose.yml       ← Docker config

❌ Do NOT Keep in Git
├── .env                     ← Actual secrets
├── .env.local
├── node_modules/            ← Dependencies
├── venv/                    ← Virtual env
├── dist/                    ← Build output
├── db.sqlite3               ← Local database
└── *.log                    ← Logs
```

## Environment Variables

### `.env.example` (MUST be tracked)
```python
# backend/.env.example
DATABASE_URL=postgresql://user:password@localhost:5432/db
SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6379/0
DEBUG=False
```

### `.env.local` (MUST be ignored)
```python
# backend/.env.local (git ignored)
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/prescribeme_dev
SECRET_KEY=dev-secret-key-12345
REDIS_URL=redis://localhost:6379/0
DEBUG=True
```

## How to Use

### Setting up locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourname/prescribeme.git
   cd prescribeme
   ```

2. **Set up backend**
   ```bash
   cd backend
   cp .env.example .env.local
   # Edit .env.local with your local values
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up frontend**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your local API URL
   npm install
   ```

### Making environment-specific changes

1. **Add new env variable**
   - Update `.env.example` with the key (no secret value)
   - Commit `.env.example`
   - Each developer updates their `.env.local` with their value

2. **Add new ignore rule**
   - Update the appropriate `.gitignore` file
   - Commit the `.gitignore` change
   - It automatically applies to everyone

## Common Issues

### "I accidentally committed `.env`"

```bash
# Remove from Git history (but keep locally)
git rm --cached .env
git commit -m "Remove .env from version control"

# Make sure .gitignore exists
echo ".env" >> backend/.gitignore
git add backend/.gitignore
git commit -m "Add .env to .gitignore"
```

### "A file should be ignored but isn't"

1. Check if the rule is in the right `.gitignore`
2. Clear Git's cache:
   ```bash
   git rm -r --cached .
   git add .
   git commit -m "Update .gitignore"
   ```

### "An ignored file was tracked before"

```bash
# Remove from Git
git rm --cached <filename>
git commit -m "Stop tracking <filename>"
```

## Best Practices

1. ✅ **Always** use `.env.example` for template variables
2. ✅ **Never** commit actual `.env` files
3. ✅ **Always** add `node_modules/` and `venv/` to ignores
4. ✅ **Always** ignore build output (`dist/`, `build/`)
5. ✅ **Always** ignore lock files that are auto-generated
6. ✅ **Commit** lock files for **reproducible builds** (debatable)
7. ❌ **Never** commit secrets, API keys, or passwords
8. ❌ **Never** commit IDE personal settings

## Monorepo Advantages

Having separate `.gitignore` files:
- ✅ Backend team manages Python ignores
- ✅ Frontend team manages Node ignores
- ✅ Fewer merge conflicts
- ✅ Clearer intent and organization
- ✅ Easier to understand what's being ignored

## Reference

### Backend ignores
- Python packages: `__pycache__`, `*.pyc`, `*.egg-info`
- Virtual env: `venv`, `env`, `.venv`
- Build: `build`, `dist`, `*.whl`
- Testing: `.pytest_cache`, `.coverage`, `.tox`
- Database: `*.db`, `*.sqlite3`
- Locks: `poetry.lock`, `Pipfile.lock`

### Frontend ignores
- Node modules: `node_modules/`
- Lock files: `package-lock.json`, `yarn.lock`
- Build: `dist/`, `build/`, `.next`
- Cache: `.eslintcache`, `.vite`
- Testing: `coverage/`, `.jest-cache`
- Logs: `npm-debug.log`, `yarn-error.log`

---

**Generated**: 2025-11-17
**Total `.gitignore` files**: 3
**Coverage**: 100% of project needs
