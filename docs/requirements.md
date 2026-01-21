# Requirements Document: Seshio MVP

## Introduction

Seshio is an AI-powered learning platform that helps users make sense of what they're learning through grounded, retrieval-augmented conversations and active study practice. The MVP enables users to upload learning materials, ask questions grounded in those materials, and complete study sessions with quiz-based practice.

The system prioritizes clarity, understanding, and calm interaction over engagement metrics and gamification. It supports three user archetypes (Structured Learners, Deep Workers, Explorers) through adaptive defaults and language rather than separate modes.

## Glossary

- **System**: The Seshio platform (frontend, backend, AI services)
- **User**: A person using Seshio to learn
- **Notebook**: A container for related learning materials and conversations
- **Material**: User-uploaded content (PDF, text) used for learning
- **Chat**: The primary conversational interface for asking questions
- **Study_Mode**: A dedicated mode for active practice through quizzes
- **Grounding**: The process of linking AI responses to specific source materials
- **RAG**: Retrieval-Augmented Generation - AI technique combining retrieval and generation
- **Quiz**: A set of questions generated from user materials for practice
- **Learning_Signal**: Implicit data about user understanding (accuracy, retries, difficulty)
- **Frontend**: Next.js web application
- **Backend**: FastAPI Python service
- **AI_Service**: Gemini-based LLM and embedding service
- **Database**: PostgreSQL database for persistent storage
- **Auth_Service**: Supabase authentication service
- **Storage_Service**: Supabase storage for uploaded files

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to create an account and log in securely, so that my learning materials and progress are private and persistent.

#### Acceptance Criteria

1. WHEN a new user visits the platform, THE System SHALL provide account creation through Supabase Auth
2. WHEN a user provides valid credentials, THE Auth_Service SHALL authenticate the user and create a session
3. WHEN a user provides invalid credentials, THE Auth_Service SHALL reject authentication and return a descriptive error
4. WHEN an authenticated user returns to the platform, THE System SHALL restore their session automatically
5. WHEN a user logs out, THE System SHALL terminate the session and clear authentication state

### Requirement 2: Onboarding Flow

**User Story:** As a new user, I want to indicate my primary learning context, so that the platform can adapt its language and defaults to my needs.

#### Acceptance Criteria

1. WHEN a user completes authentication for the first time, THE System SHALL display the onboarding question
2. THE System SHALL present three archetype options: "School / courses", "Research / deep work", "Learning & exploration"
3. WHEN a user selects an archetype, THE System SHALL store the preference and configure default settings
4. WHEN a user completes onboarding, THE System SHALL navigate to the main application interface
5. THE System SHALL NOT create separate modes or restrict features based on archetype selection

### Requirement 3: Notebook Management

**User Story:** As a user, I want to create and organize notebooks, so that I can separate different learning topics or subjects.

#### Acceptance Criteria

1. WHEN a user requests to create a notebook, THE System SHALL create a new notebook with a user-provided name
2. WHEN a user provides an empty notebook name, THE System SHALL reject creation and maintain current state
3. THE System SHALL display all notebooks belonging to the authenticated user
4. WHEN a user selects a notebook, THE System SHALL navigate to that notebook's chat interface
5. WHEN a user requests to delete a notebook, THE System SHALL remove the notebook and all associated materials and conversations
6. THE System SHALL organize notebooks according to the user's selected archetype (chronological, thematic, or by subject)

### Requirement 4: Material Upload and Processing

**User Story:** As a user, I want to upload learning materials to a notebook, so that I can ask questions grounded in those materials.

#### Acceptance Criteria

1. WHEN a user uploads a PDF file, THE System SHALL accept files up to 50MB in size
2. WHEN a user uploads a text file, THE System SHALL accept common text formats (txt, md, docx)
3. WHEN a file upload is initiated, THE Storage_Service SHALL store the file securely
4. WHEN a file is stored, THE Backend SHALL extract text content from the file
5. WHEN text is extracted, THE Backend SHALL chunk the content into retrievable segments
6. WHEN content is chunked, THE AI_Service SHALL generate embeddings for each chunk
7. WHEN embeddings are generated, THE Database SHALL store chunks and embeddings for retrieval
8. IF file processing fails, THEN THE System SHALL notify the user with a descriptive error and maintain previous state
9. THE System SHALL display upload progress during processing
10. THE System SHALL display all uploaded materials within a notebook

