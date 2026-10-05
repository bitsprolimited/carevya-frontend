
import { NextResponse } from "next/server";
import {
  waitlistJoinSchema,
  type WaitlistJoinResponse,
} from "@/features/waitlist/types";

const WAITLIST_API_URL = process.env.WAITLIST_API_URL;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: {
        id: "",
        email: "",
        role: "",
        position: 0,
        referralCode: "",
        createdAt: "",
      },
      meta: { alreadyJoined: false, roleChanged: false },
    } satisfies WaitlistJoinResponse,
    { status },
  );
}

export async function POST(request: Request) {
  if (!WAITLIST_API_URL) {
    console.error("WAITLIST_API_URL is not set");
    return errorResponse("Server is not configured correctly.", 500);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = waitlistJoinSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? "Invalid waitlist payload",
      400,
    );
  }

  try {
    const upstream = await fetch(WAITLIST_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      // Render free tier can take 30-60s to wake from sleep
      signal: AbortSignal.timeout(60_000),
    });

    const data = await upstream.json().catch(() => null);

    if (upstream.status === 429) {
      return errorResponse(
        "Too many attempts. Please wait a bit and try again.",
        429,
      );
    }

    if (!upstream.ok || !data) {
      return errorResponse(
        data?.message ?? "Could not join the waitlist. Please try again.",
        upstream.status || 502,
      );
    }

    // Backend already returns the WaitlistJoinResponse shape.
    // 200 = success (including idempotent re-joins)
    return NextResponse.json(data as WaitlistJoinResponse, {
      status: upstream.status,
    });
  } catch (err) {
    console.error("Waitlist upstream error:", err);
    return errorResponse("Unable to reach the server. Please try again.", 502);
  }
}