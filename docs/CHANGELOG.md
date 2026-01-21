# Changelog

All notable changes to Seshio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Phase 1: Foundation and Infrastructure (In Progress)

#### Completed

**Task 1: Project Structure and Development Environment** ✅
- Created Next.js 15 frontend with TypeScript, Tailwind CSS, and shadcn/ui
- Created FastAPI backend with Python 3.11+
- Set up Docker Compose with profiles (default: DB only, full: all services)
- Configured conda environment `seshio` for Python development
- Updated setup scripts (bash and PowerShell) to support conda and venv
- Set up linting (ESLint, Prettier, Black, Ruff, mypy)
- Set up testing (Jest + fast-check for frontend, pytest + Hypothesis for backend)
- Created environment variable templates
- Configured Makefile with commands: `up` (all services), `up-db` (database only)
- Created comprehensive setup documentation
- Single docker-compose.yml with profiles for clean configuration

**Task 2: Database Schema and Migrations** ✅
- Installed pgvector extension (v0.5.1) in PostgreSQL
- Created SQLAlchemy models for all tables:
  - User model with archetype enum (structured, deep_worker, explorer)
  - Notebook model with user relationship
  - Material model with processing status enum
  - Chunk model with vector embeddings (768 dimensions for Gemini)
  - Conversation and Message models with role enum
  - StudySession, StudyQuestion, StudyResponse models with question types
  - Experiment and ExperimentEvent models for ML tracking
- Created initial Alembic migration (001_initial_schema.py)
- Configured indexes:
  - Standard indexes on foreign keys and frequently queried columns
  - Vector similarity index (IVFFlat) on chunk embeddings
- Set up CASCADE delete for all foreign key relationships
- All models follow design document specifications

**Task 3.1: Set up Supabase Project and Configure Auth** ✅
- Created Supabase project
- Configured authentication providers (email/password)
- Set up password complexity requirements
- Requirements: 1.1, 1.2, 13.3

**Task 3.2: Implement Backend Auth Service** ✅
- Created JWT token validation middleware
- Implemented session management
- Created authorization helpers (check notebook ownership)
- Requirements: 1.2, 1.4, 13.4

**Task 3.3: Implement Frontend Authentication Flow** ✅
- Created login/signup UI components
- Implemented authentication state management (React Context)
- Handled session persistence and restoration
- Implemented logout functionality
- Requirements: 1.1, 1.2, 1.4, 1.5

**Task 4.1: Create Onboarding UI** ✅
- Designed onboarding question screen
- Created archetype selection component (3 options)
- Implemented navigation to main app after selection
- Requirements: 2.1, 2.2, 2.4

**Task 4.2: Store Archetype Preference** ✅
- Created API endpoint to store archetype
- Updated user record with archetype
- Applied archetype-based defaults (notebook organization, language)
- Requirements: 2.3, 2.5

**Task 5: Checkpoint - Authentication and Onboarding Complete** ✅
- All Phase 1 core tasks completed
- Authentication flow working end-to-end
- Onboarding flow functional
- Ready for Phase 2: Notebook Management

**Infrastructure:**
- ✅ Conda environment: `seshio` with Python 3.11
- ✅ Docker services: PostgreSQL + Redis running
- ✅ Docker profiles: Use `--profile full` for all services
- ✅ Frontend: Next.js 15 with hot reload
- ✅ Backend: FastAPI with hot reload
- ✅ Database: PostgreSQL 15 with pgvector 0.5.1
- ✅ Task queue: Redis for Celery
- ✅ Database schema: All tables defined and ready
- ✅ Supabase Auth: Configured and integrated
- ✅ Authentication: Login, signup, logout working
- ✅ Onboarding: Archetype selection implemented

### Phase 2: Notebook Management (In Progress)

#### Completed

**Task 6.1: Create Backend Notebook Service** ✅
- Created notebook schemas (NotebookCreateRequest, NotebookUpdateRequest, NotebookResponse, NotebookListResponse)
- Implemented NotebookService with full CRUD operations:
  - `create_notebook`: Create notebook with name validation
  - `list_notebooks`: List all user notebooks ordered by creation date
  - `get_notebook`: Get notebook by ID with ownership verification
  - `update_notebook`: Update notebook name with validation
  - `delete_notebook`: Delete notebook with cascade (removes all materials, chunks, conversations)
  - `get_notebook_with_counts`: Get notebook with material and message counts
