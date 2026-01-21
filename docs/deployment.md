# 📒 Seshio — Deployment

This document outlines the planned deployment setup for Seshio.
Details will be expanded once the project reaches the deployment phase.

---

## Platforms

### Frontend
- Netlify  
- Next.js (TypeScript)

### Backend
- Render  
- FastAPI (Python, Docker)

### Database & Auth
- Supabase  
- PostgreSQL  
- Authentication and file storage

### AI Services
- Google Gemini (LLM + embeddings)

---

## Notes

- All AI calls will be handled server-side
- Environment variables will be managed per platform
- Cost controls and rate limiting will be added before public deployment
- This document will be expanded closer to launch

---

## ✅ Pre-Launch Checklist

- [ ] Environment variables set
- [ ] Supabase RLS tested with two users
- [ ] Upload size limits enforced
- [ ] AI rate limits active
- [ ] Health check endpoint live

---

## 🧘 Principle

> Keep deployment boring.  
> Boring systems survive.