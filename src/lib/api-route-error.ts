import { z } from "zod";

const SAFE_LOG_MAX = 240;

export function logRouteError(routeTag: string, err: unknown): void {
  if (err instanceof z.ZodError) {
    console.error(`[${routeTag}] validation`, err.flatten());
    return;
  }
  const msg = err instanceof Error ? err.message : String(err);
  const safe = msg.length > SAFE_LOG_MAX ? `${msg.slice(0, SAFE_LOG_MAX)}…` : msg;
  console.error(`[${routeTag}]`, safe);
}

/** Map thrown errors to safe client JSON + HTTP status (no secrets in message). */
export function publicErrorFromCaught(
  err: unknown,
  fallbackMessage: string,
): { message: string; status: number } {
  if (err instanceof z.ZodError) {
    return { message: "Invalid request.", status: 400 };
  }
  const msg = err instanceof Error ? err.message : "";
  if (/GEMINI_API_KEY|Missing GEMINI|AI is not configured/i.test(msg)) {
    return {
      message:
        "AI is not configured. Add GEMINI_API_KEY to .env.local, or set GEMINI_MOCK=true for stub responses.",
      status: 503,
    };
  }
  if (/invalid JSON|unexpected shape|empty JSON response/i.test(msg)) {
    return {
      message: "The model returned data we could not use. Try again.",
      status: 502,
    };
  }
  return { message: fallbackMessage, status: 500 };
}