### Requirement 5: Retrieval-Augmented Question Answering

**User Story:** As a user, I want to ask questions about my learning materials, so that I can understand concepts and clarify confusion.

#### Acceptance Criteria

1. WHEN a user submits a question in chat, THE System SHALL retrieve relevant chunks from notebook materials using hybrid search
2. THE Backend SHALL combine semantic search (embeddings) and lexical search (keywords) for retrieval
3. WHEN relevant chunks are retrieved, THE AI_Service SHALL generate an answer grounded in those chunks
4. THE System SHALL display the answer with visible source citations
5. WHEN a user clicks a citation, THE System SHALL display the source material context
6. WHEN no relevant materials are found, THE System SHALL inform the user that the question cannot be answered from available materials
7. THE System SHALL maintain conversation history within each notebook
8. WHEN generating answers, THE AI_Service SHALL prioritize accuracy over completeness
9. THE System SHALL display a typing indicator while processing questions

### Requirement 6: Answer Grounding Evaluation

**User Story:** As a system operator, I want to evaluate answer grounding quality, so that I can ensure responses are accurately tied to source materials.

#### Acceptance Criteria

1. WHEN an answer is generated, THE Backend SHALL compute a grounding score indicating citation accuracy
2. THE Backend SHALL log grounding scores for analysis and improvement
3. WHERE grounding evaluation is enabled, THE System SHALL flag low-confidence answers for review
4. THE Backend SHALL track which chunks were used for each answer
5. THE System SHALL store grounding metadata for future ML experimentation

### Requirement 7: Content Generation

**User Story:** As a user, I want to generate summaries, outlines, and flashcards from my materials, so that I can review and organize my learning.

#### Acceptance Criteria

1. WHEN a user requests a summary, THE AI_Service SHALL generate a concise summary grounded in notebook materials
2. WHEN a user requests an outline, THE AI_Service SHALL generate a structured outline of key concepts
3. WHEN a user requests flashcards, THE AI_Service SHALL generate question-answer pairs from materials
4. THE System SHALL display generated content in the chat interface
5. WHEN generating content, THE AI_Service SHALL include source citations
6. THE System SHALL allow users to save generated flashcards for later study

### Requirement 8: Study Mode - Quiz Generation

**User Story:** As a user, I want to practice with quizzes generated from my materials, so that I can actively test my understanding.

#### Acceptance Criteria

1. WHEN a user enters Study Mode, THE System SHALL transition to a dedicated study interface
2. THE AI_Service SHALL generate quiz questions based on notebook materials
3. THE System SHALL present one question at a time
4. THE System SHALL support multiple question types: multiple choice, short answer, true/false
5. WHEN generating questions, THE AI_Service SHALL vary difficulty levels
6. THE System SHALL include source grounding for each question
7. THE System SHALL NOT display timers by default
8. THE System SHALL NOT display scores during the quiz

### Requirement 9: Study Mode - Answer Evaluation and Feedback

**User Story:** As a user, I want to receive calm, constructive feedback on my quiz answers, so that I can learn from mistakes without pressure.

#### Acceptance Criteria

1. WHEN a user submits an answer, THE System SHALL evaluate correctness
2. WHEN an answer is incorrect, THE System SHALL provide explanatory feedback grounded in source materials
3. WHEN an answer is correct, THE System SHALL provide brief confirmation
4. THE System SHALL allow users to retry incorrect answers
5. THE System SHALL NOT use punitive or pressure-inducing language
6. THE System SHALL display source material context for incorrect answers
7. WHEN a user completes a quiz, THE System SHALL provide a calm summary of the session

### Requirement 10: Learning Signal Tracking

**User Story:** As a system operator, I want to track learning signals during study sessions, so that I can improve quiz quality and enable future adaptive features.

#### Acceptance Criteria

1. WHEN a user answers a question, THE Backend SHALL record accuracy (correct/incorrect)
2. THE Backend SHALL record retry attempts for each question
3. THE Backend SHALL record time spent on each question
4. THE Backend SHALL record user-perceived difficulty (if provided)
5. THE Backend SHALL store learning signals for ML experimentation
6. THE System SHALL NOT display tracked metrics to users during MVP
7. THE Backend SHALL aggregate signals for future adaptive difficulty features

### Requirement 11: Notebook Context View

**User Story:** As a user, I want to view all materials and conversations in a notebook, so that I can review what I've uploaded and discussed.

