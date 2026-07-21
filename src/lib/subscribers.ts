import { getStore } from "@netlify/blobs";

export type RidePref = "mondays" | "thursdays";

export const ALL_RIDES: RidePref[] = ["mondays", "thursdays"];

export interface Subscriber {
  phone: string; // E.164 format, e.g. "+12482284611"
  subscribedAt: string; // ISO date string
  rides: RidePref[]; // which rides this subscriber wants updates about
}

interface SubscriberData {
  subscribers: Subscriber[];
}

const STORE_NAME = "subscribers";
const KEY = "list";

/** Sanitize a rides array to a deduped subset of valid ride prefs. */
export function normalizeRides(raw: unknown): RidePref[] {
  if (!Array.isArray(raw)) return [];
  const set = new Set<RidePref>();
  for (const r of raw) {
    if (r === "mondays" || r === "thursdays") set.add(r);
  }
  return ALL_RIDES.filter((r) => set.has(r));
}

/**
 * Normalize a US phone number to E.164 format (+1XXXXXXXXXX).
 * Returns null if the input is not a valid 10-digit US number.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  // Accept 10 digits or 11 digits starting with 1
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(KEY, { type: "json" });
    if (!data) return [];
    const list = (data as SubscriberData).subscribers ?? [];
    // Legacy records predate ride preferences — treat them as subscribed to both.
    return list.map((s) => ({
      ...s,
      rides: s.rides && s.rides.length > 0 ? normalizeRides(s.rides) : [...ALL_RIDES],
    }));
  } catch {
    return [];
  }
}

/** Subscribers who opted into a given ride. */
export async function getSubscribersForRide(
  day: RidePref
): Promise<Subscriber[]> {
  const all = await getSubscribers();
  return all.filter((s) => s.rides.includes(day));
}

/** Counts of subscribers overall and per ride. */
export async function getSubscriberCounts(): Promise<{
  total: number;
  mondays: number;
  thursdays: number;
}> {
  const all = await getSubscribers();
  return {
    total: all.length,
    mondays: all.filter((s) => s.rides.includes("mondays")).length,
    thursdays: all.filter((s) => s.rides.includes("thursdays")).length,
  };
}

export async function addSubscriber(
  phone: string,
  rides: RidePref[]
): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return { ok: false, error: "Please enter a valid 10-digit US phone number." };
  }

  const normalizedRides = normalizeRides(rides);
  if (normalizedRides.length === 0) {
    return { ok: false, error: "Please choose at least one ride to hear about." };
  }

  const store = getStore(STORE_NAME);
  const existing = await getSubscribers();

  const match = existing.find((s) => s.phone === normalized);
  if (match) {
    const merged = normalizeRides([...match.rides, ...normalizedRides]);
    // Nothing new to add — surface a friendly message.
    if (merged.length === match.rides.length) {
      return { ok: false, error: "This number is already subscribed to those rides." };
    }
    const updated: SubscriberData = {
      subscribers: existing.map((s) =>
        s.phone === normalized ? { ...s, rides: merged } : s
      ),
    };
    await store.setJSON(KEY, updated);
    return { ok: true };
  }

  const updated: SubscriberData = {
    subscribers: [
      ...existing,
      {
        phone: normalized,
        subscribedAt: new Date().toISOString(),
        rides: normalizedRides,
      },
    ],
  };

  await store.setJSON(KEY, updated);
  return { ok: true };
}
