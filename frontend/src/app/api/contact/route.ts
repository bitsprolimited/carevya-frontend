import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
import { contactMessageSchema } from "@/lib/contact-schema";

const CONTACT_API_URL = process.env.CONTACT_API_URL ?? backendUrl("/contact");

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
    
      signal: AbortSignal.timeout(60_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("[contact] upstream error", upstream.status, detail);
      return NextResponse.json(
        { error: "We couldn't send your message. Please try again." },
        { status: upstream.status >= 500 ? 502 : upstream.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] upstream unreachable", err);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again." },
      { status: 502 },
    );
  }
}