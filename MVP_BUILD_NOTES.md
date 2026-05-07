# GapCloser AI — MVP build notes

## Phase 1 — Inspect and prepare

- Workspace `CAI1001C` was empty; scaffolded Next.js 16 App Router + TypeScript + Tailwind v4 via `create-next-app` (package name `gapcloser` — npm disallows uppercase package names).
- shadcn/ui: **not installed** — using Tailwind-only components per spec.
- Plan: course shell first, then Gemini server routes, then client wiring, then localStorage progress, then lint/build.

## Assumptions

- `GEMINI_API_KEY` required at runtime for AI routes; `gemini.ts` uses lazy client init so `next build` succeeds without a key.
- Model default: `gemini-2.5-flash`, overridable via `GEMINI_MODEL`.
- `zodToJsonSchema` output passed as `responseJsonSchema`; strip `$schema` if present for API compatibility.
- **Quiz**: `/quiz` page + **`/api/gemini/quiz`**; linked from topic cards and **sidebar**.
- **Teach-back**: structured JSON via **`/api/gemini/teach-back`**; Study Buddy calls it when action is teach-back ([`TeachBackPanel`](src/components/teach-back-panel.tsx)).

## Completed

- [x] Scaffold: Next 16 + App Router + Tailwind v4 + `src/`
- [x] Routes: `/`, `/topics`, `/topics/[topicId]`, `/study-buddy`, `/gap-check`, `/flashcards`, `/quiz`, `/notes`, `/final-exam`, `/artifacts`
- [x] API: `/api/gemini/*` including `teach-back`
- [x] Client: `fetch` via `src/lib/api-client.ts` only — no Gemini in browser
- [x] Progress: `local-progress` + `GAPCLOSER_PROGRESS_EVENT` + `storage` for dashboard/topics refresh
- [x] `turbopack.root` in `next.config.ts` (quiets multi-lockfile warning when applicable)
- [x] QA + roadmap docs: [`docs/MVP_QA_REPORT.md`](docs/MVP_QA_REPORT.md), [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [x] `.env.example`: `GEMINI_API_KEY=` empty (no value in repo)
- [x] Verification: `npm run lint`, `npm run build`

**Checks run:** `npm run lint`, `npm run build`.

**Limits:** Live Gemini not verified in CI (needs real key in `.env.local`). Browser Network checklist in QA report is manual.

**Next step:** Add `GEMINI_API_KEY` to `.env.local`, smoke-test AI routes. Post-MVP: [`docs/ROADMAP.md`](docs/ROADMAP.md).
