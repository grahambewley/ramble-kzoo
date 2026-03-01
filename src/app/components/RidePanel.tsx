"use client";

import { useState } from "react";
import styles from "./RidePanel.module.css";

interface RidePanelProps {
  day: string;
  theme: "dark" | "light";
  tagline: string;
  expandedDetails: React.ReactNode;
}

export default function RidePanel({
  day,
  theme,
  tagline,
  expandedDetails,
}: RidePanelProps) {
  const [expanded, setExpanded] = useState(false);

  const themeClass =
    theme === "dark" ? styles.panelDark : styles.panelLight;

  return (
    <div
      className={`${styles.panel} ${themeClass} ${
        expanded ? styles.expanded : styles.collapsed
      }`}
      onClick={!expanded ? () => setExpanded(true) : undefined}
      role={!expanded ? "button" : undefined}
      tabIndex={!expanded ? 0 : undefined}
      onKeyDown={
        !expanded
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded(true);
              }
            }
          : undefined
      }
    >
      {expanded && (
        <button
          className={styles.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          aria-label="Close"
        >
          ✕
        </button>
      )}

      <h1 className={styles.header}>{day}</h1>

      {!expanded && (
        <>
          <div className={styles.tagline}>
            {tagline.split('. ').filter(Boolean).map((sentence, i) => (
              <p key={i}>{sentence.endsWith('.') ? sentence : `${sentence}.`}</p>
            ))}
          </div>

          <span className={`${styles.hint} material-symbols-outlined`} aria-hidden="true">touch_app</span>
        </>
      )}

      {expanded && (
        <div className={styles.expandedContent}>{expandedDetails}</div>
      )}
    </div>
  );
}
