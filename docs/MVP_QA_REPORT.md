# GapCloser AI — MVP QA report

**Date:** 2026-05-05  
**Repo:** CAI1001C (GapCloser / `gapcloser` npm package)  
**Method:** Static code review, `npm run lint`, `npm run build`, and grep-based security checks. Live Gemini calls require a valid `GEMINI_API_KEY` in `.env.local` (not executed in this pass).

---

## 1) Gemini / API key security

| Check | Result | Notes |
|--------|--------|--------|
| No `NEXT_PUBLIC_GEMINI_API_KEY` in repo | **Pass** | Only mentioned in README as “do not use”. |
| `.env.example` uses placeholder only | **Pass** (after fix) | Previously contained a literal key-like string; **replaced** with `replace_with_your_gemini_api_key`. Never commit real keys. |
| `GoogleGenAI` / `generateContent` / `@google/genai` only on server | **Pass** | Matches only [`src/lib/gemini.ts`](../src/lib/gemini.ts). |
| Browser calls same-origin `/api/gemini/*` only | **Pass** | Client uses [`src/lib/api-client.ts`](../src/lib/api-client.ts) → relative `fetch` paths. |

---

## 2) Routing and navigation

| Check | Result | Notes |
|--------|--------|--------|
| Sidebar + mobile: main routes load | **Pass** | Routes present in App Router; `/quiz` added to nav in Phase B. |
| Topic map → `[topicId]` dynamic pages | **Pass** | [`src/app/topics/[topicId]/page.tsx`](../src/app/topics/[topicId]/page.tsx) + [`courseTopics`](../src/data/courseTopics.ts). |
| Query deep links | **Pass** (code) | `useSearchParams` + Suspense on affected pages. Manual browser check recommended. |

---

## 3) Gemini API routes (functional)

Handlers exist and validate input; **live** success needs `GEMINI_API_KEY`.

| Route | Result | Notes |
|--------|--------|--------|
| `POST /api/gemini/study-buddy` | **Pass** (code) | Returns `{ output }`. |
| `POST /api/gemini/gap-check` | **Pass** (code) | Structured JSON via schema. |
| `POST /api/gemini/flashcards` | **Pass** (code) | |
| `POST /api/gemini/quiz` | **Pass** (code) | |
| `POST /api/gemini/notes` | **Pass** (code) | |
| `POST /api/gemini/final-exam` | **Pass** (code) | |
| `POST /api/gemini/artifact` | **Pass** (code) | |
| `POST /api/gemini/teach-back` | **Pass** (code, new) | Structured teach-back; used by Study Buddy when action = teach-back. |

---

## 4) UI / UX

| Check | Result | Notes |
|--------|--------|--------|
| Loading / error / empty states | **Pass** (code) | `ResponsePanel`, async flows on feature pages. |
| Flashcards flip / quiz reveal / copy | **Pass** (code) | Re-verify in browser. |
| Mobile nav | **Pass** (code) | Collapsible menu in [`sidebar-nav.tsx`](../src/components/sidebar-nav.tsx). |

---

## 5) TypeScript and build

| Check | Result |
|--------|--------|
| `npm run lint` | **Pass** |
| `npm run build` | **Pass** |

---

## 6) MVP discipline

| Check | Result | Notes |
|--------|--------|--------|
| No auth/DB/payments in scope | **Pass** | `localStorage` only. |
| No client API key | **Pass** | |
| Primary CTAs wired | **Pass** | |

---

## Bugs found and fixes applied (this session)

1. **`.env.example` secret risk:** Contained a string resembling a live API key → **fixed** to placeholder copy only.
2. **Stale progress on Dashboard / Topic map:** Progress reread only on route change → **fixed** with `GAPCLOSER_PROGRESS_EVENT` + `storage` listener ([`local-progress.ts`](../src/lib/local-progress.ts), dashboard, topics page).
3. **Turbopack multi-lockfile warning:** **fixed** with `turbopack.root` in [`next.config.ts`](../next.config.ts) (when parent `package-lock.json` exists).
4. **Quiz discoverability:** `/quiz` missing from sidebar → **fixed**.
5. **Unused `TeachBackResponseSchema`:** **fixed** with [`/api/gemini/teach-back`](../src/app/api/gemini/teach-back/route.ts), `runTeachBack`, and [`TeachBackPanel`](../src/components/teach-back-panel.tsx).

---

## Files touched (summary)

- [`docs/MVP_QA_REPORT.md`](MVP_QA_REPORT.md) (this file)
- [`docs/ROADMAP.md`](ROADMAP.md)
- [`../.env.example`](../.env.example)
- [`../next.config.ts`](../next.config.ts)
- [`../src/lib/local-progress.ts`](../src/lib/local-progress.ts)
- [`../src/lib/api-client.ts`](../src/lib/api-client.ts)
- [`../src/lib/prompts/teachBackPrompt.ts`](../src/lib/prompts/teachBackPrompt.ts)
- [`../src/app/api/gemini/teach-back/route.ts`](../src/app/api/gemini/teach-back/route.ts)
- [`../src/components/dashboard-content.tsx`](../src/components/dashboard-content.tsx)
- [`../src/app/topics/page.tsx`](../src/app/topics/page.tsx)
- [`../src/components/sidebar-nav.tsx`](../src/components/sidebar-nav.tsx)
- [`../src/components/teach-back-panel.tsx`](../src/components/teach-back-panel.tsx)
- [`../src/app/study-buddy/page.tsx`](../src/app/study-buddy/page.tsx)
- [`../README.md`](../README.md) (teach-back route line, if updated)

---

## Recommended next steps

1. Add a real key to **`.env.local`** (never commit); smoke-test each API route once.
2. If deploying: set `GEMINI_API_KEY` in Vercel project env.
3. Follow [`ROADMAP.md`](ROADMAP.md) when moving beyond MVP (Supabase, streaming, etc.).
