# Implementation Plan: Seshio MVP

## Overview

This implementation plan breaks down the Seshio MVP into phased, incremental tasks. The approach prioritizes:
1. Core infrastructure and authentication
2. Material upload and processing pipeline
3. Retrieval and question answering
4. Study Mode
5. Polish and optimization

Each task builds on previous work, with checkpoints to ensure stability. Testing tasks are marked as optional (*) to enable faster MVP iteration while maintaining quality through core property tests.

## Tasks

### Phase 1: Foundation and Infrastructure

- [x] 1. Set up project structure and development environment
  - Create Next.js frontend project with TypeScript, Tailwind CSS, shadcn/ui
  - Create FastAPI backend project with Python 3.11+
  - Set up Docker Compose for local development (PostgreSQL, Supabase local)
  - Configure environment variables and secrets management
  - Set up linting (ESLint, Black, mypy) and formatting (Prettier, Black)
  - Create README with setup instructions
  - _Requirements: Infrastructure setup_

- [x] 2. Set up database schema and migrations
  - Install pgvector extension for PostgreSQL
  - Create database migration tool setup (Alembic)
  - Define schema for users, notebooks, materials, chunks, conversations, messages
  - Define schema for study_sessions, study_questions, study_responses
  - Define schema for experiments, experiment_events
  - Create initial migration
  - _Requirements: Database design_

- [-] 3. Integrate Supabase Auth
  - [x] 3.1 Set up Supabase project and configure Auth
    - Create Supabase project
    - Configure authentication providers (email/password)
    - Set up password complexity requirements
    - _Requirements: 1.1, 1.2, 13.3_
  
  - [x] 3.2 Implement backend Auth Service
    - Create JWT token validation middleware
    - Implement session management
    - Create authorization helpers (check notebook ownership)
    - _Requirements: 1.2, 1.4, 13.4_
  
  - [x] 3.3 Implement frontend authentication flow
    - Create login/signup UI components
    - Implement authentication state management (React Context)
    - Handle session persistence and restoration
    - Implement logout functionality
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  
  - [ ]* 3.4 Write property tests for authentication
    - **Property 1: Valid authentication creates session**
    - **Property 2: Invalid authentication rejects with error**
    - **Property 3: Session persistence across visits**
    - **Property 4: Logout clears session**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5**

- [ ] 4. Implement onboarding flow
  - [x] 4.1 Create onboarding UI
    - Design onboarding question screen
    - Create archetype selection component (3 options)
    - Implement navigation to main app after selection
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [x] 4.2 Store archetype preference
    - Create API endpoint to store archetype
    - Update user record with archetype
    - Apply archetype-based defaults (notebook organization, language)
    - _Requirements: 2.3, 2.5_
  
  - [ ]* 4.3 Write property test for archetype selection
    - **Property 7: Archetype selection stores preference**
    - **Validates: Requirements 2.3, 2.5**

- [x] 5. Checkpoint - Authentication and onboarding complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 2: Notebook Management

- [x] 6. Implement notebook CRUD operations
  - [x] 6.1 Create backend Notebook Service
    - Implement create notebook endpoint (POST /api/notebooks)
    - Implement list notebooks endpoint (GET /api/notebooks)
    - Implement get notebook endpoint (GET /api/notebooks/:id)
    - Implement delete notebook endpoint (DELETE /api/notebooks/:id)
    - Enforce user ownership on all operations
    - _Requirements: 3.1, 3.3, 3.5_
  
  - [x] 6.2 Create frontend notebook UI
    - Create notebook list component
    - Create notebook creation modal/form
    - Implement notebook selection and navigation
    - Create notebook deletion confirmation
    - Handle empty states (no notebooks)
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  
  - [ ]* 6.3 Write property tests for notebook management
    - **Property 8: Notebook creation with valid name**
    - **Property 9: Notebook deletion removes all data**
    - **Property 10: Notebook list shows only user's notebooks**
    - **Validates: Requirements 3.1, 3.3, 3.5**

