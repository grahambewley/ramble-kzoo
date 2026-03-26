import Link from "next/link";
import styles from "./RidePanel.module.css";

interface RidePanelProps {
  day: string;
  theme: "dark" | "light";
  tagline: string;
  href: string;
  upcomingRideDate?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function RidePanel({
  day,
  theme,
  tagline,
  href,
  upcomingRideDate,
}: Readonly<RidePanelProps>) {
  const themeClass = theme === "dark" ? styles.panelDark : styles.panelLight;

  return (
    <Link href={href} className={`${styles.panel} ${themeClass}`}>
      <h1 className={styles.header}>{day}</h1>

      <div className={styles.tagline}>
        {tagline
          .split(". ")
          .filter(Boolean)
          .map((sentence) => (
            <p key={sentence}>
              {sentence.endsWith(".") ? sentence : `${sentence}.`}
            </p>
          ))}
      </div>

      {upcomingRideDate && (
        <span className={styles.upcomingBadge}>
          Upcoming · {formatDate(upcomingRideDate)}
        </span>
      )}

      <span
        className={`${styles.hint} material-symbols-outlined`}
        aria-hidden="true"
      >
        touch_app
      </span>
    </Link>
  );
}
