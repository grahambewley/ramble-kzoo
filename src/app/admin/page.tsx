"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Day = "mondays" | "thursdays";
type Tab = "rides" | "texts";
type Audience = "all" | "mondays" | "thursdays";
type RidePref = "mondays" | "thursdays";

interface DayFormState {
  date: string;
  details: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;
  notify: boolean;
  notifyMessage: string;
}

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

function defaultState(): DayFormState {
  return {
    date: "",
    details: "",
    status: "idle",
    message: "",
    notify: false,
    notifyMessage: "",
  };
}

function pluralSubs(n: number): string {
  return `${n} subscriber${n === 1 ? "" : "s"}`;
}

function failedSuffix(failed: number): string {
  return failed ? ` ${failed} failed.` : "";
}

function buildSaveMessage(
  clear: boolean,
  notified?: { sent: number; failed: number }
): string {
  if (clear) return "Cleared.";
  if (notified) return `Saved. Texted ${pluralSubs(notified.sent)}.${failedSuffix(notified.failed)}`;
  return "Saved.";
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

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("rides");

  const [mondays, setMondays] = useState<DayFormState>(defaultState());
  const [thursdays, setThursdays] = useState<DayFormState>(defaultState());

  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [unlockStatus, setUnlockStatus] = useState<"idle" | "loading" | "error">("idle");
  const [unlockError, setUnlockError] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState("");
  const [counts, setCounts] = useState<SubscriberCounts | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);

  const setter = (day: Day) => (day === "mondays" ? setMondays : setThursdays);
  const state = (day: Day) => (day === "mondays" ? mondays : thursdays);

  async function unlock() {
    if (!secret) return;
    setUnlockStatus("loading");
    setUnlockError("");
    try {
      const res = await fetch(`/api/subscribers?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts ?? null);
        setSubscribers(data.subscribers ?? []);
        setUnlocked(true);
        setUnlockStatus("idle");
      } else {
        setUnlockStatus("error");
        setUnlockError("Incorrect password.");
      }
    } catch {
      setUnlockStatus("error");
      setUnlockError("Network error.");
    }
  }

  let audienceCount: number | null = null;
  if (counts) {
    audienceCount = audience === "all" ? counts.total : counts[audience];
  }

  async function submit(day: Day, clear = false) {
    const s = state(day);
    setter(day)((prev) => ({ ...prev, status: "loading", message: "" }));

    try {
      const res = await fetch("/api/update-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          day,
          date: clear ? undefined : s.date,
          details: clear ? undefined : s.details,
          clear,
          notify: clear ? false : s.notify,
          notifyMessage: clear ? undefined : s.notifyMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setter(day)((prev) => ({
          ...prev,
          status: "error",
          message: data.error || "Something went wrong.",
        }));
      } else {
        const notified = data.notified as
          | { sent: number; failed: number }
          | undefined;
        const savedMsg = buildSaveMessage(clear, notified);
        setter(day)((prev) => ({
          ...prev,
          status: "success",
          message: savedMsg,
          date: clear ? "" : prev.date,
          details: clear ? "" : prev.details,
          notify: false,
          notifyMessage: clear ? "" : prev.notifyMessage,
        }));
      }
    } catch {
      setter(day)((prev) => ({
        ...prev,
        status: "error",
        message: "Network error.",
      }));
    }
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

  function renderForm(day: Day, label: string) {
    const s = state(day);
    const set = setter(day);

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{label}</h2>

        <label className={styles.label}>
          Ride date
          <input
            className={styles.input}
            type="date"
            value={s.date}
            onChange={(e) => set((p) => ({ ...p, date: e.target.value }))}
          />
        </label>

        <label className={styles.label}>
          Details <span className={styles.optional}>(optional)</span>
          <textarea
            className={styles.textarea}
            value={s.details}
            rows={4}
            placeholder="Any notes about the ride — route, conditions, special instructions…"
            onChange={(e) => set((p) => ({ ...p, details: e.target.value }))}
          />
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={s.notify}
            onChange={(e) => set((p) => ({ ...p, notify: e.target.checked }))}
          />
          Text {label} subscribers when I save
        </label>

        {s.notify && (
          <label className={styles.label}>
            Text message
            <textarea
              className={styles.textarea}
              value={s.notifyMessage}
              rows={3}
              placeholder={`${label.slice(0, -1)} ride is on! Meet at 6 PM.`}
              onChange={(e) => set((p) => ({ ...p, notifyMessage: e.target.value }))}
            />
          </label>
        )}

        <div className={styles.buttonRow}>
          <button
            className={styles.saveButton}
            disabled={
              s.status === "loading" ||
              !s.date ||
              !secret ||
              (s.notify && !s.notifyMessage.trim())
            }
            onClick={() => submit(day)}
          >
            {s.status === "loading" ? "Saving…" : "Save"}
          </button>
          <button
            className={styles.clearButton}
            disabled={s.status === "loading" || !secret}
            onClick={() => submit(day, true)}
          >
            Clear
          </button>
        </div>

        {s.message && (
          <p
            className={
              s.status === "error" ? styles.errorMsg : styles.successMsg
            }
          >
            {s.message}
          </p>
        )}
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin</h1>

      {!unlocked && (
        <div className={styles.lockBar}>
          <label className={styles.label}>
            Admin password
            <input
              className={styles.input}
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && unlock()}
              autoComplete="current-password"
              placeholder="Enter to unlock"
            />
          </label>
          <button
            className={styles.saveButton}
            disabled={unlockStatus === "loading" || !secret}
            onClick={unlock}
          >
            {unlockStatus === "loading" ? "Unlocking…" : "Unlock"}
          </button>
          {unlockError && <p className={styles.errorMsg}>{unlockError}</p>}
        </div>
      )}

      <div
        className={unlocked ? undefined : styles.locked}
        aria-hidden={!unlocked}
      >
        <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "rides"}
          className={`${styles.tab} ${tab === "rides" ? styles.tabActive : ""}`}
          onClick={() => setTab("rides")}
        >
          Upcoming rides
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "texts"}
          className={`${styles.tab} ${tab === "texts" ? styles.tabActive : ""}`}
          onClick={() => setTab("texts")}
        >
          Text subscribers
        </button>
      </div>

      {tab === "rides" && (
        <>
          <p className={styles.intro}>
            Set the date (and optional details) for an upcoming ride. The
            indicator auto-disappears after the ride date passes.
          </p>
          {renderForm("mondays", "Mondays")}
          {renderForm("thursdays", "Thursdays")}
        </>
      )}

      {tab === "texts" && (
        <>
          <p className={styles.intro}>
            Send a group text to your subscribers.
            {counts !== null && (
              <> <strong>{counts.total}</strong> total · <strong>{counts.mondays}</strong> Mondays · <strong>{counts.thursdays}</strong> Thursdays.</>
            )}
          </p>

          <section className={styles.section}>
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

          <h2 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
            Subscribers
          </h2>
          <section className={styles.section}>
            {!secret && <p className={styles.intro} style={{ margin: 0 }}>Enter your admin password above to load the list.</p>}
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
        </>
      )}
      </div>
    </div>
  );
}