#### Acceptance Criteria

1. WHEN a user opens notebook context, THE System SHALL display all uploaded materials
2. THE System SHALL display conversation history in chronological order
3. THE System SHALL allow users to search within notebook content
4. WHEN a user selects a material, THE System SHALL display its content
5. THE System SHALL allow users to delete individual materials
6. THE System SHALL provide a way to return to chat from context view

### Requirement 12: System Performance

**User Story:** As a user, I want the platform to respond quickly, so that my learning flow is not interrupted.

#### Acceptance Criteria

1. WHEN a user submits a question, THE System SHALL return an answer within 5 seconds for 95% of requests
2. WHEN a user uploads a file under 10MB, THE System SHALL complete processing within 30 seconds
3. THE Frontend SHALL display loading states for operations exceeding 500ms
4. THE Backend SHALL implement request timeouts to prevent hanging operations
5. THE System SHALL handle concurrent users without degradation for up to 100 simultaneous sessions

### Requirement 13: Data Privacy and Security

**User Story:** As a user, I want my learning materials and data to be private and secure, so that I can trust the platform with sensitive information.

#### Acceptance Criteria

1. THE System SHALL encrypt all uploaded files at rest
2. THE System SHALL encrypt all data in transit using TLS
3. THE Auth_Service SHALL enforce password complexity requirements
4. THE Backend SHALL ensure users can only access their own notebooks and materials
5. THE System SHALL NOT share user data with third parties
6. THE Backend SHALL implement rate limiting to prevent abuse
7. THE System SHALL log security-relevant events for audit purposes

### Requirement 14: Error Handling and Reliability

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL display a user-friendly error message
2. THE System SHALL NOT expose technical implementation details in error messages
3. WHEN a network error occurs, THE System SHALL inform the user and suggest retry
4. WHEN file processing fails, THE System SHALL specify the reason (file type, size, corruption)
5. THE Backend SHALL log all errors with sufficient context for debugging
6. THE System SHALL gracefully degrade when AI services are unavailable
7. WHEN the AI_Service is unavailable, THE System SHALL inform users and disable dependent features

### Requirement 15: Cost Awareness

**User Story:** As a system operator, I want to monitor and control AI service costs, so that the platform remains economically sustainable.

#### Acceptance Criteria

1. THE Backend SHALL track token usage for all LLM requests
2. THE Backend SHALL track embedding generation costs
3. THE Backend SHALL implement per-user rate limits for AI operations
4. THE Backend SHALL log cost metrics for analysis
5. WHERE cost thresholds are exceeded, THE Backend SHALL alert operators
6. THE System SHALL implement caching for repeated queries to reduce costs
7. THE Backend SHALL prioritize cost-effective retrieval strategies

### Requirement 16: ML Experimentation Infrastructure

**User Story:** As an ML engineer, I want to run experiments on retrieval and generation quality, so that I can improve system performance iteratively.

#### Acceptance Criteria

1. THE Backend SHALL log all retrieval queries and results
2. THE Backend SHALL log all generated answers with grounding metadata
3. THE Backend SHALL support A/B testing of retrieval strategies
4. THE Backend SHALL support evaluation metric computation (grounding accuracy, retrieval precision)
5. THE System SHALL allow experiments to run without affecting user experience
6. THE Backend SHALL store experiment results for reproducibility
7. THE Backend SHALL support rollback of experimental changes

### Requirement 17: Mobile Responsiveness

**User Story:** As a user, I want to access Seshio on mobile devices, so that I can learn on the go.

#### Acceptance Criteria

1. THE Frontend SHALL render correctly on mobile screen sizes (320px and above)
2. THE Frontend SHALL support touch interactions for all features
3. THE Frontend SHALL optimize file upload for mobile networks
4. THE Frontend SHALL use responsive typography and spacing
5. THE System SHALL maintain feature parity between desktop and mobile web

### Requirement 18: Accessibility

**User Story:** As a user with accessibility needs, I want to use Seshio with assistive technologies, so that I can learn effectively.

#### Acceptance Criteria

1. THE Frontend SHALL support keyboard navigation for all interactive elements
2. THE Frontend SHALL provide ARIA labels for screen readers
3. THE Frontend SHALL maintain color contrast ratios meeting WCAG AA standards
4. THE Frontend SHALL support text scaling without breaking layouts
5. THE Frontend SHALL provide focus indicators for interactive elements
