import { NextResponse } from "next/server";
import {
  waitlistJoinSchema,
  type WaitlistJoinResponse,
} from "@/features/waitlist/types";

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON body",
      } satisfies WaitlistJoinResponse,
      { status: 400 },
    );
  }

  const parsed = waitlistJoinSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid waitlist payload",
      } satisfies WaitlistJoinResponse,
      { status: 400 },
    );
  }

  const { email, role } = parsed.data;

  const response: WaitlistJoinResponse = {
    success: true,
    message: "You're on the CareVYA waitlist.",
    data: {
      id: crypto.randomUUID(),
      email,
      role,
      position: 501, // placeholder until this is backed by the real API
      referralCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    },
    meta: {
      alreadyJoined: false,
      roleChanged: false,
    },
  };

  return NextResponse.json(response, { status: 201 });
}