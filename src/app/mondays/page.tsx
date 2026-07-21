import RideDetailPage from "../components/RideDetailPage";
import RideSignupForm from "../components/RideSignupForm";
import styles from "../components/RideDetailPage.module.css";
import { getUpcomingRides } from "@/lib/upcoming-rides";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mondays | The Ramble",
  description: "Un-serious trail ride at Al Sabo Nature Preserve. Monday evenings in Kalamazoo, MI.",
};

export default async function MondaysPage() {
  const rides = await getUpcomingRides();

  return (
    <RideDetailPage day="Mondays" subtitle="(Typically 1st and 3rd)" theme="dark" upcomingRide={rides.mondays}>
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          location_on
        </span>
        <div className={styles.detailContent}>
          <span>
            <strong>Al Sabo Nature Preserve</strong>
          </span>
          <span className={styles.detailSub}>
            Meet in the trailhead parking lot
          </span>
        </div>
      </div>
      <p>
        Al Sabo is an old school trail system, relatively flat save for a few
        punchy climbs, and can be ridden on almost any bike with the right
        attitude. Get your old Trek down from the rafters, or bring your gravel
        bike, or bring a real deal mountain bike. I probably wouldn&apos;t ride
        a &quot;road bike&quot; on these trails, but I wouldn&apos;t stop you
        either.
      </p>
      <p>
        Ride will take off from the trailhead parking lot. Routes TBD, around
        5–10 miles. No fancy clothes required. No drop.
      </p>
      <p>
        Post-ride, there are some restaurant/bars in Texas Corners that are
        accessible via the adjacent bike path if we&apos;re up for it.
      </p>
      <RideSignupForm defaultRides={["mondays"]} theme="dark" />
    </RideDetailPage>
  );
}
