import styles from "./page.module.css";
import RidePanel from "./components/RidePanel";
import { getUpcomingRides } from "@/lib/upcoming-rides";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rides = await getUpcomingRides();

  return (
    <div className={styles.container}>
      <RidePanel
        day="Mondays"
        theme="dark"
        tagline="Un-serious trail ride. Run what ya brung."
        href="/mondays"
        upcomingRideDate={rides.mondays?.date}
      />
      <RidePanel
        day="Thursdays"
        theme="light"
        tagline="Ramble around town. Beers after."
        href="/thursdays"
        upcomingRideDate={rides.thursdays?.date}
      />
    </div>
  );
}
