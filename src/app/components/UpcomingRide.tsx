import styles from "./UpcomingRide.module.css";
import type { RideData } from "@/lib/upcoming-rides";

interface UpcomingRideProps {
  ride: RideData | null;
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

export default function UpcomingRide({ ride }: UpcomingRideProps) {
  if (!ride) return null;

  const label = formatDate(ride.date);

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <span className={styles.pill}>Upcoming</span>
        <span className={styles.dateLabel}>{label}</span>
      </div>

      {ride.details && (
        <div className={styles.details}>{ride.details}</div>
      )}
    </div>
  );
}
