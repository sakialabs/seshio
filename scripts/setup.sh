#!/bin/bash

# Seshio MVP Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Seshio MVP Setup Script"
echo "=========================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm --version)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop from https://docker.com/"
    exit 1
fi
echo "✅ Docker $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi
echo "✅ Docker Compose $(docker-compose --version)"

echo ""

# Ask about Python environment preference
echo "🐍 Python Environment Setup"
echo "Choose your preferred Python environment:"
echo "1) Conda (recommended for data science/ML work)"
echo "2) venv (standard Python virtual environment)"
echo ""
read -p "Enter choice (1 or 2): " python_choice

if [ "$python_choice" = "1" ]; then
    # Conda setup
    if ! command -v conda &> /dev/null; then
        echo "❌ Conda is not installed. Please install Miniconda or Anaconda from:"
        echo "   https://docs.conda.io/en/latest/miniconda.html"
        exit 1
    fi
    echo "✅ Conda $(conda --version)"
    
    echo ""
    echo "📦 Creating conda environment 'seshio'..."
    conda create -n seshio python=3.11 -y
    echo "✅ Conda environment created"
    echo ""
    echo "⚠️  To activate: conda activate seshio"
    echo "⚠️  Then run: cd backend && pip install -r requirements.txt"
    PYTHON_ENV="conda"
    
elif [ "$python_choice" = "2" ]; then
    # venv setup
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ from https://python.org/"
        exit 1
    fi
    echo "✅ Python $(python3 --version)"
    PYTHON_ENV="venv"
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✅ All prerequisites are installed!"
echo ""

# Setup environment files
echo "📝 Setting up environment files..."

# Frontend
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
    echo "⚠️  Please edit frontend/.env.local with your Supabase credentials"
else
    echo "ℹ️  frontend/.env.local already exists"
fi

# Backend
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env with your credentials"
else
    echo "ℹ️  backend/.env already exists"
fi

echo ""

# Ask if user wants to install dependencies
read -p "📦 Install dependencies now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed"
    
    if [ "$PYTHON_ENV" = "venv" ]; then
        echo "Installing backend dependencies..."
        cd backend
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        deactivate
        cd ..
        echo "✅ Backend dependencies installed"
    else
        echo ""
        echo "⚠️  For backend dependencies, activate conda environment first:"
        echo "   conda activate seshio"
        echo "   cd backend && pip install -r requirements.txt"
    fi
fi

echo ""

# Ask if user wants to start Docker services
read -p "🐳 Start Docker services (PostgreSQL + Redis)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting Docker services..."
    docker-compose up -d postgres redis
    echo "✅ Docker services started"
    echo ""
    echo "Waiting for services to be ready..."
    sleep 5
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit frontend/.env.local with your Supabase credentials"
echo "2. Edit backend/.env with your Supabase and Gemini API credentials"
echo ""

if [ "$PYTHON_ENV" = "conda" ]; then
    echo "3. Activate conda environment:"
    echo "   conda activate seshio"
    echo "4. Install backend dependencies:"
    echo "   cd backend && pip install -r requirements.txt"
    echo "5. Run database migrations:"
    echo "   cd backend && alembic upgrade head"
    echo "6. Start development servers:"
    echo "   Terminal 1: cd backend && uvicorn app.main:app --reload"
    echo "   Terminal 2: cd frontend && npm run dev"
else
    echo "3. Activate virtual environment:"
    echo "   source backend/venv/bin/activate"
    echo "4. Run database migrations:"
    echo "   cd backend && alembic upgrade head"
    echo "5. Start development servers:"
    echo "   Terminal 1: cd backend && uvicorn app.main:app --reload"
    echo "   Terminal 2: cd frontend && npm run dev"
fi

echo ""
echo "Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "For detailed setup instructions, see docs/setup.md"
