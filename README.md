# GapCloser AI

**GapCloser AI** is a Gemini-powered study buddy for **CAI1001C – Artificial Intelligence Thinking**. It turns course topics into explanations, quizzes, flashcards, gap checks, notes, final exam prep, and portfolio artifacts — without sending your API key to the browser.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- `@google/genai` (server-side only)
- `zod` + `zod-to-json-schema` for structured outputs
- `localStorage` for lightweight progress (topic confidence, completed actions)
- Vercel-ready env vars (`GEMINI_API_KEY`, optional `GEMINI_MODEL`, optional `GEMINI_MOCK`)
- IndexedDB study ledger (`src/lib/study-ledger.ts`) for quiz/deck snapshots on supporting pages

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local`: set a real `GEMINI_API_KEY` for live Gemini, **or** set `GEMINI_MOCK=true` to exercise the UI with server-side stub responses (no key required).

The template value `replace_with_your_gemini_api_key` is **not** accepted as a real key (real mode only).

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
- [Stability report](docs/STABILITY_REPORT.md)

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
- `npm run test` — Vitest unit tests

CI (see `.github/workflows/ci.yml`): `npm ci`, lint, typecheck, test, build on Node 22.
