import styles from "./page.module.css";
import RidePanel from "./components/RidePanel";

export default function Home() {
  return (
    <div className={styles.container}>
      <RidePanel
        day="Mondays"
        theme="dark"
        tagline="Un-serious trail ride. Run what ya brung."
        href="/mondays"
      />
      <RidePanel
        day="Thursdays"
        theme="light"
        tagline="Ramble around town. Beers after."
        href="/thursdays"
      />
    </div>
  );
}
