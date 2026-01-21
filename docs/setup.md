# Seshio MVP - Setup & Development Guide

Complete guide for setting up and developing the Seshio MVP.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Conda Environment Setup](#conda-environment-setup)
4. [Docker Setup](#docker-setup)
5. [Supabase Configuration](#supabase-configuration)
6. [Gemini API Setup](#gemini-api-setup)
7. [Development Workflow](#development-workflow)
8. [Testing](#testing)
9. [Common Commands](#common-commands)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Docker Desktop** (includes Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version` && `docker-compose --version`

- **Node.js 20+** and npm
  - Download: https://nodejs.org/
  - Verify: `node --version` && `npm --version`

- **Conda** (Anaconda or Miniconda)
  - Download: https://docs.conda.io/en/latest/miniconda.html
  - Verify: `conda --version`

- **Git**
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

---

## Quick Start

For a fast setup, follow these steps. For detailed instructions, see the sections below.

```bash
# 1. Clone repository
git clone https://github.com/sakialabs/seshio
cd seshio

# 2. Create conda environment
conda create -n seshio python=3.11 -y
conda activate seshio

# 3. Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# 4. Install frontend dependencies
cd frontend
npm install
cd ..

# 5. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit both files with your credentials (see sections below)

# 6. Start Docker services (DB + Redis)
docker-compose up -d postgres redis

# 7. Run database migrations
cd backend
alembic upgrade head
cd ..

# 8. Start development servers
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Conda Environment Setup

### Create Environment

```bash
# Create new conda environment with Python 3.11
conda create -n seshio python=3.11 -y

# Activate environment
conda activate seshio

# Verify Python version
python --version  # Should show Python 3.11.x
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Install Development Tools

```bash
# Code formatting and linting
pip install black ruff mypy

# Testing
pip install pytest pytest-asyncio pytest-cov hypothesis
```

### Deactivate Environment

```bash
conda deactivate
```

### Remove Environment (if needed)

```bash
conda env remove -n seshio
```

---

## Docker Setup

We use Docker Compose with profiles for flexible deployment:

- **Default**: Only PostgreSQL and Redis (run backend/frontend locally)
- **Full Profile**: All services including backend and frontend

### Start All Services (Full Docker)

```bash
# Start everything in Docker
docker-compose --profile full up -d

# Or use make
make up
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 8000)
- Frontend (port 3000)

### Start Database Only (Local Development)

```bash
# Start only database services
docker-compose up -d postgres redis

# Or use make
make up-db
```

This starts only PostgreSQL and Redis. Run backend and frontend locally:
```bash
# Terminal 1 - Backend
conda activate seshio
cd backend && uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Common Docker Commands

```bash
# View logs
docker-compose logs -f

# View specific service
docker-compose logs -f postgres
docker-compose logs -f backend

# Check running services
docker-compose ps
```

### Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d seshio

# Common commands:
\dt                    # List tables
\d table_name         # Describe table
\q                    # Quit
```

### Redis Access

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Common commands:
PING                  # Test connection
KEYS *                # List all keys
FLUSHALL              # Clear all data
```

---

## Supabase Configuration

Seshio uses Supabase for authentication and file storage.

### 1. Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Configure:
   - Name: `seshio-mvp`
   - Database Password: (strong password)
   - Region: (closest to you)
4. Wait ~2 minutes for setup

### 2. Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Set **Site URL**: `http://localhost:3000`
4. Add **Redirect URLs**: `http://localhost:3000/**`
5. Set password requirements (min 8 characters)

### 3. Create Storage Bucket

1. Go to **Storage**
2. Create bucket: `materials`
3. Make it **private** (not public)
4. Add policy for authenticated users:

```sql
(bucket_id = 'materials' AND auth.uid() = owner)
```

### 4. Get API Credentials

1. Go to **Settings** > **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (for frontend)
   - **service_role** key (for backend - keep secret!)
3. Go to **Settings** > **API** > **JWT Settings**
4. Copy **JWT Secret**

### 5. Update Environment Files

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/seshio
DATABASE_URL_SYNC=postgresql://postgres:postgres@localhost:5432/seshio
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
REDIS_URL=redis://localhost:6379/0
```

---

## Gemini API Setup

### 1. Get API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key

### 2. Add to Backend Environment

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Test API Key (Optional)

```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

---

## Development Workflow

### Daily Development

```bash
# 1. Activate conda environment
conda activate seshio

# 2. Start Docker services
docker-compose up -d postgres redis

# 3. Start backend (Terminal 1)
cd backend
uvicorn app.main:app --reload

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev

# 5. View logs
docker-compose logs -f postgres
```

### Code Quality

```bash
# Format code
cd backend && black . && cd ..
cd frontend && npm run format && cd ..

# Lint code
cd backend && ruff check . && cd ..
cd frontend && npm run lint && cd ..

# Type check
cd backend && mypy . && cd ..
cd frontend && npm run build  # TypeScript check
```

### Database Migrations

```bash
# Create migration
cd backend
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test
pytest tests/test_main.py

# Run in watch mode (install pytest-watch)
ptw
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

---

## Common Commands

### Makefile Commands

```bash
make help          # Show all commands
make up            # Start Docker services
make down          # Stop Docker services
make logs          # View all logs
make test          # Run all tests
make lint          # Run linters
make format        # Format code
make migrate       # Run migrations
make clean         # Clean Docker volumes
```

### Backend Commands

```bash
# Development server
uvicorn app.main:app --reload

# With specific host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run tests
pytest
pytest --cov
pytest -v

# Format and lint
black .
ruff check .
mypy .
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build
npm run start

# Run tests
npm test
npm run test:watch

# Format and lint
npm run format
npm run lint
```

---

## Troubleshooting

### Conda Environment Issues

**Problem**: `conda: command not found`

**Solution**:
```bash
# Add conda to PATH (bash)
export PATH="$HOME/miniconda3/bin:$PATH"

# Or reinitialize conda
conda init bash
source ~/.bashrc
```

**Problem**: Wrong Python version in conda env

**Solution**:
```bash
conda deactivate
conda env remove -n seshio
conda create -n seshio python=3.11 -y
conda activate seshio
```

### Docker Issues

**Problem**: Port already in use

**Solution**:
```bash
# Find process using port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Stop conflicting service or change port in docker-compose.yml
```

**Problem**: Docker containers won't start

**Solution**:
```bash
# Clean Docker system
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up -d --build postgres redis
```

### Database Issues

**Problem**: Can't connect to database

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify DATABASE_URL in backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/seshio
```

**Problem**: Migration fails

**Solution**:
```bash
# Check current migration version
cd backend
alembic current

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d postgres
alembic upgrade head
```

### Backend Issues

**Problem**: Module not found

**Solution**:
```bash
# Ensure conda environment is activated
conda activate seshio

# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

**Problem**: Import errors

**Solution**:
```bash
# Run from backend directory
cd backend
python -m pytest  # Instead of just pytest
```

### Frontend Issues

**Problem**: Module not found

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Build fails

**Solution**:
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

### API Connection Issues

**Problem**: Frontend can't connect to backend

**Solution**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Check CORS settings in `backend/.env`

---

## Project Structure

```
seshio/
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database setup
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── tasks/       # Celery tasks
│   ├── alembic/         # Database migrations
│   ├── tests/           # Backend tests
│   └── requirements.txt
│
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── package.json
│
├── docs/                # Documentation
├── scripts/             # Setup scripts
└── docker-compose.yml   # Docker configuration
```

---

## Next Steps

After successful setup:

1. Review the [Requirements](docs/requirements.md)
2. Check the [Design Document](docs/design.md)
3. Start implementing [Tasks](docs/tasks.md)
4. Explore the [API Documentation](http://localhost:8000/docs)

---

## Useful Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Supabase Dashboard: https://supabase.com/dashboard
- Google AI Studio: https://makersuite.google.com

---

## Getting Help

- Check error logs carefully
- Review this guide's troubleshooting section
- Search for similar issues in the repository
- Ask for help in the team chat
