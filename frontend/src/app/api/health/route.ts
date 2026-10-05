
import { NextResponse } from "next/server";
import type { HealthResponse } from "@/features/waitlist/types";

const WAITLIST_HEALTH_API_URL = process.env.WAITLIST_HEALTH_API_URL;

function errorResponse(status: number) {
  return NextResponse.json(
    {
      status: "error",
      uptime: 0,
      timestamp: new Date().toISOString(),
    } satisfies HealthResponse,
    { status },
  );
}

export async function GET() {
  if (!WAITLIST_HEALTH_API_URL) {
    console.error("WAITLIST_HEALTH_API_URL is not set");
    return errorResponse(500);
  }

  try {
    const upstream = await fetch(WAITLIST_HEALTH_API_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store", // health should always be live
      signal: AbortSignal.timeout(30_000),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok || !data) {
      return errorResponse(upstream.status || 502);
    }

    return NextResponse.json(data as HealthResponse, { status: 200 });
  } catch (err) {
    console.error("Health upstream error:", err);
    return errorResponse(502);
  }
}