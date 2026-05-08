import { NextResponse } from "next/server";

export type RequestJsonResult =
  | { ok: true; data: unknown }
  | { ok: false; response: NextResponse };

export async function readJsonBody(req: Request): Promise<RequestJsonResult> {
  try {
    const data: unknown = await req.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      ),
    };
  }
}