- [x] 7. Implement notebook context view
  - [x] 7.1 Create notebook context UI
    - Create material list component
    - Create conversation history component
    - Implement search within notebook
    - Create navigation between chat and context views
    - _Requirements: 11.1, 11.2, 11.3, 11.6_
  
  - [x] 7.2 Implement material and conversation retrieval
    - Create API endpoint to get notebook materials (GET /api/notebooks/:id/materials)
    - Create API endpoint to get conversation history (GET /api/notebooks/:id/conversations)
    - Implement search endpoint (GET /api/notebooks/:id/search)
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 7.3 Write property tests for notebook context
    - **Property 17: Material visibility in notebook**
    - **Property 20: Conversation history persistence**
    - **Property 35: Notebook content search**
    - **Validates: Requirements 11.1, 11.2, 11.3**

- [x] 8. Checkpoint - Notebook management complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: Material Upload and Processing

- [x] 9. Implement file upload to Supabase Storage
  - [x] 9.1 Set up Supabase Storage bucket
    - Create storage bucket for materials
    - Configure access policies (authenticated users only)
    - Set file size limits (50MB)
    - _Requirements: 4.1, 13.1_
  
  - [x] 9.2 Create frontend upload UI
    - Create file upload component with drag-and-drop
    - Implement file type validation (PDF, txt, md, docx)
    - Display upload progress
    - Handle upload errors
    - _Requirements: 4.1, 4.2, 4.9_
  
  - [x] 9.3 Implement upload API endpoint
    - Create endpoint to initiate material upload (POST /api/notebooks/:id/materials)
    - Validate file metadata
    - Create material record with status: pending
    - Return material ID and upload URL
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ]* 9.4 Write property tests for file upload
    - **Property 11: File upload and storage round-trip**
    - **Validates: Requirements 4.3**

- [x] 10. Implement material processing pipeline
  - [x] 10.1 Create text extraction service
    - Implement PDF text extraction (PyPDF2 or pdfplumber)
    - Implement DOCX text extraction (python-docx)
    - Implement plain text extraction
    - Handle extraction errors gracefully
    - _Requirements: 4.4_
  
  - [x] 10.2 Implement text chunking
    - Create chunking function (500-1000 tokens, 100 token overlap)
    - Use tiktoken for token counting
    - Preserve metadata (page numbers, section headers)
    - Store chunks in database
    - _Requirements: 4.5_
  
  - [x] 10.3 Integrate Gemini embedding API
    - Set up Gemini API client
    - Implement batch embedding generation
    - Handle API rate limits and retries
    - Store embeddings in database (pgvector)
    - _Requirements: 4.6, 4.7_
  
  - [x] 10.4 Create background processing worker
    - Implement async task queue (Celery or similar)
    - Create material processing task
    - Update material status (pending → processing → completed/failed)
    - Implement error handling and retry logic
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8_
  
  - [x] 10.5 Create processing status polling endpoint
    - Create endpoint to check material status (GET /api/materials/:id/status)
    - Frontend polls for status updates
    - Display processing progress in UI
    - _Requirements: 4.9_
  
  - [ ]* 10.6 Write property tests for material processing
    - **Property 12: Text extraction produces content**
    - **Property 13: Chunking produces retrievable segments**
    - **Property 14: Embedding generation for all chunks**
    - **Property 15: Material processing round-trip**
    - **Property 16: Processing failure maintains state**
    - **Validates: Requirements 4.4, 4.5, 4.6, 4.7, 4.8**

- [x] 11. Checkpoint - Material upload and processing complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 4: Retrieval and Question Answering

- [ ] 12. Implement hybrid retrieval engine
  - [ ] 12.1 Implement semantic search
    - Create function to generate query embeddings
    - Implement cosine similarity search using pgvector
    - Return top-k chunks with relevance scores
    - _Requirements: 5.1, 5.2_
  
  - [ ] 12.2 Implement lexical search
    - Set up PostgreSQL full-text search on chunk content
    - Implement BM25-style ranking
    - Return top-k chunks with relevance scores
    - _Requirements: 5.1, 5.2_
  
  - [ ] 12.3 Implement result fusion
    - Combine semantic and lexical results using reciprocal rank fusion
    - Return unified top-k chunks
    - Log retrieval queries and results
    - _Requirements: 5.1, 5.2, 16.1_
  
  - [ ]* 12.4 Write property tests for retrieval
    - **Property 18: Hybrid retrieval combines semantic and lexical**
    - **Property 56: Retrieval query logging**
    - **Validates: Requirements 5.1, 5.2, 16.1**

