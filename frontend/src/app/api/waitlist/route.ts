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
      { status: 400 },
    );
  }

  const parsed = waitlistJoinSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid waitlist payload",
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
      { status: 400 },
    );
  }

  const response: WaitlistJoinResponse = {
    success: true,
    message: "You're on the CareVYA waitlist.",
    data: {
      id: crypto.randomUUID(),
      email: parsed.data.email,
      role: parsed.data.role,
      position: 501,
      referralCode: `CV-${parsed.data.email.slice(0, 3).toUpperCase()}501`,
      createdAt: new Date().toISOString(),
    },
    meta: {
      alreadyJoined: false,
      roleChanged: false,
    },
  };

  return NextResponse.json(response, { status: 201 });
}
