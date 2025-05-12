import { useState, useEffect } from 'react';
import styles from '../styles/TopAlertBar.module.css';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function TopAlertBar() {
  const messages = [
    "Get 20% off your first order. Subscribe",
    "Shop on the go, download our app."
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <Link href="/about" className={styles.link}>About Us</Link>
        <Link href="/support" className={styles.link}>Customer Support</Link>
      </div>

      <div className={styles.center}>
        <div className={styles.messageContainer}>
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${styles.message} ${
                index === activeIndex ? styles.active : ''
              }`}
            >
              {message}
              {index === 1 && (
                <Link href="/app" className={styles.link}> Details</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <div className={styles.right}>
        <FaUserCircle size={20} />
        <Link href="/login" className={styles.link}>Log In</Link>
      </div> */}
    </div>
  );
}