- [ ] 13. Implement answer generation service
  - [ ] 13.1 Create prompt construction
    - Build prompt with retrieved chunks as context
    - Include conversation history (last 5 messages)
    - Add grounding instructions
    - _Requirements: 5.3_
  
  - [ ] 13.2 Integrate Gemini LLM API
    - Set up Gemini API client for generation
    - Implement answer generation with retry logic
    - Handle API errors and timeouts
    - Track token usage for cost monitoring
    - _Requirements: 5.3, 15.1_
  
  - [ ] 13.3 Implement grounding evaluation
    - Create function to compute grounding score
    - Check if answer references provided chunks
    - Extract citations from answer
    - Log grounding scores
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 13.4 Create chat API endpoint
    - Create endpoint for chat messages (POST /api/notebooks/:id/chat)
    - Orchestrate retrieval → generation → evaluation
    - Store message with citations and grounding score
    - Return response to frontend
    - _Requirements: 5.1, 5.3, 5.4, 6.1_
  
  - [ ]* 13.5 Write property tests for generation
    - **Property 19: Answer grounding in retrieved chunks**
    - **Property 22: Grounding score computation**
    - **Property 23: Chunk tracking for answers**
    - **Property 52: Token usage tracking**
    - **Property 57: Answer generation logging**
    - **Validates: Requirements 5.3, 5.4, 6.1, 6.4, 15.1, 16.2**

- [ ] 14. Implement chat UI
  - [ ] 14.1 Create chat interface components
    - Create message list component (user and assistant messages)
    - Create message input component
    - Implement typing indicator
    - Display citations with expandable source context
    - _Requirements: 5.4, 5.5, 5.9_
  
  - [ ] 14.2 Implement chat state management
    - Load conversation history on notebook open
    - Handle optimistic message updates
    - Manage loading states
    - Handle errors and retry
    - _Requirements: 5.7, 5.9_
  
  - [ ] 14.3 Implement citation expansion
    - Create citation component
    - Fetch and display source chunk context on click
    - Show material metadata (filename, page number)
    - _Requirements: 5.5_
  
  - [ ]* 14.4 Write property tests for chat UI
    - **Property 21: Citation expansion shows source**
    - **Property 40: Loading state display**
    - **Validates: Requirements 5.5, 12.3**

- [ ] 15. Implement query caching for cost optimization
  - [ ] 15.1 Create caching layer
    - Implement cache key generation (notebook + query hash)
    - Use Redis or in-memory cache
    - Set cache TTL (1 hour)
    - _Requirements: 15.6_
  
  - [ ] 15.2 Integrate caching into chat flow
    - Check cache before retrieval and generation
    - Store results in cache after generation
    - Track cache hit rate
    - _Requirements: 15.6_
  
  - [ ]* 15.3 Write property test for caching
    - **Property 55: Query caching reduces costs**
    - **Validates: Requirements 15.6**

- [ ] 16. Checkpoint - Question answering complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Content Generation

- [ ] 17. Implement content generation features
  - [ ] 17.1 Implement summary generation
    - Create prompt template for summaries
    - Implement summary generation endpoint (POST /api/notebooks/:id/summarize)
    - Return summary with citations
    - _Requirements: 7.1, 7.5_
  
  - [ ] 17.2 Implement outline generation
    - Create prompt template for outlines
    - Implement outline generation endpoint (POST /api/notebooks/:id/outline)
    - Return structured outline
    - _Requirements: 7.2_
  
  - [ ] 17.3 Implement flashcard generation
    - Create prompt template for flashcards
    - Implement flashcard generation endpoint (POST /api/notebooks/:id/flashcards)
    - Return question-answer pairs with citations
    - Store flashcards for later retrieval
    - _Requirements: 7.3, 7.5, 7.6_
  
  - [ ] 17.4 Add content generation to chat UI
    - Add buttons/commands for summary, outline, flashcards
    - Display generated content in chat
    - Implement flashcard save functionality
    - _Requirements: 7.4, 7.6_
  
  - [ ]* 17.5 Write property tests for content generation
    - **Property 24: Summary generation with grounding**
    - **Property 25: Outline generation with structure**
    - **Property 26: Flashcard generation from materials**
    - **Property 27: Flashcard save and retrieval**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5, 7.6**

