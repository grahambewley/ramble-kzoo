import Link from "next/link";
import styles from "./RidePanel.module.css";

interface RidePanelProps {
  day: string;
  theme: "dark" | "light";
  tagline: string;
  href: string;
}

export default function RidePanel({
  day,
  theme,
  tagline,
  href,
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

      <span
        className={`${styles.hint} material-symbols-outlined`}
        aria-hidden="true"
      >
        touch_app
      </span>
    </Link>
  );
}
