import { NextRequest, NextResponse } from "next/server";
import { getSubscribers } from "@/lib/subscribers";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await getSubscribers();

  return NextResponse.json({
    count: subscribers.length,
    counts: {
      total: subscribers.length,
      mondays: subscribers.filter((s) => s.rides.includes("mondays")).length,
      thursdays: subscribers.filter((s) => s.rides.includes("thursdays")).length,
    },
    subscribers,
  });
}
