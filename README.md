# GapCloser AI

**GapCloser AI** is a Gemini-powered study buddy for **CAI1001C – Artificial Intelligence Thinking**. It turns course topics into explanations, quizzes, flashcards, gap checks, notes, final exam prep, and portfolio artifacts — without sending your API key to the browser.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- `@google/genai` (server-side only)
- `zod` + `zod-to-json-schema` for structured outputs
- `localStorage` for lightweight progress
- Vercel-ready env vars (`GEMINI_API_KEY`, optional `GEMINI_MODEL`)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Gemini API key to `.env.local` before using AI features.

## MVP features

- Dashboard with quick actions and local progress hints
- Topic map + topic detail pages (hardcoded `courseTopics`)
- **Study Buddy** — Markdown answers via `/api/gemini/study-buddy`; structured **Teach-back** scores via `/api/gemini/teach-back`
- **Gap Check** — structured feedback via `/api/gemini/gap-check`
- **Flashcards** — JSON deck + flip UI via `/api/gemini/flashcards`
- **Quiz** — JSON questions via `/api/gemini/quiz`; UI at `/quiz` (sidebar + topic cards)
- **Notes Builder** — Markdown notes via `/api/gemini/notes`
- **Final Exam Prep** — Markdown packet via `/api/gemini/final-exam`
- **Portfolio Artifacts** — Markdown artifact via `/api/gemini/artifact`

## Gemini security

- Use **`GEMINI_API_KEY`** in `.env.local` (server only).
- Do **not** use `NEXT_PUBLIC_GEMINI_API_KEY`.
- All Gemini calls run in **Route Handlers** under `src/app/api/gemini/*`.

## Future features

- Supabase auth and database
- Saved notes
- Saved flashcards
- Quiz history
- File upload for syllabus and lecture notes
- Voice teach-back mode
- Spaced repetition
- Final exam simulator
- Portfolio export to Markdown/PDF
- Gemini streaming responses

## Docs

- [MVP QA report](docs/MVP_QA_REPORT.md)
- [Post-MVP roadmap](docs/ROADMAP.md)

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
