import { NextResponse } from "next/server";
import { z } from "zod";
import { getTopicById, type CourseTopic } from "@/data/courseTopics";
import {
  logRouteError,
  publicErrorFromCaught,
} from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";

type Handler = (body: unknown) => Promise<NextResponse>;

export function withGeminiRoute(
  routeTag: string,
  fallbackErrorMessage: string,
  handler: Handler,
) {
  return async function POST(req: Request) {
    const json = await readJsonBody(req);
    if (!json.ok) return json.response;
    try {
      return await handler(json.data);
    } catch (err) {
      logRouteError(routeTag, err);
      if (err instanceof z.ZodError) {
        const issue = err.issues[0];
        const path = issue?.path.join(".");
        const message =
          issue?.message && path
            ? `${path}: ${issue.message}`
            : issue?.message ?? "Invalid request.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
      const { message, status } = publicErrorFromCaught(
        err,
        fallbackErrorMessage,
      );
      return NextResponse.json({ error: message }, { status });
    }
  };
}

/**
 * Resolves a topic id to its catalog meta. Returns the raw id (no meta) when
 * the id is unknown so prompts still receive the text the client sent.
 */
export function resolveTopic(
  topicId: string | undefined | null,
): { id: string; meta?: CourseTopic } | undefined {
  const id = typeof topicId === "string" ? topicId.trim() : "";
  if (!id) return undefined;
  return { id, meta: getTopicById(id) };
}
