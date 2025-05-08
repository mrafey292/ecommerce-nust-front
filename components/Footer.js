// components/Footer.js
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="/strategic" className={styles.footerLink}>Strategic & Returns</a>
          <a href="/terms" className={styles.footerLink}>Terms & Conditions</a>
          <a href="/payment" className={styles.footerLink}>Payment Methods</a>
        </div>

        <div className={styles.paymentSection}>
          <p className={styles.paymentText}>We accept the following payment methods</p>
          <div className={styles.paymentLogos}>
            <div className={styles.paymentLogo}>POWER</div>
            <div className={styles.paymentLogo}>BACKUP</div>
            <div className={styles.paymentLogo}>VISA</div>
            <div className={styles.paymentLogo}>RISING</div>
          </div>
        </div>

        <div className={styles.copyright}>
          <span>0.205 by Clovers, Powered and secured by Xliz.</span>
        </div>
      </div>
    </footer>
  );
}