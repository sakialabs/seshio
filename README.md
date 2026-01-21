# 📒 Seshio
**Where your notes finally click.**

Seshio is an AI-powered learning platform that helps you make sense of what you're learning through grounded, retrieval-augmented conversations and active study practice.

Upload your materials, ask questions, and build understanding. Notes, summaries, quizzes, and study sessions emerge naturally from the process.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 20+](https://img.shields.io/badge/node-20+-green.svg)](https://nodejs.org/)

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [📌 Project Status](#-project-status)
- [🚀 Quick Start](#-quick-start)
- [🧱 Tech Stack](#-tech-stack)
- [📚 Documentation](#-documentation)
- [💻 Development](#-development)
- [🧠 Philosophy](#-philosophy)
- [🔬 Research & ML](#-research--ml)
- [👥 Who This Is For](#-who-this-is-for)
- [🤝 Contributing](#-contributing)
- [⚖️ License](#️-license)
- [🛟 Support](#-support)

---

## ✨ Features

- **📚 Grounded Conversations** - Ask questions with AI responses grounded in your uploaded materials
- **📁 Material Management** - Upload and organize PDFs, text files, and documents in notebooks
- **🎯 Study Mode** - Practice with AI-generated quizzes based on your materials
- **✍️ Content Generation** - Generate summaries, outlines, and flashcards from your materials
- **🔒 Privacy-First** - Your data is encrypted and never shared with third parties
- **� ML Experimentation** - Built-in framework for testing retrieval and learning strategies

---

## 📌 Project Status

**Current Phase**: Phase 1 Complete - Foundation and Infrastructure ✅

Phase 1 (authentication, database, and onboarding) is complete. Now beginning Phase 2 (notebook management).

**Progress Tracking:**
- [📋 CHANGELOG.md](docs/CHANGELOG.md) - Completed tasks and version history
- [📝 tasks.md](docs/tasks.md) - Full implementation roadmap
- [🗺️ roadmap.md](docs/roadmap.md) - High-level milestones

---

## 🚀 Quick Start

### 🔒 Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.11+ (Conda recommended)
- **Docker** and Docker Compose
- **Supabase Account** (for authentication and storage)
- **Google AI Studio Account** (for Gemini API key)

### 📦 Installation

```bash
# 1. Clone and setup
git clone https://github.com/sakialabs/seshio
cd seshio

# 2. Create conda environment
conda create -n seshio python=3.11 -y
conda activate seshio

# 3. Install dependencies
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..

# 4. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit both files with your Supabase and Gemini credentials

# 5. Start services
docker-compose up -d postgres redis

# 6. Run migrations
cd backend && alembic upgrade head && cd ..

# 7. Start development servers
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

For detailed setup instructions, see [docs/setup.md](docs/setup.md).

---

## 🧱 Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase Client

**Backend:** FastAPI, PostgreSQL + pgvector, SQLAlchemy, Alembic, Celery, Redis, Supabase, Gemini AI

**Infrastructure:** Docker, Docker Compose, Conda

---

## 📚 Documentation

- **[Setup Guide](docs/setup.md)** - Detailed installation and configuration
- **[Testing Guide](docs/testing.md)** - Running tests and writing new ones
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to Seshio
- **[Vision & Mission](docs/vision.md)** - What Seshio is and why it exists
- **[Design Document](docs/design.md)** - System architecture and technical decisions
- **[Requirements](docs/requirements.md)** - Functional and non-functional requirements
- **[Tasks](docs/tasks.md)** - Implementation plan and progress
- **[Roadmap](docs/roadmap.md)** - High-level development timeline
- **[Changelog](docs/CHANGELOG.md)** - Version history and completed work

---

## 💻 Development

### 📜 Common Commands

```bash
# Start all services with Docker
docker-compose --profile full up -d

# Start only database services
docker-compose up -d postgres redis

# View logs
docker-compose logs -f

# Run tests
cd backend && pytest --cov
cd frontend && npm test

# Format code
cd backend && black . && ruff check .
cd frontend && npm run format && npm run lint

# Database migrations
cd backend && alembic upgrade head
```

### 📂 Project Structure

```plaintext
seshio/
├── frontend/           # Next.js frontend
│   ├── src/app/        # App router pages
│   ├── src/components/ # React components
│   └── src/lib/        # Utilities and API clients
├── backend/            # FastAPI backend
│   ├── app/api/        # API routes
│   ├── app/models/     # Database models
│   ├── app/services/   # Business logic
│   └── tests/          # Test suite
├── docs/               # Documentation
└── docker-compose.yml  # Docker configuration
```

---

## 🧩 Philosophy

Seshio is built on these core principles:

- **Clarity over complexity** - If it's confusing, it's wrong
- **Grounded by default** - Answers come from your materials, not guesses
- **Support, not pressure** - No guilt, no hustle culture, just help when needed
- **Small sessions win** - Progress compounds through consistency, not intensity
- **Human-first intelligence** - AI assists learning, never replaces the learner

Read more in [docs/vision.md](docs/vision.md).

---

## 🔬 Research & ML

Seshio is designed as both a learning platform and an applied ML research project. We explore:

- Retrieval-augmented generation (RAG)
- Hybrid retrieval (semantic + lexical)
- Study quality evaluation
- Adaptive quiz generation
- Feedback-driven model improvement

All experiments focus on measurable improvements to understanding and recall, not metrics alone.

Learn more in the [Research & Experiments](docs/vision.md#research--experiments) section.

---

## 👀 Who This Is For

- Students who want to understand, not just cram
- Learners managing complex material
- Builders exploring applied ML in education
- Anyone interested in retrieval, evaluation, and learning systems

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Read the [Contributing Guide](CONTRIBUTING.md)
2. Check the [issue tracker](https://github.com/sakialabs/seshio/issues) for tasks
3. Look for issues labeled `good first issue` or `help wanted`
4. Fork the repo, make changes, and submit a PR

**Before submitting:**
- Run tests: `pytest` (backend) and `npm test` (frontend)
- Format code: `black .` (backend) and `npm run format` (frontend)
- Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## ⚖️ License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🛟 Support

- **Issues**: [GitHub Issues](https://github.com/sakialabs/seshio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sakialabs/seshio/discussions)
- **Documentation**: [docs/](docs/)

---

Built with 💖 for learners everywhere.
