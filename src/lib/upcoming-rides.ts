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

function isUpcoming(dateStr: string): boolean {
  const rideDate = new Date(dateStr + "T23:59:59");
  return rideDate >= new Date();
}

export async function getUpcomingRides(): Promise<UpcomingRides> {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(KEY, { type: "json" });
    if (!data) return { mondays: null, thursdays: null };
    const rides = data as UpcomingRides;
    return {
      mondays: rides.mondays && isUpcoming(rides.mondays.date) ? rides.mondays : null,
      thursdays: rides.thursdays && isUpcoming(rides.thursdays.date) ? rides.thursdays : null,
    };
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