- [ ] 18. Checkpoint - Content generation complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 6: Study Mode

- [ ] 19. Implement quiz generation
  - [ ] 19.1 Create quiz generation service
    - Implement question generation prompts (multiple choice, short answer, true/false)
    - Create quiz generation endpoint (POST /api/notebooks/:id/study/generate)
    - Generate questions with varying difficulty
    - Store quiz session and questions
    - Include source grounding for each question
    - _Requirements: 8.2, 8.4, 8.5, 8.6_
  
  - [ ]* 19.2 Write property tests for quiz generation
    - **Property 28: Quiz generation from materials**
    - **Property 29: Question type variety**
    - **Validates: Requirements 8.2, 8.5, 8.6**

- [ ] 20. Implement answer evaluation and feedback
  - [ ] 20.1 Create answer evaluation service
    - Implement correctness checking (exact match for multiple choice, semantic similarity for short answer)
    - Generate explanatory feedback for incorrect answers
    - Create answer submission endpoint (POST /api/study/questions/:id/answer)
    - Record learning signals (accuracy, retry count, time spent)
    - _Requirements: 9.1, 9.2, 9.4, 10.1, 10.2, 10.3_
  
  - [ ] 20.2 Implement feedback generation
    - Create prompt template for feedback
    - Include source material context in feedback
    - Ensure calm, non-punitive language
    - _Requirements: 9.2, 9.6_
  
  - [ ]* 20.3 Write property tests for answer evaluation
    - **Property 30: Answer evaluation correctness**
    - **Property 31: Incorrect answer feedback with grounding**
    - **Property 32: Correct answer confirmation**
    - **Property 33: Learning signal recording**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.6, 10.1, 10.2, 10.3**

- [ ] 21. Implement Study Mode UI
  - [ ] 21.1 Create Study Mode interface
    - Create dedicated study mode view (separate from chat)
    - Implement question display (one at a time)
    - Create answer input components (multiple choice, short answer, true/false)
    - Display feedback with source context
    - Implement retry functionality
    - _Requirements: 8.1, 8.3, 9.2, 9.4, 9.6_
  
  - [ ] 21.2 Implement quiz flow
    - Handle quiz start (generate or load quiz)
    - Navigate between questions
    - Track time spent per question
    - Handle quiz completion
    - Display calm session summary (no scores, no pressure language)
    - _Requirements: 8.1, 8.7, 8.8, 9.7_
  
  - [ ] 21.3 Create Study Mode entry points
    - Add "Start Study Session" button in notebook
    - Add Study Mode to app navigation
    - Handle transition to/from Study Mode
    - _Requirements: 8.1_
  
  - [ ]* 21.4 Write property tests for Study Mode UI
    - **Property 34: Learning signal storage for analysis**
    - **Validates: Requirements 10.5, 10.7**

- [ ] 22. Checkpoint - Study Mode complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 7: ML Experimentation Infrastructure

- [ ] 23. Implement experiment framework
  - [ ] 23.1 Create experiment assignment service
    - Implement deterministic variant assignment (based on user ID hash)
    - Store experiment assignments in database
    - Create endpoint to get user's experiment variants
    - _Requirements: 16.3_
  
  - [ ] 23.2 Implement experiment logging
    - Log retrieval queries with variant information
    - Log generated answers with variant information
    - Log user interactions (citation clicks, retries)
    - Store experiment events
    - _Requirements: 16.1, 16.2_
  
  - [ ] 23.3 Create experiment analysis tools
    - Implement metric computation (grounding accuracy, retrieval precision)
    - Create statistical significance tests
    - Store experiment results
    - _Requirements: 16.4, 16.6_
  
  - [ ] 23.4 Implement feature flags
    - Create feature flag system for gradual rollout
    - Integrate with experiment framework
    - Support rollback of experimental changes
    - _Requirements: 16.5, 16.7_
  
  - [ ]* 23.5 Write property tests for experiments
    - **Property 58: A/B test assignment consistency**
    - **Property 59: Evaluation metric computation**
    - **Property 60: Experiment isolation**
    - **Property 61: Experiment result storage**
    - **Validates: Requirements 16.3, 16.4, 16.5, 16.6**

