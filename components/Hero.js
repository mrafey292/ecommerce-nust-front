import { useState, useEffect } from 'react';
import styles from '../styles/Hero.module.css';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    image: 'https://academy-cdn.wedio.com/2022/01/guide-for-food-photography-wedio.jpg',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg',
  },
  {
    id: 3,
    image: 'https://uacreativestudios.com/wp-content/uploads/2016/04/HurierPhoto_April2016_LaughlinsBakery-7.jpg',
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
        <h1>Stock Up on Daily Essentials</h1>
        <h4>Save Big on Your Favorite Brands</h4>
        <Link href="/shop">
          <button className={styles.cta}>Shop Now</button>
        </Link>
      </div>
    </div>
  );
}
