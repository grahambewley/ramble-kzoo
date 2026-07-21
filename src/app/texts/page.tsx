import Link from "next/link";
import RideSignupForm from "../components/RideSignupForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Text Updates | The Ramble",
  description: "Get a text when Ramble rides are coming up.",
};

export default function TextsPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.closeButton} aria-label="Back to home">
        ✕
      </Link>

      <h1 className={styles.header}>Text Updates</h1>
      <p className={styles.subtext}>
        Get a text when rides are coming up. We&apos;ll only text you about
        upcoming rides — nothing else.
      </p>

      <div className={styles.content}>
        <RideSignupForm
          defaultRides={["mondays", "thursdays"]}
          variant="inline"
        />
      </div>
    </div>
  );
}
