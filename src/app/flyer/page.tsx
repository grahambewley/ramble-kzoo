"use client";

import styles from "./page.module.css";

const SITE_URL = "https://ramblekzoo.com";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=4&data=${encodeURIComponent(SITE_URL)}`;

export default function FlyerPage() {
  return (
    <div className={styles.screenWrapper}>
      {/* Print button — hidden when printing */}
      <div className={styles.printBar}>
        <button className={styles.printButton} onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <div className={styles.flyer}>
        {/* ── Hero ── */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>BIKE RIDE</h1>
        </header>

        {/* ── Body ── */}
        <div className={styles.body}>
          <div className={styles.rideInfo}>
            <p className={styles.rideDay}>Mondays</p>
            <p className={styles.rideTimeLoc}>6PM &middot; Al Sabo</p>
            <p className={styles.rideTagline}>Un-serious trail ride</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.qr} src={QR_URL} alt="QR code" width={400} height={400} />
          <div className={styles.rideInfo}>
            <p className={styles.rideDay}>Thursdays</p>
            <p className={styles.rideTimeLoc}>6PM &middot; Downtown</p>
            <p className={styles.rideTagline}>Social ramble, refreshments</p>
          </div>
        </div>

        {/* ── Tear-off strips ── */}
        <div className={styles.tearOff}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.strip}>
              <div className={styles.stripInner}>
                <p className={styles.stripLine1}>Text Graham: 248-228-4611</p>
                <p className={styles.stripLine2}>ramblekzoo.com</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
