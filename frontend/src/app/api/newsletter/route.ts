import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend";
import { newsletterSchema } from "@/lib/newsletter-schema";

const NEWSLETTER_API_URL =
  process.env.NEWSLETTER_API_URL ?? backendUrl("/newsletter");

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(NEWSLETTER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(60_000),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("[newsletter] upstream error", upstream.status, detail);
      return NextResponse.json(
        { error: "We couldn't subscribe you right now. Please try again." },
        { status: upstream.status >= 500 ? 502 : upstream.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] upstream unreachable", err);
    return NextResponse.json(
      { error: "We couldn't subscribe you right now. Please try again." },
      { status: 502 },
    );
  }
}