"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import styles from "./RideSignupForm.module.css";
import type { RidePref } from "@/lib/subscribers";

interface RideSignupFormProps {
  /** Rides pre-selected when the form loads. */
  defaultRides: RidePref[];
  theme?: "dark" | "light";
  /** "banner" = sticky bottom bar (ride pages); "inline" = always-open form. */
  variant?: "banner" | "inline";
}

const RIDE_LABELS: Record<RidePref, string> = {
  mondays: "Mondays",
  thursdays: "Thursdays",
};

export default function RideSignupForm({
  defaultRides,
  theme = "dark",
  variant = "banner",
}: Readonly<RideSignupFormProps>) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");
  const [rides, setRides] = useState<Set<RidePref>>(new Set(defaultRides));
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => setMounted(true), []);

  function toggleRide(ride: RidePref) {
    setRides((prev) => {
      const next = new Set(prev);
      if (next.has(ride)) next.delete(ride);
      else next.add(ride);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, rides: Array.from(rides) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const noneSelected = rides.size === 0;

  const formFields = (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.checkboxRow}>
        {(Object.keys(RIDE_LABELS) as RidePref[]).map((ride) => (
          <label key={ride} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={rides.has(ride)}
              onChange={() => toggleRide(ride)}
            />
            {RIDE_LABELS[ride]}
          </label>
        ))}
      </div>

      <div className={styles.entryRow}>
        <input
          className={styles.input}
          type="tel"
          inputMode="numeric"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          aria-label="Phone number"
        />
        <button
          className={styles.submitButton}
          type="submit"
          disabled={status === "loading" || !phone.trim() || noneSelected}
        >
          {status === "loading" ? "…" : "Sign up"}
        </button>
      </div>

      {status === "error" && <p className={styles.errorMsg}>{errorMsg}</p>}

      <p className={styles.disclosure}>
        By signing up you agree to receive ride update texts from The Ramble.
        Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to
        unsubscribe.
      </p>
    </form>
  );

  const successRow = (
    <div className={styles.successRow}>
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontSize: "1.4rem" }}
      >
        check_circle
      </span>
      <span>You&apos;re on the list! Reply STOP anytime to opt out.</span>
    </div>
  );

  if (variant === "inline") {
    return (
      <div className={styles.inlineBox}>
        {status === "success" ? successRow : formFields}
      </div>
    );
  }

  const bannerClass = `${styles.banner} ${
    theme === "light" ? styles.bannerLight : styles.bannerDark
  }`;

  const banner = (
    <div className={bannerClass}>
      <div className={styles.inner}>
        {status === "success" ? (
          successRow
        ) : (
          <>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              <span className={styles.toggleLabel}>
                <span
                  className={`material-symbols-outlined ${styles.bellIcon}`}
                  aria-hidden="true"
                  style={{ fontSize: "1.2rem" }}
                >
                  notifications
                </span>
                Get text updates
              </span>
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: "1.4rem",
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              >
                expand_less
              </span>
            </button>

            {open && formFields}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      {mounted && createPortal(banner, document.body)}
    </>
  );
}
