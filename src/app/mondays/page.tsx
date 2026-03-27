import RideDetailPage from "../components/RideDetailPage";
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
      <div className={styles.buttonRow}>
        <a href="sms:2482284611" className={styles.actionButton}>
          Text me (Graham)
        </a>
        <a
          href="https://www.instagram.com/graham.bewley/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionButton}
        >
          DM me
        </a>
      </div>
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          schedule
        </span>
        <div className={styles.detailContent}>
          <span>
            <strong>6 PM – 8 PM ish</strong>
          </span>
          <span className={styles.detailSub}>
            Restaurants nearby if we&apos;re keen
          </span>
        </div>
      </div>
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
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          calendar_month
        </span>
        <div className={styles.detailContent}>
          <span>April - ??</span>
          <span className={styles.detailSub}>
            Weather and trail conditions permitting
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
      <p>
        Don&apos;t be a stranger. If you&apos;re curious about the ride, I hope
        you reach out, feel free to shoot me a{" "}
        <a href="sms:2482284611" className={styles.inlineLink}>
          text
        </a>{" "}
        or{" "}
        <a
          href="https://www.instagram.com/graham.bewley/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.inlineLink}
        >
          DM
        </a>{" "}
        (I&apos;m Graham 👋)
      </p>
    </RideDetailPage>
  );
}