- Created API endpoints at `/api/notebooks`:
  - POST `/api/notebooks` - Create notebook
  - GET `/api/notebooks` - List all user notebooks
  - GET `/api/notebooks/{id}` - Get specific notebook with counts
  - PATCH `/api/notebooks/{id}` - Update notebook name
  - DELETE `/api/notebooks/{id}` - Delete notebook and all associated data
- Enforced user ownership on all operations (Requirements 13.4)
- Registered notebook router in main application
- Requirements: 3.1, 3.3, 3.5

**Task 6.2: Create Frontend Notebook UI** ✅
- Created notebook API client (`frontend/src/lib/api/notebooks.ts`) with type-safe operations
- Implemented NotebookDialog component:
  - Reusable modal for create/edit operations
  - Name validation (non-empty, max 255 chars)
  - Loading states and error handling
  - Accessible keyboard navigation
- Implemented NotebookList component:
  - Responsive grid layout (1-3 columns based on screen size)
  - Hover actions for edit and delete
  - Delete confirmation dialog
  - Empty state with helpful messaging
  - Smooth animations and transitions
  - Material and message count display
- Updated notebooks page (`/notebooks`):
  - Full CRUD interface with create button
  - List view with real-time updates
  - Error state handling
  - Navigation to individual notebooks
- Created individual notebook page (`/notebooks/[id]`):
  - Placeholder for future chat interface
  - Back navigation to notebook list
  - Notebook name display in header
- Requirements: 3.1, 3.3, 3.4, 3.5

**Task 7.1: Create Notebook Context UI** ✅
- Created MaterialList component:
  - Displays all materials in a notebook
  - Shows filename, size, and upload date
  - Material deletion with confirmation
  - Empty state messaging
  - Responsive layout
- Created ConversationHistory component:
  - Displays all conversations chronologically
  - Shows user and assistant messages
  - Expandable message content
  - Empty state for new notebooks
- Created NotebookSearch component:
  - Search within notebook materials and conversations
  - Real-time search results
  - Keyboard navigation support
- Created NotebookContext component:
  - Tabbed interface (Materials, Conversations, Search)
  - Navigation between chat and context views
  - Integrated all sub-components
- Requirements: 11.1, 11.2, 11.3, 11.6

**Task 7.2: Implement Material and Conversation Retrieval** ✅
- Created API endpoints:
  - GET `/api/notebooks/{id}/materials` - List all materials in notebook
  - GET `/api/notebooks/{id}/conversations` - Get conversation history
  - GET `/api/notebooks/{id}/search?q={query}` - Search notebook content
- Implemented MaterialService:
  - `list_materials`: Get all materials for a notebook
  - `delete_material`: Remove material and associated chunks
- Implemented ConversationService:
  - `get_conversations`: Retrieve conversation history with messages
  - `search_notebook`: Full-text search across materials and messages
- All endpoints enforce user ownership
- Requirements: 11.1, 11.2, 11.3

**Task 8: Checkpoint - Notebook Management Complete** ✅
- All Phase 2 core tasks completed
- Backend tests passing (5/5)
- No diagnostics or errors in notebook-related files
- Notebook CRUD operations fully functional
- Notebook context view implemented
- UI enhancements: loading skeletons and smooth modal transitions
- Professional 404 page with context-aware navigation
- Ready for Phase 3: Material Upload and Processing

**Bug Fixes:**
- Fixed forward reference issue in auth schemas (moved UserResponse before AuthResponse)
- Fixed SQLAlchemy reserved name conflict in Chunk model (`metadata` → `chunk_metadata`)
- Updated test configuration to properly handle environment variables
- All backend tests passing

### Phase 3: Material Upload and Processing ✅

#### Completed

**Task 9: Implement File Upload to Supabase Storage** ✅
- **Task 9.1: Set up Supabase Storage bucket** ✅
  - Created storage bucket configuration scripts (`setup_storage.py`, `setup_storage.sql`)
  - Configured bucket with 50MB file size limit
  - Set allowed MIME types (PDF, txt, md, docx)
  - Implemented Row Level Security (RLS) policies for user data isolation
  - File organization by user ID: `materials/{user_id}/{material_id}.{ext}`
  - Requirements: 4.1, 13.1
