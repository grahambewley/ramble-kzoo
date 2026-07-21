"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "../page.module.css";

type Audience = "all" | "mondays" | "thursdays";
type RidePref = "mondays" | "thursdays";

interface Subscriber {
  phone: string;
  subscribedAt: string;
  rides: RidePref[];
}

interface SubscriberCounts {
  total: number;
  mondays: number;
  thursdays: number;
}

function pluralSubs(n: number): string {
  return `${n} subscriber${n === 1 ? "" : "s"}`;
}

function failedSuffix(failed: number): string {
  return failed ? ` ${failed} failed.` : "";
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length !== 10) return phone;
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminTextsPage() {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState("");
  const [counts, setCounts] = useState<SubscriberCounts | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);

  const fetchSubscribers = useCallback(async (s: string) => {
    if (!s) {
      setCounts(null);
      setSubscribers(null);
      return;
    }
    try {
      const res = await fetch(`/api/subscribers?secret=${encodeURIComponent(s)}`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts ?? null);
        setSubscribers(data.subscribers ?? []);
      } else {
        setCounts(null);
        setSubscribers(null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchSubscribers(secret), 500);
    return () => clearTimeout(timeout);
  }, [secret, fetchSubscribers]);

  let audienceCount: number | null = null;
  if (counts) {
    audienceCount = audience === "all" ? counts.total : counts[audience];
  }

  async function sendText() {
    setStatus("loading");
    setResult("");
    try {
      const res = await fetch("/api/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, message, audience }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setResult(data.error || "Something went wrong.");
      } else {
        setStatus("success");
        setResult(`Sent to ${pluralSubs(data.sent)}.${failedSuffix(data.failed)}`);
        setMessage("");
      }
    } catch {
      setStatus("error");
      setResult("Network error.");
    }
  }

  let sendButtonLabel = "Send";
  if (status === "loading") sendButtonLabel = "Sending…";
  else if (audienceCount !== null) sendButtonLabel = `Send to ${audienceCount}`;

  return (
    <div className={styles.page}>
      <Link href="/admin" className={styles.navLink}>
        ← Upcoming rides
      </Link>

      <h1 className={styles.title}>Send Text</h1>
      <p className={styles.intro}>
        Send a group text to your subscribers.
        {counts !== null && (
          <> <strong>{counts.total}</strong> total · <strong>{counts.mondays}</strong> Mondays · <strong>{counts.thursdays}</strong> Thursdays.</>
        )}
      </p>

      <section className={styles.section}>
        <label className={styles.label}>
          Admin password
          <input
            className={styles.input}
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <label className={styles.label}>
          Send to
          <select
            className={styles.input}
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
          >
            <option value="all">Everyone</option>
            <option value="mondays">Mondays subscribers</option>
            <option value="thursdays">Thursdays subscribers</option>
          </select>
        </label>

        <label className={styles.label}>
          Message
          <textarea
            className={styles.textarea}
            value={message}
            rows={4}
            placeholder="Monday ride is ON! Meet at Al Sabo at 6 PM."
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <div className={styles.buttonRow}>
          <button
            className={styles.saveButton}
            disabled={status === "loading" || !message.trim() || !secret}
            onClick={sendText}
          >
            {sendButtonLabel}
          </button>
        </div>

        {result && (
          <p className={status === "error" ? styles.errorMsg : styles.successMsg}>
            {result}
          </p>
        )}
      </section>

      <h1 className={styles.title} style={{ marginTop: "2.5rem" }}>Subscribers</h1>
      <p className={styles.intro}>
        Enter your admin password above to load the list.
      </p>

      <section className={styles.section}>
        {!secret && <p className={styles.intro} style={{ margin: 0 }}>Locked.</p>}
        {secret && subscribers === null && (
          <p className={styles.intro} style={{ margin: 0 }}>Loading…</p>
        )}
        {secret && subscribers !== null && subscribers.length === 0 && (
          <p className={styles.intro} style={{ margin: 0 }}>No subscribers yet.</p>
        )}
        {subscribers && subscribers.length > 0 && (
          <ul className={styles.subList}>
            {subscribers.map((sub) => (
              <li key={sub.phone} className={styles.subRow}>
                <div>
                  <span className={styles.subPhone}>{formatPhone(sub.phone)}</span>
                  <span className={styles.subMeta}>
                    Joined {formatDate(sub.subscribedAt)}
                  </span>
                </div>
                <div className={styles.rideTags}>
                  {sub.rides.includes("mondays") && (
                    <span className={styles.rideTag}>Mon</span>
                  )}
                  {sub.rides.includes("thursdays") && (
                    <span className={styles.rideTag}>Thu</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
