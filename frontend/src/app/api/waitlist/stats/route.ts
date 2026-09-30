
import { NextResponse } from "next/server";
import type { WaitlistStatsResponse } from "@/features/waitlist/types";

const WAITLIST_STATS_API_URL = process.env.WAITLIST_STATS_API_URL;

function errorResponse(status: number) {
  return NextResponse.json(
    {
      success: false,
      data: { careSeekers: 0, caregivers: 0, total: 0 },
      meta: { asOf: new Date().toISOString() },
    } satisfies WaitlistStatsResponse,
    { status },
  );
}

export async function GET() {
  if (!WAITLIST_STATS_API_URL) {
    console.error("WAITLIST_STATS_API_URL is not set");
    return errorResponse(500);
  }

  try {
    const upstream = await fetch(WAITLIST_STATS_API_URL, {
      headers: { Accept: "application/json" },
      // Counts don't need to be real-time; cache for a minute
      next: { revalidate: 60 },
      // Render free tier can take 30-60s to wake from sleep
      signal: AbortSignal.timeout(60_000),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok || !data?.success) {
      return errorResponse(upstream.status || 502);
    }

    return NextResponse.json(data as WaitlistStatsResponse, { status: 200 });
  } catch (err) {
    console.error("Waitlist stats upstream error:", err);
    return errorResponse(502);
  }
}