- **Task 9.2: Create frontend upload UI** ✅
  - Created MaterialUpload component with drag-and-drop support
  - Implemented file type validation (PDF, txt, md, docx)
  - Added upload progress tracking with visual indicators
  - Implemented processing status polling (checks every 2 seconds, max 2 minutes)
  - Error handling with user-friendly messages
  - Responsive UI with loading states and animations
  - Requirements: 4.1, 4.2, 4.9
- **Task 9.3: Implement upload API endpoint** ✅
  - Created POST `/api/notebooks/{id}/materials` endpoint
  - Implemented two-step upload process:
    1. Frontend uploads file to Supabase Storage
    2. Backend creates material record with metadata
  - File metadata validation (size, type, filename)
  - Material record creation with "pending" status
  - User ownership verification via notebook access
  - Created MaterialService with CRUD operations
  - Created material schemas (MaterialUploadRequest, MaterialUploadResponse, MaterialStatusResponse)
  - Requirements: 4.1, 4.2, 4.3
- **Storage Infrastructure:**
  - ✅ Supabase Storage bucket: `materials`
  - ✅ File size limit: 50MB (52,428,800 bytes)
  - ✅ Allowed types: PDF, TXT, MD, DOCX
  - ✅ Access control: Authenticated users only
  - ✅ User isolation: RLS policies enforce folder-level access
  - ✅ Encryption: At rest (Supabase default) and in transit (TLS)

**Task 10: Implement Material Processing Pipeline** ✅
- **Task 10.1: Create text extraction service** ✅
  - Implemented TextExtractionService (`app/services/text_extraction.py`)
  - PDF text extraction using PyPDF2
  - DOCX text extraction using python-docx
  - Plain text and Markdown support
  - Page number preservation for PDFs
  - Multiple encoding support (UTF-8, Latin-1, etc.)
  - Graceful error handling with custom exceptions
  - Metadata extraction (page count, format, encoding)
  - Requirements: 4.4
- **Task 10.2: Implement text chunking** ✅
  - Implemented TextChunkingService (`app/services/text_chunking.py`)
  - Token-based chunking using tiktoken (cl100k_base encoding)
  - Configurable chunk size: 500-1000 tokens
  - Overlap: 100 tokens between chunks
  - Metadata preservation (page numbers, section headers)
  - Smart chunk boundary detection
  - TextChunk dataclass for structured chunk data
  - Requirements: 4.5
- **Task 10.3: Integrate Gemini embedding API** ✅
  - Implemented EmbeddingService (`app/services/embedding.py`)
  - Gemini embedding-001 model integration
  - 768-dimensional embeddings
  - Batch processing (100 texts per batch)
  - Automatic retry with exponential backoff (3 attempts)
  - Separate embeddings for documents vs queries
  - Rate limiting and error handling
  - Comprehensive logging
  - Requirements: 4.6, 4.7
- **Task 10.4: Create background processing worker** ✅
  - Implemented Celery task (`app/tasks/material_processing.py`)
  - Redis broker and backend configuration
  - MaterialProcessingTask with automatic retry
  - Complete pipeline orchestration:
    1. Download file from Supabase Storage
    2. Extract text from file
    3. Chunk text into segments
    4. Generate embeddings for all chunks
    5. Store chunks and embeddings in database
    6. Update material status
  - Error handling for each pipeline stage
  - Status updates (pending → processing → completed/failed)
  - Detailed logging at each step
  - Requirements: 4.4, 4.5, 4.6, 4.7, 4.8
- **Task 10.5: Create processing status polling endpoint** ✅
  - Created GET `/api/materials/{material_id}/status` endpoint
  - Returns material processing status and metadata
  - Frontend polling integration (2-second intervals)
  - User ownership verification
  - Requirements: 4.9
- **Processing Infrastructure:**
  - ✅ Celery worker with Redis broker
  - ✅ Task timeout: 30 minutes
  - ✅ Retry logic: 3 attempts with exponential backoff
  - ✅ Batch embedding generation (100 texts per batch)
  - ✅ Comprehensive error handling and logging
  - ✅ Status tracking: pending → processing → completed/failed

