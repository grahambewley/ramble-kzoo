import { NextRequest, NextResponse } from "next/server";
import { setUpcomingRide } from "@/lib/upcoming-rides";
import { getSubscribersForRide } from "@/lib/subscribers";
import { sendSmsToSubscribers } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { secret, day, date, details, clear, notify, notifyMessage } = body;

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (day !== "mondays" && day !== "thursdays") {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  if (clear) {
    await setUpcomingRide(day, null);
    return NextResponse.json({ ok: true, cleared: true });
  }

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  await setUpcomingRide(day, { date, details: details || undefined });

  if (notify) {
    if (!notifyMessage || typeof notifyMessage !== "string" || !notifyMessage.trim()) {
      return NextResponse.json(
        { error: "A notification message is required to notify subscribers." },
        { status: 400 }
      );
    }
    const subscribers = await getSubscribersForRide(day);
    if (subscribers.length === 0) {
      return NextResponse.json({ ok: true, notified: { sent: 0, failed: 0, total: 0 } });
    }
    try {
      const result = await sendSmsToSubscribers(notifyMessage, subscribers);
      return NextResponse.json({ ok: true, notified: result });
    } catch {
      return NextResponse.json(
        { error: "Ride saved, but Twilio is not configured, so no texts were sent." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
