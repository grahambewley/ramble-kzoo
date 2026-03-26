import { NextRequest, NextResponse } from "next/server";
import { setUpcomingRide } from "@/lib/upcoming-rides";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { secret, day, date, details, clear } = body;

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
  return NextResponse.json({ ok: true });
}