- [ ] 24. Checkpoint - Experimentation infrastructure complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 8: Performance, Security, and Polish

- [ ] 25. Implement performance optimizations
  - [ ] 25.1 Add request timeouts
    - Implement timeout middleware for all API endpoints
    - Set appropriate timeouts (5s for queries, 30s for processing)
    - Return timeout errors gracefully
    - _Requirements: 12.4_
  
  - [ ] 25.2 Optimize database queries
    - Add indexes on frequently queried columns
    - Optimize retrieval queries
    - Implement connection pooling
    - _Requirements: 12.1, 12.5_
  
  - [ ] 25.3 Implement rate limiting
    - Add rate limiting middleware (per-user, per-endpoint)
    - Set appropriate limits (10 questions/min, 5 uploads/hour)
    - Return 429 status on limit exceeded
    - _Requirements: 13.6, 15.3_
  
  - [ ]* 25.4 Write property tests for performance
    - **Property 38: Question answering latency**
    - **Property 39: File processing latency**
    - **Property 41: Request timeout enforcement**
    - **Property 45: Rate limiting enforcement**
    - **Validates: Requirements 12.1, 12.2, 12.4, 13.6**

- [ ] 26. Implement security measures
  - [ ] 26.1 Add encryption
    - Verify Supabase Storage encryption at rest
    - Verify TLS for all API requests
    - _Requirements: 13.1, 13.2_
  
  - [ ] 26.2 Implement security logging
    - Log authentication events
    - Log authorization failures
    - Log rate limit violations
    - _Requirements: 13.7_
  
  - [ ]* 26.3 Write property tests for security
    - **Property 5: User data isolation**
    - **Property 6: Password complexity enforcement**
    - **Property 43: File encryption at rest**
    - **Property 44: TLS encryption in transit**
    - **Property 46: Security event logging**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.7**

- [ ] 27. Implement error handling
  - [ ] 27.1 Create error handling middleware
    - Catch all exceptions at API boundary
    - Transform technical errors to user-friendly messages
    - Log errors with full context
    - Return appropriate HTTP status codes
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [ ] 27.2 Implement specific error handlers
    - Network error handling with retry suggestion
    - File processing error handling with specific reasons
    - AI service unavailability handling with graceful degradation
    - _Requirements: 14.3, 14.4, 14.6, 14.7_
  
  - [ ] 27.3 Add frontend error handling
    - Display error toasts/notifications
    - Implement retry functionality
    - Maintain application state on errors
    - _Requirements: 14.1, 14.3_
  
  - [ ]* 27.4 Write property tests for error handling
    - **Property 47: User-friendly error messages**
    - **Property 48: Network error handling**
    - **Property 49: File processing error specificity**
    - **Property 50: Error logging with context**
    - **Property 51: Graceful degradation on AI service failure**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7**

- [ ] 28. Implement cost monitoring
  - [ ] 28.1 Create cost tracking service
    - Track LLM token usage and costs
    - Track embedding generation costs
    - Log cost metrics
    - _Requirements: 15.1, 15.2, 15.4_
  
  - [ ] 28.2 Add cost alerting
    - Implement cost threshold monitoring
    - Send alerts when thresholds exceeded
    - _Requirements: 15.5_
  
  - [ ]* 28.3 Write property tests for cost tracking
    - **Property 53: Embedding cost tracking**
    - **Property 54: Per-user rate limiting for AI operations**
    - **Validates: Requirements 15.2, 15.3**

- [ ] 29. Checkpoint - Performance, security, and cost monitoring complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 9: Mobile Responsiveness and Accessibility

