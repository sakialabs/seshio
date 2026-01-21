# 📒 Seshio — Visuals & Onboarding Master Doc

This document defines the visual system, UI structure, and onboarding flow for Seshio.

The goal is to create a learning interface that feels:
- Immediately usable
- Familiar but not generic
- Flexible across learning styles
- Calm without saying so

If something conflicts with this document, this document wins.

---

## 1. Core UI Philosophy

### The Prime Directive

Seshio is **chat-first, notebook-backed**.

- Chat is the front door
- Structure lives quietly underneath
- Study Mode is a focused, intentional shift

Users should never feel like they need to “learn the app” before learning their material.

---

## 2. High-Level App Structure

### App-Level Navigation (Minimal)

- **Notebooks**
- **Settings**

No dashboards.  
No feature tabs.  
No productivity theater.

---

### Inside a Notebook

A notebook has **three layers**, revealed progressively.

1. **Chat (default, primary)**
2. **Notebook Context (secondary, on demand)**
3. **Study Mode (separate mode)**

At no point are all three visible at once.

---

## 3. Chat-First UI (Primary Experience)

### Purpose
Chat is where thinking happens.

Users should be able to:
- Open a notebook
- Start typing
- Get value immediately

Even if they never open anything else.

---

### Chat Layout

- Single centered column
- Generous margins
- Document-like spacing
- No chat bubbles that feel “messenger-like”
- Assistant responses feel like written explanations, not messages

---

### Chat Empty State

The empty state sets the tone.

**Primary message:**
> Add anything you’re learning from, then ask away.

**Primary action:**
> Add material

No secondary CTAs.  
No instructions wall.

---

### Sources in Chat

- Sources are referenced inline
- Clicking a reference opens the Notebook Context drawer
- No permanent source panel visible by default

This keeps answers grounded without clutter.

---

## 4. Notebook Context (Secondary Layer)

### Purpose
The notebook provides structure and grounding without demanding attention.

### Behavior
- Opens as a right-side drawer
- Fully collapsible
- Never auto-opens
- Remembers last state per notebook

---

### Contents
- Uploaded materials
- Extracted sections (when available)
- Simple list, not a file manager
- Clear naming and timestamps

The notebook should feel like **supporting material**, not a control panel.

---

## 5. Study Mode (Dedicated Mode)

### Key Rule
Study Mode is not a panel.  
It is a **mode switch**.

This avoids the confusion seen in multi-pane systems.

---

### Entering Study Mode

Entry points:
- “Start Study Session” button in notebook
- Suggested after sustained chat activity (soft prompt)

Upon entry:
- Chat history is hidden
- Notebook context is hidden
- Focus narrows to one task at a time

---

### Study Mode Flow

#### 1. Session Setup (Lightweight)

User selects:
- Session length (10 / 20 / 30 min)
- Optional focus areas (suggested, not required)

CTA:
> Start session

---

#### 2. Question Phase

- One question per screen
- Large, readable text
- No timers by default
- No performance pressure

Question types:
- Multiple choice
- Short answer
- Open-ended explanation

Primary action:
> Submit

Secondary:
> Skip for now

---

#### 3. Feedback Phase

After submission:
- Clear correctness signal (subtle)
- Short explanation
- Source snippet (optional, collapsible)
- Gentle follow-up suggestion

No confetti.  
No red/green theatrics.

---

#### 4. Adaptation (Invisible)

The system tracks:
- accuracy
- retries
- hesitation
- topic difficulty

The user sees:
- nothing technical
- no stats dump
- no dashboards

Adaptation should feel *helpful*, not *observed*.

---

#### 5. Session Wrap-Up

End screen shows:
- What went well
- What to revisit later
- Suggested next step

Example:
> You’re solid on A and B.  
C might be worth another look soon.

CTAs:
- Review notes
- Start another session
- Exit

---

## 6. Visual Design System

### Color Palette

#### Light Mode (Default)

**Backgrounds**
- Base: `#FAFAF7`
- Surface: `#FFFFFF`
- Subtle panel: `#F3F4F1`

**Text**
- Primary: `#111111`
- Secondary: `#4B5563`
- Muted: `#6B7280`

**Borders**
- Default: `#E5E7EB`
- Subtle: `#ECEDE8`

**Accent**
- Focus Blue: `#3A6EA5`

Used only for:
- primary actions
- focus states
- active selections

---

#### Dark Mode

Designed, not inverted.

**Backgrounds**
- Base: `#0E1116`
- Surface: `#151922`
- Subtle panel: `#1C212C`

**Text**
- Primary: `#E5E7EB`
- Secondary: `#9CA3AF`
- Muted: `#6B7280`

**Borders**
- Default: `#2A2F3A`
- Subtle: `#232833`

