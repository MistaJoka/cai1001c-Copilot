# Phase 0 — Stability report

Generated during the stabilization sprint (GapCloser / CAI1001C). Goal: safer defaults, reproducible setup, CI, mock Gemini path, minimal tests, and clearer API errors—without product redesign.

## Repo structure map

| Area | Path | Role |
|------|------|------|
| App routes | `src/app/**/page.tsx` | App Router pages (dashboard, topics, tools, interactive demo). |
| Dynamic topic | `src/app/topics/[topicId]/page.tsx` | Per-topic detail. |
| API (Gemini) | `src/app/api/gemini/*/route.ts` | Server-only Gemini or mock; JSON/Markdown to client. |
| Course data | `src/data/courseTopics.ts` | Topic catalog + `getTopicById`. |
| Prompts | `src/lib/prompts/*.ts` | Server prompt builders. |
| Schemas | `src/lib/schemas/*.ts` | Zod contracts for structured API outputs. |
| Gemini client | `src/lib/gemini.ts` | `generateText` / `generateJson`; mock toggle. |
| API client (browser) | `src/lib/api-client.ts` | `fetch` wrappers for `/api/gemini/*` (no secrets). |
| Local progress | `src/lib/local-progress.ts` | `localStorage` progress map + last topic. |
| Study ledger | `src/lib/study-ledger.ts` | IndexedDB + some `localStorage` bridges. |
| Interactive lessons | `src/components/interactive-lesson/*`, `src/data/lessons/*`, `src/lib/interactive-lesson/*` | Lesson UI and types. |
| Root docs | `README.md`, `MVP_BUILD_NOTES.md`, `AGENTS.md`, `CLAUDE.md` | Human/agent orientation. |
| Product docs | `docs/MVP_QA_REPORT.md`, `docs/ROADMAP.md`, this file | QA, roadmap, stability. |

### App routes (pages)

- `/` — dashboard
- `/topics`, `/topics/[topicId]` — topic map + detail
- `/study-buddy`, `/study-run`, `/gap-check`, `/flashcards`, `/quiz`, `/notes`, `/final-exam`, `/artifacts`, `/insights`
- `/interactive-demo` — interactive lesson demo

### API routes

- `POST /api/gemini/study-buddy`, `notes`, `final-exam`, `artifact`, `lesson-hint` — Markdown/text (or mock Markdown)
- `POST /api/gemini/quiz`, `flashcards`, `gap-check`, `teach-back` — JSON validated with Zod (or mock JSON)

### Client components using `localStorage` or IndexedDB

| Storage | Module | Imported by (examples) |
|---------|--------|-------------------------|
| `localStorage` | `local-progress.ts` | `dashboard-content`, `topic-confidence-client`, `topics/page`, `study-buddy`, `gap-check`, `quiz`, `flashcards`, `notes`, `final-exam`, `artifacts`, `study-run` |
| IndexedDB + `localStorage` | `study-ledger.ts` | `insights/page`, `insights-teaser`, `study-run`, `quiz-score-logger`, `quiz`, `flashcards` |

Not every file in those feature folders is a client component; any file that imports the modules above runs persistence in the browser.

### Gemini-related files

- `src/lib/gemini.ts` — API client + `GEMINI_MOCK` stubs
- `src/app/api/gemini/**/route.ts` — nine route handlers
- `src/lib/prompts/*.ts` — prompts
- `src/lib/api-client.ts` — client-side callers

### Docs that may be stale

- `MVP_BUILD_NOTES.md` — snapshot of build planning; may drift from current tree.
- `docs/MVP_QA_REPORT.md` — point-in-time QA; re-run checks after large changes.
- `docs/ROADMAP.md` — intentions, not implementation truth.
- `CLAUDE.md` / `AGENTS.md` — agent rules; verify when toolchain changes.

## NPM scripts

| Script | Command |
|--------|---------|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` |

## Known risks (remaining)

- **No E2E tests** — flows are manual or depend on CI build only.
- **Mock fixtures are generic** — `GEMINI_MOCK=true` validates UI wiring, not content quality.
- **Placeholder API key** — `GEMINI_API_KEY=replace_with_your_gemini_api_key` is rejected in real mode to avoid accidental “silent” misconfig.
- **IndexedDB / ledger** — schema migrations and corruption recovery are minimal; ledger tests are light.
- **Third-party / audit** — `npm audit` may report upstream advisories; not addressed in this sprint.
- **Flashcards `sourceText`** — not length-validated on the server; very large bodies could stress prompts (pre-existing pattern).

## What CI checks

Workflow: `.github/workflows/ci.yml` on `push` and `pull_request`.

- Node **22**
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Production build does not call Gemini; no API key required in CI.

## What was fixed / added this sprint

- **`.env.example`** committed (safe placeholders) + **`.gitignore`** exception `!.env.example`.
- **`GEMINI_MOCK`** — server-side stubs; same response shapes; no key required when mock is on.
- **Structured JSON** — `parseJsonWithSchema` + clearer errors when Gemini returns bad JSON or wrong shape.
- **Request bodies** — invalid JSON → **400** on all `/api/gemini/*` routes.
- **Safe errors** — shared `publicErrorFromCaught` / `logRouteError` (truncated logs; no secret echoes).
- **Teach-back / lesson-hint hygiene** — `lesson-hint` `step` typed as `unknown` instead of `any`.
- **`final-exam`** — `weakTopics` elements must be strings to be used.
- **`study-buddy`** topic — only resolves metadata when `topic` is a non-empty string.
- **Tests** — Vitest + topic lookup, quiz JSON parsing, `local-progress` corruption + write.
- **Docs** — this report; README env + scripts updates.
- **Request payload caps** — `src/lib/gemini-body-limits.ts`; oversize strings / counts → **413** on `/api/gemini/*`.

## What was intentionally not changed

- UI layout, navigation, lesson content, and feature scope.
- Auth, backend database, and deployment config.
- Prompt wording (except error handling infrastructure).
- Study ledger IndexedDB schema and migrations.

## Recommended next stabilization tasks

1. **Integration test** — one `GEMINI_MOCK=true` request per route with `next` dev server or route unit harness.
2. **Rate limiting / abuse** — basic IP or token bucket on `/api/gemini/*` if exposed publicly.
3. **Refresh `docs/MVP_QA_REPORT.md`** — after any major route or schema change.
4. **`npm audit` triage** — decide on acceptable risk or pinned overrides.