- [ ] 30. Implement mobile responsiveness
  - [ ] 30.1 Make UI responsive
    - Implement responsive layouts (320px to 1920px)
    - Optimize touch targets (minimum 44x44px)
    - Test on various screen sizes
    - _Requirements: 17.1, 17.2_
  
  - [ ] 30.2 Optimize for mobile networks
    - Implement progressive file upload
    - Add upload pause/resume
    - Optimize image and asset loading
    - _Requirements: 17.3_
  
  - [ ]* 30.3 Write property tests for mobile
    - **Property 62: Mobile responsive rendering**
    - **Property 63: Touch interaction support**
    - **Property 64: Feature parity across devices**
    - **Validates: Requirements 17.1, 17.2, 17.4, 17.5**

- [ ] 31. Implement accessibility features
  - [ ] 31.1 Add keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Implement logical tab order
    - Add keyboard shortcuts for common actions
    - _Requirements: 18.1_
  
  - [ ] 31.2 Add ARIA labels and roles
    - Add ARIA labels to all interactive elements
    - Implement proper heading hierarchy
    - Add live regions for dynamic content
    - _Requirements: 18.2_
  
  - [ ] 31.3 Ensure color contrast and focus indicators
    - Verify WCAG AA contrast ratios (4.5:1 for text)
    - Add visible focus indicators
    - Test with text scaling (100% to 200%)
    - _Requirements: 18.3, 18.4, 18.5_
  
  - [ ]* 31.4 Write property tests for accessibility
    - **Property 65: Keyboard navigation support**
    - **Property 66: Screen reader accessibility**
    - **Property 67: Color contrast compliance**
    - **Property 68: Text scaling support**
    - **Property 69: Focus indicator visibility**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5**

- [ ] 32. Checkpoint - Mobile and accessibility complete
  - Ensure all tests pass, ask the user if questions arise.

### Phase 10: Integration Testing and Deployment

- [ ] 33. Implement integration tests
  - [ ]* 33.1 Write end-to-end flow tests
    - Test upload and chat flow
    - Test study mode flow
    - Test multi-user isolation
    - _Requirements: All critical flows_
  
  - [ ]* 33.2 Write load tests
    - Simulate 100 concurrent users
    - Measure latency under load
    - Verify no degradation
    - _Requirements: 12.5_

- [ ] 34. Set up CI/CD pipeline
  - [ ] 34.1 Configure GitHub Actions
    - Set up linting and formatting checks
    - Run unit tests
    - Run property tests
    - Run integration tests
    - Build Docker images
    - _Requirements: Testing infrastructure_
  
  - [ ] 34.2 Set up deployment
    - Configure staging environment
    - Configure production environment
    - Set up database migrations
    - Configure environment variables
    - _Requirements: Deployment infrastructure_

- [ ] 35. Deploy MVP to staging
  - [ ] 35.1 Deploy backend and frontend
    - Deploy FastAPI backend
    - Deploy Next.js frontend
    - Configure Supabase production project
    - Set up PostgreSQL with pgvector
    - _Requirements: Deployment_
  
  - [ ] 35.2 Verify deployment
    - Test all critical flows in staging
    - Verify performance meets requirements
    - Check error handling and logging
    - _Requirements: All requirements_

- [ ] 36. Final checkpoint - MVP complete
  - Ensure all tests pass, verify MVP success criteria met, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP iteration
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties across all inputs
- Unit tests (not explicitly listed) should be written alongside implementation for specific examples and edge cases
- The implementation assumes familiarity with the tech stack (Next.js, FastAPI, PostgreSQL, Gemini API)
- All context documents (requirements, design) are available during implementation

## MVP Success Criteria

The MVP is complete when a user can:
1. Create an account and log in
2. Create a notebook
3. Upload learning materials (PDF or text)
4. Ask questions grounded in those materials
5. Receive answers with visible source citations
6. Generate summaries, outlines, and flashcards
7. Complete at least one Study Mode session with quiz and feedback

## Post-MVP Enhancements (Out of Scope)

- Adaptive quiz difficulty based on learning signals
- Advanced experiment analysis dashboard
- Mobile native app (React Native)
- Collaboration features
- Social features
- Advanced visualization of learning progress
