# Design Document: Seshio MVP

## Overview

Seshio is an AI-powered learning platform built around three core pillars: grounded conversation, organized knowledge, and active practice. The system architecture separates concerns across frontend (Next.js), backend (FastAPI), and AI services (Gemini) while maintaining a cohesive user experience.

The design prioritizes:
- **Simplicity**: Clear component boundaries, minimal abstraction
- **Iteration**: ML experimentation without destabilizing core features
- **Cost-awareness**: Efficient retrieval and caching strategies
- **Calm UX**: No pressure mechanics, clear feedback, generous spacing

### Key Design Decisions

1. **Chat-first interface**: Primary interaction is conversational, with notebook context and study mode as secondary layers
2. **Hybrid retrieval**: Combines semantic (embedding-based) and lexical (keyword-based) search for better grounding
3. **Separate study mode**: Dedicated interface for active practice, not a sidebar or modal
4. **Silent learning signals**: Track user understanding without displaying metrics during MVP
5. **Archetype-based adaptation**: Defaults and language adapt to user context without creating separate modes

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    (Next.js + TypeScript)                   │
│                                                             │
│  ┌──────────────┐  ┌────────────────────┐  ┌──────────────┐ │
│  │   Chat UI    │  │    Notebook        │  │  Study Mode  │ │
│  │              │  │    Context         │  └──────────────┘ │
│  └──────────────┘  │    Backend         │                   │
│                    │ (FastAPI + Python) │                   │
│                    └────────────────────┘                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Auth       │  │  Notebook    │  │   Study      │       │
│  │  Service     │  │   Service    │  │   Service    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Retrieval   │  │  Generation  │  │  Evaluation  │       │
│  │   Engine     │  │   Service    │  │   Service    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Experiment Framework                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│      PostgreSQL          │  │    Supabase Services     │
│   (Primary Database)     │  │  (Auth + File Storage)   │
└──────────────────────────┘  └──────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI Services                            │
│                    (Gemini API)                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │     LLM      │  │  Embeddings  │                         │
│  │  (Gemini 3)  │  │   (Gemini)   │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Frontend Components

**Chat UI**
- Displays conversation history
- Handles message input and submission
- Renders AI responses with source citations
- Manages typing indicators and loading states
- Supports citation expansion for source context

**Notebook Context**
- Lists all uploaded materials
- Displays material metadata (name, size, upload date)
- Provides material deletion
- Shows conversation history
- Supports search within notebook

**Study Mode UI**
- Displays quiz questions one at a time
- Handles answer submission
- Renders feedback with source grounding
- Manages quiz flow (next question, retry, complete)
- Shows calm session summary

**State Management**
- Manages authentication state
- Caches notebook list and current notebook
- Handles optimistic updates for chat messages
- Manages file upload progress
- Coordinates API calls and error handling

#### Backend Services

**Auth Service**
- Integrates with Supabase Auth
- Validates JWT tokens
- Manages user sessions
- Enforces authorization rules

**Notebook Service**
- CRUD operations for notebooks
- Associates materials with notebooks
- Manages notebook metadata
- Enforces user ownership

**Material Processing Pipeline**
- Accepts file uploads
- Extracts text from PDFs and documents
- Chunks text into retrievable segments (500-1000 tokens with 100 token overlap)
- Generates embeddings via AI Service
- Stores chunks and embeddings in database
- Handles processing errors gracefully

**Retrieval Engine**
- Implements hybrid search (semantic + lexical)
- Semantic search: cosine similarity on embeddings
- Lexical search: BM25 or PostgreSQL full-text search
- Combines results using reciprocal rank fusion
- Returns top-k chunks with relevance scores
- Supports query rewriting for better retrieval

**Generation Service**
- Constructs prompts with retrieved context
- Calls Gemini LLM for answer generation
- Enforces grounding constraints in prompts
- Generates summaries, outlines, flashcards
- Generates quiz questions with answers
- Implements retry logic for API failures

**Evaluation Service**
- Computes grounding scores for answers
- Evaluates retrieval precision and recall
- Tracks answer quality metrics
- Logs evaluation results for analysis
- Supports custom evaluation metrics

**Study Service**
- Generates quiz sessions from materials
- Evaluates user answers
- Generates feedback for incorrect answers
- Tracks learning signals (accuracy, retries, time)
- Stores session results

