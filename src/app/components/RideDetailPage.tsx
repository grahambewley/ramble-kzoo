import Link from "next/link";
import styles from "./RideDetailPage.module.css";
import UpcomingRide from "./UpcomingRide";
import type { RideData } from "@/lib/upcoming-rides";

interface RideDetailPageProps {
  day: string;
  subtitle?: string;
  theme: "dark" | "light";
  children: React.ReactNode;
  upcomingRide?: RideData | null;
}

export default function RideDetailPage({
  day,
  subtitle,
  theme,
  children,
  upcomingRide,
}: Readonly<RideDetailPageProps>) {
  const themeClass = theme === "dark" ? styles.pageDark : styles.pageLight;

  return (
    <div className={`${styles.page} ${themeClass}`}>
      <Link href="/" className={styles.closeButton} aria-label="Back to home">
        ✕
      </Link>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <h1 className={styles.header}>{day}</h1>

      <div className={styles.content}>
        <UpcomingRide ride={upcomingRide ?? null} />
        {children}
      </div>
    </div>
  );
}
