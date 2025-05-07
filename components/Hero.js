import { useState, useEffect } from 'react';
import styles from '../styles/Hero.module.css';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    image: '/imagesPull/hero1.jpg', // Note the leading slash
  },
  {
    id: 2,
    image: '/imagesPull/hero2.jpg', // Note the leading slash
  },
  {
    id: 3,
    image: '/imagesPull/hero3.jpg', // Note the leading slash
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroContainer}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === current ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      <div className={styles.overlay}>
        <h3>Easy, Fresh & Convenient</h3>
        <h1>Stock Up on <br/>
          Daily Essentials</h1>
        <h4>Save Big on Your <br/>
           Favorite Brands</h4>
        <Link href="/shop">
          <button className={styles.cta}>Shop Now</button>
        </Link>
      </div>
    </div>
  );
}