**Task 11: Checkpoint - Material Upload and Processing Complete** ✅
- All Phase 3 core tasks completed
- Backend tests passing (15/15 tests, 100% success rate)
- Text extraction tests: 4/4 passing
- Text chunking tests: 6/6 passing
- Notebook tests: 3/3 passing
- Main API tests: 2/2 passing
- No diagnostics or errors in material processing files
- Complete pipeline functional:
  - File upload with drag-and-drop UI
  - Text extraction from PDF, DOCX, TXT, MD
  - Token-based chunking with overlap
  - Embedding generation via Gemini API
  - Background processing with Celery
  - Status polling and progress tracking
- Documentation complete (`MATERIAL_PROCESSING.md`)
- Ready for Phase 4: Retrieval and Question Answering

**Testing:**
- ✅ Unit tests for text extraction (empty files, unsupported formats, encoding)
- ✅ Unit tests for text chunking (short text, long text, overlap, page markers)
- ✅ Integration with Celery worker
- ✅ End-to-end upload and processing flow verified

#### Upcoming Optional Tasks

**Task 9.4: Write Property Tests for File Upload** (Optional)
- Property 11: File upload and storage round-trip

**Task 10.6: Write Property Tests for Material Processing** (Optional)
- Property 12: Text extraction produces content
- Property 13: Chunking produces retrievable segments
- Property 14: Embedding generation for all chunks
- Property 15: Material processing round-trip
- Property 16: Processing failure maintains state

---

## Project Phases

Based on `docs/tasks.md` and `docs/roadmap.md`:

### Phase 1: Foundation and Infrastructure ✅
- Task 1: Project setup ✅
- Task 2: Database schema ✅
- Task 3: Supabase Auth ✅
- Task 4: Onboarding flow ✅
- Task 5: Checkpoint ✅

### Phase 2: Notebook Management ✅
- Task 6: Notebook CRUD operations ✅
- Task 7: Notebook context view ✅
- Task 8: Checkpoint ✅

### Phase 3: Material Upload and Processing ✅
- Task 9: File upload to Supabase Storage ✅
- Task 10: Material processing pipeline ✅
- Task 11: Checkpoint ✅

### Phase 4: Retrieval and Question Answering (Next)
- Task 12: Hybrid retrieval engine
- Task 13: Answer generation service
- Task 14: Chat UI
- Task 15: Query caching
- Task 16: Checkpoint

### Phase 5: Content Generation
- Task 17: Content generation features
- Task 18: Checkpoint

### Phase 6: Study Mode
- Task 19: Quiz generation
- Task 20: Answer evaluation and feedback
- Task 21: Study Mode UI
- Task 22: Checkpoint

### Phase 7: ML Experimentation Infrastructure
- Task 23: Experiment framework
- Task 24: Checkpoint

### Phase 8: Performance, Security, and Polish
- Task 25: Performance optimizations
- Task 26: Security measures
- Task 27: Error handling
- Task 28: Cost monitoring
- Task 29: Checkpoint

### Phase 9: Mobile Responsiveness and Accessibility
- Task 30: Mobile responsiveness
- Task 31: Accessibility features
- Task 32: Checkpoint

### Phase 10: Integration Testing and Deployment
- Task 33: Integration tests
- Task 34: CI/CD pipeline
- Task 35: Deploy MVP to staging
- Task 36: Final checkpoint - MVP complete

---

## Version History

### [0.1.0] - 2025-01-20

#### Added
- Initial project structure
- Conda environment setup
- Docker Compose configuration
- Next.js frontend foundation
- FastAPI backend foundation
- Development tooling and documentation

#### Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 3.4
- **Backend**: FastAPI 0.109, Python 3.11, SQLAlchemy 2.0, Alembic 1.13
- **Database**: PostgreSQL 15 with pgvector
- **Cache/Queue**: Redis 7
- **Testing**: Jest + fast-check (frontend), pytest + Hypothesis (backend)
- **Code Quality**: ESLint, Prettier, Black, Ruff, mypy

---

## Notes

- This changelog tracks implementation progress against the task list in `docs/tasks.md`
- Each phase aligns with the roadmap in `docs/roadmap.md`
- Task completion is marked with ✅
- Current work is marked with (In Progress)
- Optional tasks (marked with * in tasks.md) are not required for phase completion

---

## References

- **Tasks**: `docs/tasks.md`
- **Requirements**: `docs/requirements.md`
- **Design**: `docs/design.md`
- **Roadmap**: `docs/roadmap.md`
- **Setup Guide**: `docs/setup.md`