**Experiment Framework**
- Supports A/B testing of retrieval strategies
- Logs experiment assignments and results
- Computes statistical significance
- Enables feature flags for gradual rollout
- Provides experiment analysis tools

#### Database Schema

**users** (managed by Supabase Auth)
- id (uuid, primary key)
- email (text)
- created_at (timestamp)
- archetype (enum: structured, deep_worker, explorer)

**notebooks**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- created_at (timestamp)
- updated_at (timestamp)

**materials**
- id (uuid, primary key)
- notebook_id (uuid, foreign key)
- filename (text)
- file_path (text, Supabase storage reference)
- file_size (integer)
- mime_type (text)
- processing_status (enum: pending, processing, completed, failed)
- created_at (timestamp)

**chunks**
- id (uuid, primary key)
- material_id (uuid, foreign key)
- content (text)
- embedding (vector, pgvector extension)
- chunk_index (integer)
- metadata (jsonb, stores page numbers, section headers)
- created_at (timestamp)

**conversations**
- id (uuid, primary key)
- notebook_id (uuid, foreign key)
- created_at (timestamp)

**messages**
- id (uuid, primary key)
- conversation_id (uuid, foreign key)
- role (enum: user, assistant)
- content (text)
- citations (jsonb, array of chunk references)
- grounding_score (float, nullable)
- created_at (timestamp)

**study_sessions**
- id (uuid, primary key)
- notebook_id (uuid, foreign key)
- started_at (timestamp)
- completed_at (timestamp, nullable)
- question_count (integer)

**study_questions**
- id (uuid, primary key)
- session_id (uuid, foreign key)
- question_text (text)
- question_type (enum: multiple_choice, short_answer, true_false)
- correct_answer (text)
- options (jsonb, for multiple choice)
- source_chunks (jsonb, array of chunk references)
- created_at (timestamp)

**study_responses**
- id (uuid, primary key)
- question_id (uuid, foreign key)
- user_answer (text)
- is_correct (boolean)
- retry_count (integer)
- time_spent_seconds (integer)
- feedback_shown (text)
- created_at (timestamp)

**experiments**
- id (uuid, primary key)
- name (text)
- variant (text)
- user_id (uuid, foreign key)
- assigned_at (timestamp)

**experiment_events**
- id (uuid, primary key)
- experiment_id (uuid, foreign key)
- event_type (text)
- event_data (jsonb)
- created_at (timestamp)

## Data Models

### Core Domain Models

**User**
```typescript
interface User {
  id: string;
  email: string;
  archetype: 'structured' | 'deep_worker' | 'explorer';
  createdAt: Date;
}
```

**Notebook**
```typescript
interface Notebook {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  materialCount?: number;
  messageCount?: number;
}
```

**Material**
```typescript
interface Material {
  id: string;
  notebookId: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}
```

**Chunk**
```python
@dataclass
class Chunk:
    id: str
    material_id: str
    content: str
    embedding: List[float]
    chunk_index: int
    metadata: Dict[str, Any]  # page_number, section_header, etc.
    created_at: datetime
```

**Message**
```typescript
interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  groundingScore?: number;
  createdAt: Date;
}

interface Citation {
  chunkId: string;
  materialId: string;
  filename: string;
  content: string;
  metadata: Record<string, any>;
}
```

**StudySession**
```typescript
interface StudySession {
  id: string;
  notebookId: string;
  startedAt: Date;
  completedAt?: Date;
  questionCount: number;
  questions: StudyQuestion[];
}

interface StudyQuestion {
  id: string;
  sessionId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer' | 'true_false';
  correctAnswer: string;
  options?: string[];  // for multiple choice
  sourceChunks: Citation[];
  response?: StudyResponse;
}

interface StudyResponse {
  id: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  retryCount: number;
  timeSpentSeconds: number;
  feedbackShown: string;
  createdAt: Date;
}
```

### API Models

**Chat Request**
```typescript
interface ChatRequest {
  notebookId: string;
  message: string;
  conversationId?: string;
}

interface ChatResponse {
  messageId: string;
  content: string;
  citations: Citation[];
  groundingScore: number;
  conversationId: string;
}
```

**Material Upload Request**
```typescript
interface UploadRequest {
  notebookId: string;
  file: File;
}

interface UploadResponse {
  materialId: string;
  filename: string;
  processingStatus: 'pending' | 'processing';
}
```

