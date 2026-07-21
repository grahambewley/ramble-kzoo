import styles from "./UpcomingRide.module.css";
import type { RideData } from "@/lib/upcoming-rides";

interface UpcomingRideProps {
  ride: RideData | null;
  theme?: "dark" | "light";
}

function formatDate(dateStr: string): string {
  // e.g. "Monday, March 30"
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function UpcomingRide({ ride, theme = "dark" }: Readonly<UpcomingRideProps>) {
  const label = ride ? formatDate(ride.date) : "No upcoming rides scheduled, check back later";
  const detailsClass = `${styles.details} ${theme === "light" ? styles.detailsLight : ""}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <span className={styles.pill}>Upcoming</span>
        <span className={styles.dateLabel}>{label}</span>
      </div>

      {ride?.details && (
        <div className={detailsClass}>{ride.details}</div>
      )}
    </div>
  );
}
