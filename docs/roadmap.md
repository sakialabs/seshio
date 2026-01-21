# 📒 Seshio — Product & ML Roadmap

This roadmap outlines the path from a focused MVP to a mature, production-ready learning platform with applied machine learning at its core.

Each phase builds on the previous one.  
Nothing is added unless it improves understanding, practice, or feedback.

---

## 🧭 Guiding Rule

If a feature does not:
- Help users understand better
- Improve study effectiveness
- Or enable meaningful evaluation

It does not ship.

---

## 🧑‍🎓 User Archetypes & Adaptation Strategy

Seshio is designed to support different learning contexts without fragmenting the product into separate modes or experiences.

The system adapts through organization, language, and study flow — not through feature forks.

Three primary archetypes guide design and prioritization:

### 1. Structured Learners
Students navigating coursework, deadlines, and assessments.

- Prefer clear organization by subject or course
- Benefit from quizzes, review sessions, and guidance
- Value predictability and low ambiguity

### 2. Deep Workers
Researchers and advanced learners exploring complex topics over time.

- Prefer synthesis, comparison, and long-form understanding
- Value strong grounding, structure, and minimal interruption
- Use Study Mode selectively rather than as a default

### 3. Explorers
Lifelong learners and open-ended thinkers building understanding across domains.

- Prefer thematic organization and conceptual connections
- Value reflection, synthesis, and curiosity-driven exploration
- Use Study Mode as reinforcement rather than obligation

All roadmap phases are designed to serve these archetypes through subtle adaptation, while preserving a single, coherent core experience.

---

## Phase 1 — MVP: Core Learning Loop

**Goal:**  
Deliver a reliable, grounded learning experience that works end to end.

**Scope:**  
Minimal surface area. Maximum clarity.

### User Capabilities
- Create notebooks
- Upload materials (PDFs, text)
- Ask questions about their materials
- Receive grounded answers with visible sources
- Generate:
  - Summaries
  - Outlines
  - Flashcards
- Start basic study sessions

### System Capabilities
- Text extraction and chunking
- Embeddings and vector retrieval
- Retrieval-augmented generation (RAG)
- Strict grounding rules
- Clean UI with citations

### Success Criteria
- Upload → Ask → Understand works consistently
- Answers are traceable to source material
- UI feels simple and readable
- No hallucinations

**This phase ships first. Everything else waits.**

---

## Phase 2 — Study Mode Foundations

**Goal:**  
Move from “answering questions” to “supporting different learning workflows over time.”

### New Capabilities
- Quiz generation from user materials
- Multiple question types:
  - Multiple choice
  - Short answer
  - Open-ended
- Difficulty levels (basic control)
- Session-based study flow

### Signals Introduced
- Quiz accuracy
- Retry frequency
- Question difficulty vs performance

### Success Criteria
- Users can actively test understanding
- Study sessions feel purposeful
- Feedback is clear and actionable

---

## Phase 3 — Evaluation & Feedback Infrastructure

**Goal:**  
Make learning quality measurable.

This phase is mostly internal, but critical for ML depth.

### Evaluation Pipelines
- Retrieval quality metrics
- Answer grounding checks
- LLM-based answer evaluation
- Study usefulness scoring

### Logging Strategy
- Retrieved chunks
- Used chunks
- Answer scores
- Quiz outcomes
- Latency and failure cases

### Success Criteria
- You can compare approaches objectively
- You can explain why one version is better than another
- The system supports experimentation without refactors

---

## Phase 4 — ML-Enhanced Retrieval & Reasoning

**Goal:**  
Improve relevance, clarity, and study usefulness through ML.

### ML Upgrades
- Hybrid retrieval (semantic + lexical)
- Re-ranking models
- Improved chunk selection
- Prompt strategy comparisons

### Research Focus
- What retrieval strategies best support understanding?
- When does semantic search fail?
- How does relevance affect study outcomes?

### Success Criteria
- Measurable improvement over baseline RAG
- Fewer irrelevant answers
- Better quiz performance downstream

---

## Phase 5 — Adaptive Study Intelligence

**Goal:**  
Personalize learning without complexity.

### Capabilities
- Concept mastery estimation
- Adaptive quiz difficulty
- Weak-area detection
- Review recommendations

### ML Focus
- Lightweight learner modeling
- Feedback-driven adjustments
- Topic-level performance tracking

### Success Criteria
- Users improve faster over repeated sessions
- Weak concepts are surfaced early
- Adaptation feels helpful, not intrusive

---

## Phase 6 — Polishing & Public Readiness

**Goal:**  
Make Seshio presentable, stable, and shareable.

### Product Work
- UX polish
- Performance tuning
- Error handling
- Documentation

### ML Work
- Summarize experiments
- Document evaluation results
- Highlight learning improvements

### Outputs
- Portfolio-ready project
- Clear experimentation narrative
- Reproducible results

---

## 💰 Monetization (Future Consideration)

Seshio is designed to be sustainable without compromising learning quality or trust.

If monetization is introduced in the future, it will:
- Prioritize continuity and learning depth over usage volume
- Respect attention and cognitive load
- Rely on clear, predictable limits rather than engagement pressure

Potential models include:
- A free tier with strict usage caps
- A personal learner subscription for deeper Study Mode features
- An advanced tier for long-form and research-focused workflows

Monetization is intentionally not part of the MVP and does not influence early product decisions.

---

## 🚦 What Is Explicitly Out of Scope (For Now)

- Social features
- Collaboration
- Gamification
- Streaks or rewards
- Enterprise tooling

Seshio optimizes for understanding, not engagement metrics.

---

## ⭐ Final Note

This roadmap is intentionally conservative.

Shipping a small, correct system beats shipping a large, noisy one.  
Depth comes from iteration, not scope.

If Seshio helps people understand better today than yesterday, it is succeeding.