**Quiz Generation Request**
```typescript
interface QuizRequest {
  notebookId: string;
  questionCount: number;
  questionTypes?: ('multiple_choice' | 'short_answer' | 'true_false')[];
}

interface QuizResponse {
  sessionId: string;
  questions: StudyQuestion[];
}
```

**Answer Submission Request**
```typescript
interface AnswerRequest {
  questionId: string;
  answer: string;
  timeSpentSeconds: number;
}

interface AnswerResponse {
  isCorrect: boolean;
  feedback: string;
  sourceContext: Citation[];
  allowRetry: boolean;
}
```

## Data Flow

### Question Answering Flow

1. **User submits question** → Frontend sends ChatRequest to Backend
2. **Backend receives request** → Validates notebook ownership and extracts question
3. **Retrieval Engine processes query**:
   - Generates query embedding via AI Service
   - Performs semantic search (cosine similarity on chunk embeddings)
   - Performs lexical search (BM25 on chunk content)
   - Combines results using reciprocal rank fusion
   - Returns top-10 chunks with relevance scores
4. **Generation Service constructs prompt**:
   - Includes retrieved chunks as context
   - Adds grounding instructions
   - Includes conversation history (last 5 messages)
5. **AI Service generates answer** → Gemini LLM returns response
6. **Evaluation Service computes grounding score**:
   - Checks if answer references provided chunks
   - Computes citation accuracy
7. **Backend stores message** → Saves to database with citations and score
8. **Frontend receives response** → Displays answer with expandable citations

### Material Upload Flow

1. **User selects file** → Frontend validates file type and size
2. **Frontend uploads to Supabase Storage** → Gets file path
3. **Frontend notifies Backend** → Sends UploadRequest with file path
4. **Backend creates material record** → Status: pending
5. **Material Processing Pipeline starts**:
   - Downloads file from storage
   - Extracts text (PyPDF2 for PDFs, python-docx for Word)
   - Chunks text (500-1000 tokens, 100 token overlap)
   - Generates embeddings for each chunk (batch API calls)
   - Stores chunks and embeddings in database
   - Updates material status: completed
6. **Frontend polls for status** → Updates UI when processing completes

### Study Mode Flow

1. **User enters Study Mode** → Frontend requests quiz generation
2. **Backend generates quiz**:
   - Retrieves random chunks from notebook materials
   - Generates questions via AI Service
   - Stores session and questions in database
3. **Frontend displays first question** → User submits answer
4. **Backend evaluates answer**:
   - Compares to correct answer (exact match or semantic similarity)
   - Generates feedback if incorrect
   - Records learning signals (accuracy, time, retries)
5. **Frontend shows feedback** → User proceeds to next question or retries
6. **Repeat until quiz complete** → Frontend shows calm summary

## ML Experimentation Integration

### Experiment Framework Design

The experiment framework enables A/B testing and metric tracking without destabilizing core features:

**Experiment Assignment**
- User assigned to experiment variant on first relevant action
- Assignment stored in database and cached in session
- Deterministic assignment based on user ID hash (reproducible)

**Experiment Variants**
- Control: Current production behavior
- Treatment: New retrieval strategy, prompt template, or generation parameter

**Metric Collection**
- All retrieval queries logged with variant information
- All generated answers logged with grounding scores
- User interactions logged (citation clicks, retry attempts)
- Metrics computed asynchronously to avoid latency impact

**Experiment Analysis**
- Statistical significance computed using t-tests or chi-square tests
- Confidence intervals for metric differences
- Experiment dashboard for monitoring results

**Rollout Strategy**
- Start with 5% traffic to treatment
- Monitor error rates and latency
- Gradually increase to 50% if metrics improve
- Full rollout or rollback based on results

### Retrieval Experiments

**Experiment 1: Hybrid Search Weight Tuning**
- Control: 50/50 weight between semantic and lexical
- Treatment A: 70/30 semantic/lexical
- Treatment B: 30/70 semantic/lexical
- Metric: Grounding score, user citation clicks

**Experiment 2: Chunk Size Optimization**
- Control: 500-1000 tokens
- Treatment A: 250-500 tokens
- Treatment B: 1000-1500 tokens
- Metric: Grounding score, answer completeness (manual eval)

**Experiment 3: Query Rewriting**
- Control: Use user query as-is
- Treatment: Rewrite query for better retrieval (via LLM)
- Metric: Retrieval precision, grounding score