**Accent**
- Focus Blue: `#5B8EDC`

Dark mode should feel like **night reading**, not a terminal.

---

## 7. Typography

### Typeface
**Inter** (system fallback)

Chosen for:
- Neutrality
- Readability
- Longevity

---

### Type Scale

**Headings**
- H1: 32px · Medium
- H2: 24px · Medium
- H3: 18px · Medium

**Body**
- Primary: 16px · Regular
- Secondary: 14px · Regular

**Line Height**
- Body: 1.55–1.65
- Headings: 1.3–1.4

Rules:
- No ultra-bold
- No paragraph italics
- Let spacing do the work

---

## 8. Motion & Interaction

Motion should feel like:
- turning a page
- sliding paper
- opening a notebook

Guidelines:
- 120–180ms duration
- ease-in-out
- no bounce
- no spring physics

Framer Motion is used sparingly.

---

## 9. Motion, Transitions & Loading States

Motion and waiting are part of the learning experience.
They should reduce friction, not demand attention.

Seshio uses motion and loading states to preserve flow and orientation.

---

### Motion Principles

Motion should feel like:
- turning a page
- sliding paper
- opening a notebook

Never like:
- bouncing
- popping
- celebrating

Guidelines:
- Duration: 120–180ms
- Easing: ease-in-out
- No bounce
- No spring physics
- Motion must never be required to understand state changes

---

### Motion Implementation

- **Framer Motion** is used for UI transitions
- Used sparingly and consistently
- Applied to:
  - Chat message entry
  - View transitions (Chat ↔ Context ↔ Study Mode)
  - Modal and drawer appearance
  - Study Mode question progression

Motion should feel supportive and predictable.
If noticed, it is probably too much.

---

### Loading States & Skeletons

Waiting should feel calm, not broken.

Seshio uses **loading skeletons** instead of spinners wherever content is expected to appear.

---

### Skeleton Principles

- Skeletons mirror the final layout
- No layout shifts when content loads
- No artificial delays
- No fake progress indicators

If something takes time, the interface acknowledges it quietly.

---

### Where Skeletons Are Used

**Chat**
- Placeholder blocks for assistant responses
- Skeleton text lines resembling paragraphs
- Appears immediately after message submission

**Notebook Context**
- Material list skeletons while loading
- Section placeholders before extraction completes

**Study Mode**
- Question placeholder before first question loads
- Subtle transitions between questions
- No spinners between steps

**Onboarding**
- Minimal skeleton for archetype options if data is loading

---

### Skeleton Visual Style

- Neutral background tint
- Soft contrast against surface color
- No shimmer animations
- Optional very subtle opacity pulse

Skeletons should feel like:
- paper waiting to be written on
- content preparing itself

---

### Anti-Patterns (Never Use)

- Full-page spinners
- Blocking loading modals
- “Loading…” text without context
- Fake progress bars

If users can still read, think, or breathe while waiting, the design is working.

---

## 10. Onboarding Flow (Archetype-Aware)

### The One Question

On first launch, ask exactly one thing:

> What are you mostly using Seshio for right now?

Options:
- School / courses
- Research / deep work
- Learning & exploration

No explanations.  
No personas.  
No commitment.

---

### What This Choice Does

This choice:
- Sets default notebook organization
- Adjusts language and empty-state copy
- Tunes Study Mode suggestions

It does **not**:
- Lock the user in
- Change core features
- Create separate modes

Users can change this anytime.

---

### Archetype Defaults (Quiet)

**School / Courses**
- Notebooks suggested as courses
- Study Mode emphasized
- Language is concrete and structured

**Research / Deep Work**
- Notebooks suggested as projects
- Study Mode de-emphasized
- Chat favors synthesis and outlining

**Learning / Exploration**
- Notebooks suggested as themes
- Study Mode optional
- Chat encourages connections and reflection

Same UI.  
Different posture.

---

## 11. Mobile Considerations (Expo)

- Chat-first translates naturally to mobile
- Notebook Context becomes a bottom sheet
- Study Mode remains full-screen
- Touch targets prioritized over density

Mobile should feel like:
- Reading
- Thinking
- Responding

Not managing.

---

## 12. UX Red Lines (Never Cross)

Seshio never uses:
- Streaks
- XP
- Leaderboards
- Badges
- Urgency language
- Guilt-based nudges

Understanding > engagement.

---

## 13. Final UX Test

Before shipping any screen, ask:

- Can someone open this tired and stressed?
- Is it obvious what to do next?
- Does anything compete with the content?
- Would this still feel okay after 30 minutes?

If yes, ship.  
If not, simplify.

---

## Closing Principle

Seshio should feel like a place where:
- Thinking is allowed
- Learning feels manageable
- Progress is quiet but real

If the interface disappears and understanding remains, the design has succeeded.
