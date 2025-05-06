import styles from '../styles/TopAlertBar.module.css';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function TopAlertBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.link}><Link href="/about">About Us</Link></span>
        <span className={styles.link}><Link href="/support">Customer Support</Link></span>
      </div>

      <div className={styles.center}>
        <span>Get 20% off your first order. Subscribe</span> | 
        <span> Shop on the go, download our app. <span className={styles.link}><Link href="/app">Details</Link></span></span>
      </div>

      <div className={styles.right}>
        <FaUserCircle size={20} />
        <span className={styles.link}><Link href="/login">Log In</Link></span>
      </div>
    </div>
  );
}
