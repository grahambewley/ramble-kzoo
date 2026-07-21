import { NextRequest, NextResponse } from "next/server";
import { addSubscriber, normalizeRides } from "@/lib/subscribers";
import { sendSms } from "@/lib/twilio";

const CONFIRMATION_MESSAGE =
  "The Ramble: You're subscribed to ride updates. Msg & data rates may apply. Msg frequency varies. Reply STOP to unsubscribe, HELP for help.";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, rides } = body;

  if (!phone || typeof phone !== "string") {
    return NextResponse.json(
      { error: "Phone number is required." },
      { status: 400 }
    );
  }

  const normalizedRides = normalizeRides(rides);
  if (normalizedRides.length === 0) {
    return NextResponse.json(
      { error: "Please choose at least one ride to hear about." },
      { status: 400 }
    );
  }

  const result = await addSubscriber(phone, normalizedRides);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Send a one-time confirmation to brand-new subscribers. Never block signup
  // if Twilio is unconfigured or the send fails.
  if (result.created && result.phone) {
    try {
      await sendSms(result.phone, CONFIRMATION_MESSAGE);
    } catch {
      /* signup already saved; confirmation is best-effort */
    }
  }

  return NextResponse.json({ ok: true });
}
