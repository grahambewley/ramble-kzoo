"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type Day = "mondays" | "thursdays";

interface DayFormState {
  date: string;
  details: string;
  secret: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;
  notify: boolean;
  notifyMessage: string;
}

function defaultState(): DayFormState {
  return {
    date: "",
    details: "",
    secret: "",
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

export default function AdminPage() {
  const [mondays, setMondays] = useState<DayFormState>(defaultState());
  const [thursdays, setThursdays] = useState<DayFormState>(defaultState());

  const setter = (day: Day) => (day === "mondays" ? setMondays : setThursdays);
  const state = (day: Day) => (day === "mondays" ? mondays : thursdays);

  async function submit(day: Day, clear = false) {
    const s = state(day);
    setter(day)((prev) => ({ ...prev, status: "loading", message: "" }));

    try {
      const res = await fetch("/api/update-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: s.secret,
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

  function renderForm(day: Day, label: string) {
    const s = state(day);
    const set = setter(day);

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{label}</h2>

        <label className={styles.label}>
          Admin password
          <input
            className={styles.input}
            type="password"
            value={s.secret}
            onChange={(e) => set((p) => ({ ...p, secret: e.target.value }))}
            autoComplete="current-password"
          />
        </label>

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
              !s.secret ||
              (s.notify && !s.notifyMessage.trim())
            }
            onClick={() => submit(day)}
          >
            {s.status === "loading" ? "Saving…" : "Save"}
          </button>
          <button
            className={styles.clearButton}
            disabled={s.status === "loading" || !s.secret}
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
      <h1 className={styles.title}>Upcoming Rides</h1>
      <p className={styles.intro}>
        Set the date (and optional details) for an upcoming ride. The indicator
        auto-disappears after the ride date passes.
      </p>
      {renderForm("mondays", "Mondays")}
      {renderForm("thursdays", "Thursdays")}

      <Link href="/admin/texts" className={styles.navLink} style={{ marginTop: "1rem" }}>
        Send a text &amp; view subscribers →
      </Link>
    </div>
  );
}
