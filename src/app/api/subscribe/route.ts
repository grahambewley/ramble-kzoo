import { NextRequest, NextResponse } from "next/server";
import { addSubscriber, normalizeRides } from "@/lib/subscribers";

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

  return NextResponse.json({ ok: true });
}