### Generation Experiments

**Experiment 4: Prompt Template Variations**
- Control: Current prompt template
- Treatment: Alternative templates emphasizing grounding
- Metric: Grounding score, answer quality (manual eval)

**Experiment 5: Temperature Tuning**
- Control: Temperature 0.7
- Treatment A: Temperature 0.3 (more deterministic)
- Treatment B: Temperature 1.0 (more creative)
- Metric: Answer diversity, grounding score

### Study Mode Experiments

**Experiment 6: Question Difficulty Adaptation**
- Control: Random difficulty
- Treatment: Adaptive difficulty based on learning signals
- Metric: User engagement, completion rate, perceived difficulty

**Experiment 7: Feedback Verbosity**
- Control: Brief feedback
- Treatment: Detailed explanatory feedback
- Metric: Retry success rate, user satisfaction



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications properties**: Several requirements (6.2, 14.5, 15.4, 16.1, 16.2) test that events are logged. These can be consolidated.

4. **Error handling properties**: Multiple requirements test error messages and handling (4.8, 14.1-14.4). These can be combined into comprehensive error handling properties.

5. **Authorization properties**: Requirements 13.4 and related access control can be consolidated into isolation properties.

The following properties eliminate redundancy while maintaining comprehensive coverage.

### Authentication and Authorization Properties

**Property 1: Valid authentication creates session**
*For any* valid user credentials, authenticating should create a valid session that can be used for subsequent requests.
**Validates: Requirements 1.2**

**Property 2: Invalid authentication rejects with error**
*For any* invalid credentials (wrong password, non-existent user, malformed input), authentication should fail and return a descriptive error without creating a session.
**Validates: Requirements 1.3**

**Property 3: Session persistence across visits**
*For any* authenticated user, if they leave and return to the platform, their session should be automatically restored without re-authentication.
**Validates: Requirements 1.4**

**Property 4: Logout clears session**
*For any* authenticated user, logging out should terminate the session such that subsequent requests require re-authentication.
**Validates: Requirements 1.5**

**Property 5: User data isolation**
*For any* two distinct users, neither user should be able to access, modify, or view the other user's notebooks, materials, or conversations.
**Validates: Requirements 13.4**

**Property 6: Password complexity enforcement**
*For any* password that does not meet complexity requirements (length, character types), account creation should be rejected with a descriptive error.
**Validates: Requirements 13.3**

### Onboarding Properties

**Property 7: Archetype selection stores preference**
*For any* archetype selection (structured, deep_worker, explorer), the system should store the preference and apply corresponding defaults without restricting feature access.
**Validates: Requirements 2.3, 2.5**

### Notebook Management Properties

**Property 8: Notebook creation with valid name**
*For any* non-empty notebook name, creating a notebook should result in a new notebook appearing in the user's notebook list with the specified name.
**Validates: Requirements 3.1**

**Property 9: Notebook deletion removes all data**
*For any* notebook with associated materials and conversations, deleting the notebook should remove the notebook, all materials, all chunks, and all conversation history such that none are retrievable afterward.
**Validates: Requirements 3.5**

