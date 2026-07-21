import { NextRequest, NextResponse } from "next/server";
import { getSubscribers, getSubscribersForRide } from "@/lib/subscribers";
import { sendSmsToSubscribers } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { secret, message, audience } = body;

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  const target =
    audience === "mondays" || audience === "thursdays" ? audience : "all";

  const subscribers =
    target === "all"
      ? await getSubscribers()
      : await getSubscribersForRide(target);

  if (subscribers.length === 0) {
    return NextResponse.json(
      { error: "No subscribers to send to." },
      { status: 400 }
    );
  }

  try {
    const { sent, failed, total } = await sendSmsToSubscribers(
      message,
      subscribers
    );
    return NextResponse.json({ ok: true, sent, failed, total });
  } catch {
    return NextResponse.json(
      { error: "Twilio is not configured." },
      { status: 500 }
    );
  }
}
