import styles from "./page.module.css";
import Image from "next/image";
import { FaInstagram, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { nextRideDate, nextRideTime, nextRideLocation, nextRideStravaRouteUrl, nextRideInfo } = publicRuntimeConfig;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.responsiveImage}>
          <Image src={"/bikes-and-coffee.png"} alt="Bikes and Coffee" layout="responsive" width={360} height={360} />
        </div>
        <div className={styles.nextRide}>
          <h2>Next Ride</h2>
          <p className={styles.helperText}>(typically every other Sunday)</p>
          <div className={styles.infoWrapper}>
            <FaCalendarAlt className={styles.icon} />
            <p>{nextRideDate}</p>
          </div>
          <div className={styles.infoWrapper}>
            <FaClock className={styles.icon} />
            <p>{nextRideTime}</p>
          </div>
          <div className={styles.infoWrapper}>
            <FaMapMarkerAlt className={styles.icon} />
            <p>{nextRideLocation}</p>
          </div>
          <div className={styles.infoWrapper}>
            <FaInfoCircle className={styles.icon} />
            <p>{nextRideInfo}</p>
          </div>
          <div className={styles.buttonContainer}>
            <a href={nextRideStravaRouteUrl} target="_blank" className={styles.linkButton}>Strava Route</a>
            <a href="https://strava.app.link/EOnnVuoUSQb" target="_blank" className={`${styles.linkButton} ${styles.outlineButton}`}>Join the Club!</a>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://instagram.com/graham.bewley">
          <FaInstagram size={30} />
        </a>
      </footer>
    </div>
  );
}
