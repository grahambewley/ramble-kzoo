import { getStore } from "@netlify/blobs";

export interface RideData {
  date: string; // ISO date string, e.g. "2026-03-30"
  details?: string;
}

export interface UpcomingRides {
  mondays: RideData | null;
  thursdays: RideData | null;
}

const STORE_NAME = "upcoming-rides";
const KEY = "rides";

export async function getUpcomingRides(): Promise<UpcomingRides> {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(KEY, { type: "json" });
    if (!data) return { mondays: null, thursdays: null };
    return data as UpcomingRides;
  } catch {
    return { mondays: null, thursdays: null };
  }
}

export async function setUpcomingRide(
  day: "mondays" | "thursdays",
  ride: RideData | null
): Promise<void> {
  const store = getStore(STORE_NAME);
  const current = await getUpcomingRides();
  const updated: UpcomingRides = { ...current, [day]: ride };
  await store.setJSON(KEY, updated);
}
