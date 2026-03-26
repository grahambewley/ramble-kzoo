"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Day = "mondays" | "thursdays";

interface DayFormState {
  date: string;
  details: string;
  secret: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

function defaultState(): DayFormState {
  return { date: "", details: "", secret: "", status: "idle", message: "" };
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
        setter(day)((prev) => ({
          ...prev,
          status: "success",
          message: clear ? "Cleared." : "Saved.",
          date: clear ? "" : prev.date,
          details: clear ? "" : prev.details,
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

        <div className={styles.buttonRow}>
          <button
            className={styles.saveButton}
            disabled={s.status === "loading" || !s.date || !s.secret}
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
    </div>
  );
}
