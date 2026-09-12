# Career Compass AI - AI Career Navigator

**Live Demo:** https://gemini-career-mapper.vercel.app/
**Team:** Idea Engineer - HackDays Solan 2026

### Tagline
Confused about your career? Let AI guide you.

### What it does
- Upload Resume (PDF)
- Gemini AI analyzes skills
- Returns Top 3 career matches with % (e.g., Data Analyst 92%)
- ATS Score 0-100 with progress bar
- 90-Day Roadmap (Week 1-4, 5-8, 9-12)

### Tech Stack
 Gemini 2.0 Flash API, pdf.js

### How to Run
npm install
npm run dev

### Error Handling & Backup
- Validates PDF only, 5MB max
- Try-catch on Gemini API
- Fallback demo data if API busy
- Video backup if offline

### Team
Built by Team Idea Engineer for HackDays Solan 2026
