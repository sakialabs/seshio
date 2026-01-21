# Seshio MVP Setup Script (PowerShell)
# This script helps set up the development environment on Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Seshio MVP Setup Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop from https://docker.com/" -ForegroundColor Red
    exit 1
}

# Check Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Ask about Python environment preference
Write-Host "🐍 Python Environment Setup" -ForegroundColor Yellow
Write-Host "Choose your preferred Python environment:"
Write-Host "1) Conda (recommended for data science/ML work)"
Write-Host "2) venv (standard Python virtual environment)"
Write-Host ""
$pythonChoice = Read-Host "Enter choice (1 or 2)"

if ($pythonChoice -eq "1") {
    # Conda setup
    try {
        $condaVersion = conda --version
        Write-Host "✅ $condaVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Conda is not installed. Please install Miniconda or Anaconda from:" -ForegroundColor Red
        Write-Host "   https://docs.conda.io/en/latest/miniconda.html" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "📦 Creating conda environment 'seshio'..." -ForegroundColor Yellow
    conda create -n seshio python=3.11 -y
    Write-Host "✅ Conda environment created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  To activate: conda activate seshio" -ForegroundColor Yellow
    Write-Host "⚠️  Then run: cd backend && pip install -r requirements.txt" -ForegroundColor Yellow
    $pythonEnv = "conda"
    
} elseif ($pythonChoice -eq "2") {
    # venv setup
    try {
        $pythonVersion = python --version
        Write-Host "✅ $pythonVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Python is not installed. Please install Python 3.11+ from https://python.org/" -ForegroundColor Red
        exit 1
    }
    $pythonEnv = "venv"
} else {
    Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All prerequisites are installed!" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "📝 Setting up environment files..." -ForegroundColor Yellow

# Frontend
if (-not (Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\.env.local.example" "frontend\.env.local"
    Write-Host "✅ Created frontend\.env.local" -ForegroundColor Green
    Write-Host "⚠️  Please edit frontend\.env.local with your Supabase credentials" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  frontend\.env.local already exists" -ForegroundColor Cyan
}

# Backend
if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend\.env with your credentials" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  backend\.env already exists" -ForegroundColor Cyan
}

Write-Host ""

# Ask if user wants to install dependencies
$installDeps = Read-Host "📦 Install dependencies now? (y/n)"
if ($installDeps -eq "y" -or $installDeps -eq "Y") {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    
    if ($pythonEnv -eq "venv") {
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        python -m venv venv
        .\venv\Scripts\Activate.ps1
        pip install -r requirements.txt
        deactivate
        Set-Location ..
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  For backend dependencies, activate conda environment first:" -ForegroundColor Yellow
        Write-Host "   conda activate seshio" -ForegroundColor Yellow
        Write-Host "   cd backend && pip install -r requirements.txt" -ForegroundColor Yellow
    }
}

Write-Host ""

# Ask if user wants to start Docker services
$startDocker = Read-Host "🐳 Start Docker services? (y/n)"
if ($startDocker -eq "y" -or $startDocker -eq "Y") {
    Write-Host ""
    Write-Host "Choose Docker mode:" -ForegroundColor Yellow
    Write-Host "1) All services (postgres, redis, backend, frontend)"
    Write-Host "2) Database only (postgres, redis) - run backend/frontend locally"
    Write-Host ""
    $dockerMode = Read-Host "Enter choice (1 or 2)"
    
    if ($dockerMode -eq "1") {
        Write-Host "Starting all services..." -ForegroundColor Yellow
        docker-compose --profile full up -d
        Write-Host "✅ All services started" -ForegroundColor Green
    } elseif ($dockerMode -eq "2") {
        Write-Host "Starting database services..." -ForegroundColor Yellow
        docker-compose up -d postgres redis
        Write-Host "✅ Database services started" -ForegroundColor Green
    } else {
        Write-Host "❌ Invalid choice. Skipping Docker startup." -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit frontend\.env.local with your Supabase credentials"
Write-Host "2. Edit backend\.env with your Supabase and Gemini API credentials"
Write-Host ""

if ($pythonEnv -eq "conda") {
    Write-Host "3. Activate conda environment:" -ForegroundColor Cyan
    Write-Host "   conda activate seshio"
    Write-Host "4. Install backend dependencies:" -ForegroundColor Cyan
    Write-Host "   cd backend && pip install -r requirements.txt"
    Write-Host "5. Run database migrations:" -ForegroundColor Cyan
    Write-Host "   cd backend && alembic upgrade head"
    Write-Host "6. Start development servers:" -ForegroundColor Cyan
    Write-Host "   Terminal 1: cd backend && uvicorn app.main:app --reload"
    Write-Host "   Terminal 2: cd frontend && npm run dev"
} else {
    Write-Host "3. Activate virtual environment:" -ForegroundColor Cyan
    Write-Host "   backend\venv\Scripts\Activate.ps1"
    Write-Host "4. Run database migrations:" -ForegroundColor Cyan
    Write-Host "   cd backend && alembic upgrade head"
    Write-Host "5. Start development servers:" -ForegroundColor Cyan
    Write-Host "   Terminal 1: cd backend && uvicorn app.main:app --reload"
    Write-Host "   Terminal 2: cd frontend && npm run dev"
}

Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000"
Write-Host "   - Backend API: http://localhost:8000"
Write-Host "   - API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "For detailed setup instructions, see docs\setup.md"
