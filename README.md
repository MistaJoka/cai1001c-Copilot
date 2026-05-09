# GapCloser AI

**GapCloser AI** is a Gemini-powered study buddy for **CAI1001C – Artificial Intelligence Thinking**. It turns course topics into explanations, quizzes, flashcards, gap checks, notes, final-exam prep, and portfolio artifacts — without sending your API key to the browser.

## Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS v4
- `@google/genai` (server-side only)
- `zod` + `zod-to-json-schema` for structured outputs
- Framer Motion + dnd-kit for the interactive lesson engine
- `localStorage` for lightweight progress (topic confidence, completed actions)
- IndexedDB study ledger (`src/lib/study-ledger.ts`) for quiz/deck/run snapshots

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local`: set a real `GEMINI_API_KEY` for live Gemini, **or** set `GEMINI_MOCK=true` to exercise the UI with server-side stub responses (no key required).

The template value `replace_with_your_gemini_api_key` is **not** accepted as a real key.

## Routes

App pages:

- `/` — dashboard
- `/topics`, `/topics/[topicId]` — topic map + detail
- `/study-buddy` — Markdown chat / structured **Teach-back**
- `/gap-check` — explain-first, structured feedback
- `/flashcards`, `/quiz`, `/notes`, `/final-exam`, `/artifacts` — single-purpose tools
- `/study-run` — guided gap → quiz → flashcards loop, persisted to the IndexedDB ledger
- `/insights` — read-only ledger view
- `/interactive-demo` — JSON-driven lesson engine (themed lesson + all-types lab)

API routes (all `POST`, all under `/api/gemini/`):

- Markdown/text: `study-buddy`, `notes`, `final-exam`, `artifact`, `lesson-hint`
- Structured JSON (Zod-validated): `quiz`, `flashcards`, `gap-check`, `teach-back`

All routes share the `withGeminiRoute` envelope in `src/lib/api-route.ts`.

## Gemini security

- Use **`GEMINI_API_KEY`** in `.env.local` (server only).
- Do **not** use `NEXT_PUBLIC_GEMINI_API_KEY`.
- All Gemini calls run in **Route Handlers** under `src/app/api/gemini/*`.

## Future features

- Supabase auth and database
- Saved notes, saved flashcards, quiz history
- Syllabus / lecture file upload
- Voice teach-back, spaced repetition, final-exam simulator
- Portfolio export to Markdown/PDF
- Gemini streaming responses

## Docs

- [Stability report](docs/STABILITY_REPORT.md)
- [Post-MVP roadmap](docs/ROADMAP.md)

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
- `npm run test` — Vitest unit tests

CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, test, build on Node 22.
