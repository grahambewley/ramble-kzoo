import Link from "next/link";
import styles from "./RideDetailPage.module.css";

interface RideDetailPageProps {
  day: string;
  theme: "dark" | "light";
  children: React.ReactNode;
}

export default function RideDetailPage({
  day,
  theme,
  children,
}: Readonly<RideDetailPageProps>) {
  const themeClass = theme === "dark" ? styles.pageDark : styles.pageLight;

  return (
    <div className={`${styles.page} ${themeClass}`}>
      <Link href="/" className={styles.closeButton} aria-label="Back to home">
        ✕
      </Link>

      <h1 className={styles.header}>{day}</h1>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
