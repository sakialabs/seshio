.PHONY: help setup conda-create conda-install up up-db down logs clean test lint format migrate

help: ## Show this help message
	@echo "Seshio MVP - Available Commands"
	@echo "================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

conda-create: ## Create conda environment
	@echo "Creating conda environment 'seshio'..."
	conda create -n seshio python=3.11 -y
	@echo "✓ Conda environment created!"
	@echo "Activate with: conda activate seshio"

conda-install: ## Install dependencies in conda environment (requires activated conda env)
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✓ All dependencies installed!"

setup: conda-create ## Run complete setup (creates conda env)
	@echo "✓ Conda environment created!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Activate conda environment: conda activate seshio"
	@echo "2. Install dependencies: make conda-install"
	@echo "3. Configure environment variables:"
	@echo "   cp backend/.env.example backend/.env"
	@echo "   cp frontend/.env.local.example frontend/.env.local"
	@echo "4. Start services: make up (all) or make up-db (database only)"
	@echo "5. Run migrations: make migrate-local"

up: ## Start all services (postgres, redis, backend, frontend)
	@echo "Starting all services..."
	docker-compose --profile full up -d
	@echo "✓ All services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "PostgreSQL: localhost:5432"
	@echo "Redis: localhost:6379"

up-db: ## Start only database services (postgres + redis)
	@echo "Starting database services only..."
	docker-compose up -d postgres redis
	@echo "✓ Database services started!"
	@echo "PostgreSQL: localhost:5432"
	@echo "Redis: localhost:6379"
	@echo ""
	@echo "Run backend and frontend locally:"
	@echo "  Terminal 1: make dev-backend"
	@echo "  Terminal 2: make dev-frontend"

down: ## Stop all services
	@echo "Stopping services..."
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-postgres: ## View PostgreSQL logs
	docker-compose logs -f postgres

logs-redis: ## View Redis logs
	docker-compose logs -f redis

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

clean: ## Stop services and remove volumes
	@echo "Cleaning up..."
	docker-compose down -v
	@echo "Cleanup complete!"

restart: ## Restart all services
	@echo "Restarting services..."
	docker-compose restart

rebuild: ## Rebuild and restart all services
	@echo "Rebuilding services..."
	docker-compose --profile full up -d --build

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && pytest
	@echo "Running frontend tests..."
	cd frontend && npm test

test-backend: ## Run backend tests
	cd backend && pytest

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint: ## Run linters
	@echo "Linting backend..."
	cd backend && ruff check .
	@echo "Linting frontend..."
	cd frontend && npm run lint

format: ## Format code
	@echo "Formatting backend..."
	cd backend && black .
	@echo "Formatting frontend..."
	cd frontend && npm run format

migrate-local: ## Run database migrations (local conda env)
	@echo "Running migrations..."
	cd backend && alembic upgrade head

migrate-create: ## Create a new migration (local conda env)
	@echo "Creating migration..."
	cd backend && alembic revision --autogenerate -m "$(MSG)"

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d seshio

shell-redis: ## Open Redis CLI
	docker-compose exec redis redis-cli

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies (requires activated conda env)
	cd backend && pip install -r requirements.txt

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

dev-backend: ## Run backend in development mode (requires activated conda env)
	cd backend && uvicorn app.main:app --reload

health: ## Check health of services
	@echo "Checking service health..."
	@curl -s http://localhost:8000/health && echo "Backend: OK" || echo "Backend: Not responding"
	@curl -s http://localhost:3000 > /dev/null && echo "Frontend: OK" || echo "Frontend: Not responding"
	@docker-compose exec postgres pg_isready -U postgres && echo "PostgreSQL: OK" || echo "PostgreSQL: Not responding"
	@docker-compose exec redis redis-cli ping > /dev/null && echo "Redis: OK" || echo "Redis: Not responding"

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "⚠️  WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker-compose up -d postgres redis; \
		sleep 3; \
		cd backend && alembic upgrade head; \
		echo "✓ Database reset complete!"; \
	fi
