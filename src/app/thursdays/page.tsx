import RideDetailPage from "../components/RideDetailPage";
import RideSignupForm from "../components/RideSignupForm";
import styles from "../components/RideDetailPage.module.css";
import { getUpcomingRides } from "@/lib/upcoming-rides";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thursdays | The Ramble",
  description: "Social road ride around Kalamazoo. Thursday evenings, beers after at Alley Cat.",
};

export default async function ThursdaysPage() {
  const rides = await getUpcomingRides();

  return (
    <RideDetailPage day="Thursdays" subtitle="(Typically 2nd and 4th)" theme="light" upcomingRide={rides.thursdays}>
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          location_on
        </span>
        <div className={styles.detailContent}>
          <span>
            <strong>Rotating Bars & Breweries</strong>
          </span>
          <span className={styles.detailSub}>Subject to change. See specific event details above.</span>
        </div>
      </div>
      <p>
        We&apos;ll meet downtown and go pedal for 10-15 miles. Conversational
        pace. There are some excellent roads just outside of town that we&apos;ll
        try to get out to if we can.
      </p>
      <p>Gather afterwards for a beer or two. Alley Cat is a favorite.</p>
      <RideSignupForm defaultRides={["thursdays"]} theme="light" />
    </RideDetailPage>
  );
}
