# Stability report

Operator-facing snapshot of how the app is wired and what CI verifies.
Update when the route map, schema contracts, or storage layout change.

## Repo structure

| Area | Path | Role |
|------|------|------|
| App routes | `src/app/**/page.tsx` | App Router pages (dashboard, topics, tools, study-run, insights, interactive demo). |
| Topic detail | `src/app/topics/[topicId]/page.tsx` | Per-topic detail. |
| API (Gemini) | `src/app/api/gemini/*/route.ts` | Server-only Gemini or mock; Markdown or Zod-validated JSON. |
| Route envelope | `src/lib/api-route.ts` | `withGeminiRoute` wrapper + `resolveTopic` helper used by every route. |
| Course data | `src/data/courseTopics.ts` | Topic catalog + `getTopicById`. |
| Prompts | `src/lib/prompts/*.ts` | Server prompt builders. |
| Schemas | `src/lib/schemas/*.ts` | Zod contracts for structured API outputs. |
| Gemini client | `src/lib/gemini.ts` | `generateText` / `generateJson`; `GEMINI_MOCK` toggle. |
| API client (browser) | `src/lib/api-client.ts` | `fetch` wrappers for `/api/gemini/*` (no secrets). |
| Storage primitives | `src/lib/storage-keys.ts` | Single source of `localStorage` keys + parse helpers. |
| Local progress | `src/lib/local-progress.ts` | Per-topic confidence + completed actions. |
| Study ledger | `src/lib/study-ledger.ts` | IndexedDB store: quiz attempts, deck snapshots, study runs. |
| Interactive lessons | `src/components/interactive-lesson/*`, `src/data/lessons/*`, `src/lib/interactive-lesson/*` | Lesson UI + JSON types. |

## API surface

- **Markdown text** (`{ output | hint }`): `study-buddy`, `notes`, `final-exam`, `artifact`, `lesson-hint`
- **Structured JSON** (Zod-validated): `quiz`, `flashcards`, `gap-check`, `teach-back`

All routes share one envelope: invalid JSON body → 400, Zod validation failure →
400 with the first issue message, missing/placeholder API key → 503, Gemini bad
output → 502, otherwise 500 with a fallback message.

## Browser persistence

| Storage | Module | Used by |
|---------|--------|---------|
| `localStorage` | `local-progress.ts` (via `storage-keys.ts`) | dashboard, topic map, topic detail, every tool page |
| IndexedDB | `study-ledger.ts` | insights, study-run, quiz score logger, quiz/flashcards pages |

## CI

`.github/workflows/ci.yml` runs on `push` and `pull_request`:

- Node **22**
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Production build does not call Gemini; no API key required in CI.

## Known risks

- **No E2E tests** — flows are manual or build-only.
- **Mock fixtures are generic** — `GEMINI_MOCK=true` validates UI wiring, not content quality.
- **Placeholder API key** — `GEMINI_API_KEY=replace_with_your_gemini_api_key` is rejected in real mode to avoid silent misconfig.
- **IndexedDB / ledger** — schema migrations and corruption recovery are minimal.
- **No rate limiting** — add a token bucket on `/api/gemini/*` before exposing publicly.

## Suggested next steps

1. Integration test — one `GEMINI_MOCK=true` request per route.
2. Rate limiting on `/api/gemini/*`.
3. Triage `npm audit` advisories on a cadence.