**Property 10: Notebook list shows only user's notebooks**
*For any* user with multiple notebooks, the notebook list should display exactly those notebooks and no others (not other users' notebooks, not deleted notebooks).
**Validates: Requirements 3.3**

### Material Upload and Processing Properties

**Property 11: File upload and storage round-trip**
*For any* valid file (PDF or text, under 50MB), uploading should store the file such that it can be retrieved with identical content.
**Validates: Requirements 4.3**

**Property 12: Text extraction produces content**
*For any* uploaded file containing text, the extraction process should produce non-empty text content that can be chunked.
**Validates: Requirements 4.4**

**Property 13: Chunking produces retrievable segments**
*For any* extracted text, chunking should produce segments where each segment is 500-1000 tokens with 100 token overlap, and all segments together cover the original text.
**Validates: Requirements 4.5**

**Property 14: Embedding generation for all chunks**
*For any* set of chunks from a material, the system should generate embeddings for all chunks such that each chunk has a corresponding embedding vector.
**Validates: Requirements 4.6**

**Property 15: Material processing round-trip**
*For any* uploaded material, after processing completes, the material should be marked as completed and all chunks should be retrievable via search.
**Validates: Requirements 4.7**

**Property 16: Processing failure maintains state**
*For any* file that causes processing failure (corrupted, unsupported format), the system should return an error, not create a completed material record, and leave the notebook in its previous state.
**Validates: Requirements 4.8**

**Property 17: Material visibility in notebook**
*For any* notebook with uploaded materials, the notebook context view should display all materials with correct metadata (filename, size, upload date).
**Validates: Requirements 4.10, 11.1**

### Retrieval and Question Answering Properties

**Property 18: Hybrid retrieval combines semantic and lexical**
*For any* user question, the retrieval process should perform both semantic search (embedding similarity) and lexical search (keyword matching) and combine results.
**Validates: Requirements 5.1, 5.2**

**Property 19: Answer grounding in retrieved chunks**
*For any* generated answer, the answer should reference only information present in the retrieved chunks, and citations should point to actual chunks used.
**Validates: Requirements 5.3, 5.4**

**Property 20: Conversation history persistence**
*For any* conversation in a notebook, all messages (user and assistant) should be stored and retrievable in chronological order.
**Validates: Requirements 5.7, 11.2**

**Property 21: Citation expansion shows source**
*For any* citation in an answer, clicking the citation should display the source chunk content with surrounding context.
**Validates: Requirements 5.5**

**Property 22: Grounding score computation**
*For any* generated answer, the system should compute a grounding score between 0 and 1 indicating how well the answer is supported by retrieved chunks.
**Validates: Requirements 6.1**

**Property 23: Chunk tracking for answers**
*For any* generated answer, the system should record which chunks were retrieved and used, enabling later analysis.
**Validates: Requirements 6.4**

### Content Generation Properties

**Property 24: Summary generation with grounding**
*For any* summary request, the generated summary should be grounded in notebook materials with visible source citations.
**Validates: Requirements 7.1, 7.5**

**Property 25: Outline generation with structure**
*For any* outline request, the generated outline should have hierarchical structure (headings, subheadings) derived from notebook materials.
**Validates: Requirements 7.2**

**Property 26: Flashcard generation from materials**
*For any* flashcard request, the generated flashcards should be question-answer pairs where answers are grounded in notebook materials with citations.
**Validates: Requirements 7.3, 7.5**

**Property 27: Flashcard save and retrieval**
*For any* generated flashcard that is saved, the flashcard should be retrievable for later study sessions.
**Validates: Requirements 7.6**

### Study Mode Properties

**Property 28: Quiz generation from materials**
*For any* quiz generation request, all generated questions should be derivable from the notebook's materials with source grounding.
**Validates: Requirements 8.2, 8.6**

**Property 29: Question type variety**
*For any* quiz with multiple questions, the questions should include variety in types (multiple choice, short answer, true/false) and difficulty levels.
**Validates: Requirements 8.5**

**Property 30: Answer evaluation correctness**
*For any* quiz question with a correct answer, submitting the correct answer should be evaluated as correct, and submitting an incorrect answer should be evaluated as incorrect.
**Validates: Requirements 9.1**

**Property 31: Incorrect answer feedback with grounding**
*For any* incorrect answer, the system should provide explanatory feedback that references source materials and allows retry.
**Validates: Requirements 9.2, 9.4, 9.6**

**Property 32: Correct answer confirmation**
*For any* correct answer, the system should provide brief positive confirmation without excessive praise.
**Validates: Requirements 9.3**

### Learning Signal Tracking Properties

**Property 33: Learning signal recording**
*For any* quiz answer submission, the system should record accuracy (correct/incorrect), retry count, and time spent.
**Validates: Requirements 10.1, 10.2, 10.3**

**Property 34: Learning signal storage for analysis**
*For any* recorded learning signal, the data should be stored in a format suitable for ML experimentation and analysis.
**Validates: Requirements 10.5, 10.7**

### Search and Navigation Properties

**Property 35: Notebook content search**
*For any* search query within a notebook, the results should include all materials and messages containing the query terms.
**Validates: Requirements 11.3**

**Property 36: Material content display**
*For any* material selection in notebook context, the system should display the material's full text content.
**Validates: Requirements 11.4**

**Property 37: Material deletion removes from notebook**
*For any* material in a notebook, deleting the material should remove it from the notebook such that it no longer appears in the material list or search results.
**Validates: Requirements 11.5**

### Performance Properties

**Property 38: Question answering latency**
*For any* 100 consecutive question submissions, at least 95 should receive answers within 5 seconds.
**Validates: Requirements 12.1**

**Property 39: File processing latency**
*For any* file under 10MB, processing should complete (status: completed) within 30 seconds.
**Validates: Requirements 12.2**

**Property 40: Loading state display**
*For any* operation that takes longer than 500ms, the UI should display a loading indicator until the operation completes.
**Validates: Requirements 12.3**

**Property 41: Request timeout enforcement**
*For any* backend request, if processing exceeds the configured timeout, the request should be terminated and return a timeout error.
**Validates: Requirements 12.4**

**Property 42: Concurrent user handling**
*For any* load test with up to 100 concurrent users, the system should maintain response times within acceptable bounds (p95 < 5s for queries).
**Validates: Requirements 12.5**

### Security Properties

**Property 43: File encryption at rest**
*For any* uploaded file, the stored file should be encrypted such that direct database or storage access does not reveal plaintext content.
**Validates: Requirements 13.1**

**Property 44: TLS encryption in transit**
*For any* request between client and server, the connection should use TLS encryption.
**Validates: Requirements 13.2**

**Property 45: Rate limiting enforcement**
*For any* user making requests to rate-limited endpoints, exceeding the rate limit should result in requests being rejected with a 429 status code.
**Validates: Requirements 13.6**

**Property 46: Security event logging**
*For any* security-relevant event (authentication, authorization failure, rate limit exceeded), the event should be logged with sufficient context for audit.
**Validates: Requirements 13.7**

### Error Handling Properties

**Property 47: User-friendly error messages**
*For any* error condition, the error message displayed to users should be understandable without technical knowledge and should not expose implementation details (stack traces, database errors).
**Validates: Requirements 14.1, 14.2**

**Property 48: Network error handling**
*For any* network failure during a request, the system should inform the user of the network issue and provide a retry option.
**Validates: Requirements 14.3**

**Property 49: File processing error specificity**
*For any* file processing failure, the error message should specify the reason (unsupported format, file too large, corrupted file).
**Validates: Requirements 14.4**

**Property 50: Error logging with context**
*For any* error that occurs, the backend should log the error with sufficient context (user ID, request ID, stack trace, input parameters) for debugging.
**Validates: Requirements 14.5**

**Property 51: Graceful degradation on AI service failure**
*For any* request when AI services are unavailable, the system should inform the user, disable AI-dependent features, and allow access to non-AI features (viewing materials, browsing notebooks).
**Validates: Requirements 14.6, 14.7**

### Cost Awareness Properties

**Property 52: Token usage tracking**
*For any* LLM request (question answering, content generation, quiz generation), the system should record token usage (input tokens, output tokens, total cost).
**Validates: Requirements 15.1**

**Property 53: Embedding cost tracking**
*For any* embedding generation request, the system should record the number of embeddings generated and associated cost.
**Validates: Requirements 15.2**

**Property 54: Per-user rate limiting for AI operations**
*For any* user, AI operations (questions, quiz generation) should be rate-limited to prevent excessive costs.
**Validates: Requirements 15.3**

**Property 55: Query caching reduces costs**
*For any* repeated query (same question in same notebook), the system should return cached results without making additional LLM calls.
**Validates: Requirements 15.6**

### ML Experimentation Properties

**Property 56: Retrieval query logging**
*For any* retrieval query, the system should log the query, retrieved chunks, relevance scores, and experiment variant.
**Validates: Requirements 16.1**

**Property 57: Answer generation logging**
*For any* generated answer, the system should log the answer, grounding score, chunks used, and experiment variant.
**Validates: Requirements 16.2**

**Property 58: A/B test assignment consistency**
*For any* user in an experiment, the user should be consistently assigned to the same variant across sessions.
**Validates: Requirements 16.3**

**Property 59: Evaluation metric computation**
*For any* set of logged queries and answers, the system should be able to compute evaluation metrics (grounding accuracy, retrieval precision, answer quality).
**Validates: Requirements 16.4**

**Property 60: Experiment isolation**
*For any* running experiment, users not assigned to the experiment should experience no changes in behavior.
**Validates: Requirements 16.5**

**Property 61: Experiment result storage**
*For any* completed experiment, all results (metrics, statistical tests, variant assignments) should be stored for reproducibility.
**Validates: Requirements 16.6**

### Mobile and Accessibility Properties

**Property 62: Mobile responsive rendering**
*For any* screen width from 320px to 1920px, the UI should render without horizontal scrolling and with readable text.
**Validates: Requirements 17.1, 17.4**

**Property 63: Touch interaction support**
*For any* interactive element (buttons, links, inputs), touch interactions should work equivalently to mouse interactions.
**Validates: Requirements 17.2**

**Property 64: Feature parity across devices**
*For any* feature available on desktop, the same feature should be available and functional on mobile web.
**Validates: Requirements 17.5**

**Property 65: Keyboard navigation support**
*For any* interactive element, users should be able to navigate to and activate the element using only keyboard (Tab, Enter, Space).
**Validates: Requirements 18.1**

**Property 66: Screen reader accessibility**
*For any* UI element, appropriate ARIA labels and roles should be present for screen reader users.
**Validates: Requirements 18.2**

**Property 67: Color contrast compliance**
*For any* text element, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 18.3**

**Property 68: Text scaling support**
*For any* text size from 100% to 200%, the layout should remain functional without text overflow or broken layouts.
**Validates: Requirements 18.4**

**Property 69: Focus indicator visibility**
*For any* interactive element, when focused via keyboard, a visible focus indicator should be displayed.
**Validates: Requirements 18.5**

## Error Handling

### Error Categories

**User Input Errors**
- Empty or invalid notebook names
- Empty questions or messages
- Unsupported file types or sizes
- Malformed requests

**Processing Errors**
- File extraction failures (corrupted PDFs, unsupported formats)
- Embedding generation failures (API errors, rate limits)
- Chunking failures (empty content, encoding issues)

**AI Service Errors**
- LLM API failures (timeouts, rate limits, service unavailable)
- Embedding API failures
- Invalid responses from AI services

**Database Errors**
- Connection failures
- Query timeouts
- Constraint violations

**Authorization Errors**
- Unauthenticated requests
- Unauthorized access attempts
- Expired sessions

### Error Handling Strategy

**Frontend Error Handling**
- Display user-friendly error messages in toast notifications or inline
- Provide actionable next steps (retry, contact support)
- Maintain application state (don't lose user input)
- Log errors to monitoring service (Sentry or similar)

**Backend Error Handling**
- Catch all exceptions at API boundary
- Transform technical errors into user-friendly messages
- Log errors with full context (stack trace, request ID, user ID)
- Return appropriate HTTP status codes (400, 401, 403, 404, 500, 503)
- Implement circuit breakers for external services (AI APIs)

**Retry Logic**
- Exponential backoff for transient failures (network errors, rate limits)
- Maximum retry attempts (3 for most operations)
- Idempotency for retryable operations
- User-initiated retry for failed uploads or processing

**Graceful Degradation**
- When AI services unavailable: disable chat, study mode; allow viewing materials
- When database slow: show cached data with staleness indicator
- When storage unavailable: prevent uploads but allow other operations

### Error Response Format

```typescript
interfa
- Edge cases (empty inputs, boundary values, special characters)
- Error conditions (invalid inputs, service failures)
- Integration points between components
- UI component rendering and interactions

**Property Tests** focus on:
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Invariants that must be maintained
- Round-trip properties (serialization, encryption, processing)
- Metamorphic properties (relationships between operations)

Both approaches are complementary and necessary. Unit tests catch concrete bugs and document expected behavior. Property tests verify general correctness across a wide input space.

### Property-Based Testing Configuration

**Library Selection**:
- **Python (Backend)**: Hypothesis
- **TypeScript (Frontend)**: fast-check

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Configurable seed for reproducibility
- Shrinking enabled to find minimal failing examples
- Timeout per test: 30 seconds

**Property Test Tagging**:
Each property test must include a comment referencing the design property:
```python
# Feature: seshio-mvp, Property 1: Valid authentication creates session
@given(valid_credentials())
def test_authentication_creates_session(credentials):
    session = authenticate(credentials)
    assert session.is_valid()
    assert session.user_id == credentials.user_id
```

```typescript
// Feature: seshio-mvp, Property 65: Keyboard navigation support
fc.assert(
  fc.property(fc.interactiveElement(), (element) => {
    const canNavigate = element.canFocusViaKeyboard();
    const canActivate = element.canActivateViaKeyboard();
    return canNavigate && canActivate;
  }),
  { numRuns: 100 }
);
```

### Test Organization

**Backend Tests** (Python + pytest + Hypothesis):
```
tests/
├── unit/
│   ├── test_auth.py
│   ├── test_notebooks.py
│   ├── test_materials.py
│   ├── test_retrieval.py
│   ├── test_generation.py
│   └── test_study.py
├── property/
│   ├── test_auth_properties.py
│   ├── test_notebook_properties.py
│   ├── test_material_properties.py
│   ├── test_retrieval_properties.py
│   ├── test_generation_properties.py
│   └── test_study_properties.py
├── integration/
│   ├── test_upload_flow.py
│   ├── test_chat_flow.py
│   └── test_study_flow.py
└── conftest.py  # Shared fixtures and generators
```

**Frontend Tests** (TypeScript + Jest + fast-check):
```
tests/
├── unit/
│   ├── components/
│   │   ├── Chat.test.tsx
│   │   ├── NotebookContext.test.tsx
│   │   └── StudyMode.test.tsx
│   └── utils/
│       ├── api.test.ts
│       └── formatting.test.ts
├── property/
│   ├── navigation.property.test.ts
│   ├── accessibility.property.test.ts
│   └── responsive.property.test.ts
└── integration/
    ├── chat-flow.test.tsx
    └── study-flow.test.tsx
```

### Generator Strategy for Property Tests

**Custom Generators** (Hypothesis/fast-check):
- `valid_credentials()`: Generates valid username/password pairs
- `invalid_credentials()`: Generates invalid credentials (wrong format, missing fields)
- `notebook_name()`: Generates valid notebook names (1-100 chars, various Unicode)
- `file_content()`: Generates valid file content (text, PDF bytes)
- `user_question()`: Generates realistic questions
- `quiz_answer()`: Generates answers (correct and incorrect)
- `chunk_text()`: Generates text chunks of appropriate size

**Edge Case Generators**:
- Empty strings
- Very long strings (10,000+ characters)
- Unicode edge cases (emoji, RTL text, combining characters)
- Boundary values (file size limits, token limits)
- Special characters in inputs

### Integration Testing

**End-to-End Flows**:
1. **Upload and Chat Flow**: Upload material → Wait for processing → Ask question → Verify grounded answer
2. **Study Mode Flow**: Create notebook → Upload material → Generate quiz → Answer questions → Verify feedback
3. **Multi-User Flow**: Create two users → Verify data isolation → Attempt unauthorized access

**Test Environment**:
- Docker Compose for local testing (PostgreSQL, Supabase local, mock AI services)
- Separate test database (reset between test runs)
- Mock AI services for deterministic testing (optional real API for integration tests)

### Performance Testing

**Load Testing** (Locust or k6):
- Simulate 100 concurrent users
- Mix of operations: 60% questions, 20% uploads, 10% quiz generation, 10% browsing
- Measure p50, p95, p99 latencies
- Verify no degradation under load

**Stress Testing**:
- Gradually increase load until system fails
- Identify bottlenecks (database, AI API rate limits, memory)
- Verify graceful degradation

### Manual Testing Checklist

**Visual Design**:
- [ ] Typography and spacing match design system
- [ ] Color palette correct (light mode)
- [ ] Motion timing feels calm (120-180ms)
- [ ] No jarring transitions

**Tone and Voice**:
- [ ] Error messages are supportive, not punitive
- [ ] Feedback is clear, not verbose
- [ ] No hype or urgency language
- [ ] No anthropomorphization

**User Flows**:
- [ ] Onboarding feels welcoming
- [ ] Chat feels conversational
- [ ] Study Mode feels calm (no pressure)
- [ ] Navigation is intuitive

### Continuous Integration

**CI Pipeline** (GitHub Actions):
1. Lint (ESLint, Black, mypy)
2. Unit tests (Jest, pytest)
3. Property tests (fast-check, Hypothesis)
4. Integration tests
5. Build (Next.js, Docker)
6. Deploy to staging (on main branch)

**Test Coverage Goals**:
- Unit test coverage: 80%+ for business logic
- Property test coverage: All correctness properties implemented
- Integration test coverage: All critical user flows

**Failure Handling**:
- Property test failures include minimal failing example (shrunk)
- Flaky tests quarantined and investigated
- Performance regression alerts on p95 latency increase
