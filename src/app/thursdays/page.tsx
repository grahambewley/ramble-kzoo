import RideDetailPage from "../components/RideDetailPage";
import styles from "../components/RideDetailPage.module.css";

export const metadata = {
  title: "Thursdays | The Ramble",
  description: "Social road ride around Kalamazoo. Thursday evenings, beers after at Alley Cat.",
};

export default function ThursdaysPage() {
  return (
    <RideDetailPage day="Thursdays" theme="light">
      <p>
        <em>Social road ride around Kalamazoo. No drop.</em>
      </p>
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
          <span className={styles.detailSub}>Drinks after at Alley Cat</span>
        </div>
      </div>
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          location_on
        </span>
        <div className={styles.detailContent}>
          <span>
            <strong>Alley Cat, Downtown Kalamazoo</strong>
          </span>
          <span className={styles.detailSub}>Meet out front</span>
        </div>
      </div>
      <div className={styles.detailRow}>
        <span className="material-symbols-outlined" aria-hidden="true">
          calendar_month
        </span>
        <div className={styles.detailContent}>
          <span>March - ??</span>
          <span className={styles.detailSub}>Weather permitting</span>
        </div>
      </div>
      <p>
        We&apos;ll meet downtown and go pedal for 10-15 miles. Conversational
        pace. There are some excellent roads just outside of town that we&apos;ll
        try to get out to if we can.
      </p>
      <p>Gather afterwards for a beer or two. Alley Cat is a favorite.</p>
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
