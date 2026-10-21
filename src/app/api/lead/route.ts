import { NextResponse } from "next/server";

// Forwards form leads to Make, with retries so a brief Make outage doesn't lose a lead.
const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ?? "https://hook.us1.make.com/9110qw7dfnci2cnut8fgn3o4max061xk";

const ATTEMPTS = 3;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.mobile) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error(`[lead] Make returned ${res.status} (attempt ${attempt})`);
    } catch (err) {
      console.error(`[lead] Make request failed (attempt ${attempt})`, err);
    }
    if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 500 * attempt));
  }

  // Last resort: keep the lead in the Vercel logs so it can be recovered by hand.
  console.error("[lead] UNDELIVERED LEAD", JSON.stringify(body));
  return NextResponse.json({ ok: false, error: "upstream failed" }, { status: 502 });
}
