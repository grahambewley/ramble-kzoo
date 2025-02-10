import styles from "./page.module.css";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { nextRideDate, nextRideTime, nextRideLocation } = publicRuntimeConfig;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.responsiveImage}>
          <Image src={"/bikes-and-coffee.png"} alt="Bikes and Coffee" layout="responsive" width={360} height={360} />
        </div>
        <div className={styles.buttonContainer}>
          <a href="https://www.strava.com/routes/3295424537735572606" className={styles.linkButton}>Strava Route</a>
        </div>
        <div className={styles.nextRide}>
          <h2>Next Ride</h2>
          <p>Date: {nextRideDate}</p>
          <p>Time: {nextRideTime}</p>
          <p>Meeting Location: {nextRideLocation}</p>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://instagram.com/graham.bewley">
          <FaInstagram size={24} />
        </a>
      </footer>
    </div>
  );
}
