// components/Newsletter.js
import { useEffect, useRef } from 'react';
import styles from '../styles/Newsletter.module.css';

export default function Newsletter() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!backgroundRef.current) return;
      
      const scrollPosition = window.scrollY;
      const newsletterSection = backgroundRef.current.parentElement;
      if (!newsletterSection) return;
      
      const sectionOffset = newsletterSection.offsetTop;
      const sectionHeight = newsletterSection.offsetHeight;
      
      if (scrollPosition > sectionOffset - window.innerHeight && 
          scrollPosition < sectionOffset + sectionHeight) {
        const scrollPercent = (scrollPosition - sectionOffset) / sectionHeight;
        const moveAmount = scrollPercent * 50;
        
        // Use background-position-x for horizontal movement only
        backgroundRef.current.style.backgroundPosition = `${moveAmount}% center`;
      }
    };
  
    // Add resize listener to handle window resizing
    const handleResize = () => {
      if (!backgroundRef.current) return;
      backgroundRef.current.style.backgroundSize = 'cover';
    };
  
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.newsletter}>
      <div ref={backgroundRef} className={styles.background} />
      <div className={styles.content}>
        <h2 className={styles.title}>Subscribe & Save</h2>
        <div className={styles.discount}>
          <span className={styles.percentage}>20%</span>
          <span className={styles.off}>Off</span>
        </div>
        <p className={styles.subtitle}>Your Next Order</p>
        <form className={styles.form}>
          <input type="email" placeholder="Email" className={styles.input} required />
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkbox} />
            Yes, subscribe me to your newsletter.
          </label>
          <button type="submit" className={styles.button}>Subscribe</button>
        </form>
      </div>
    </section>
  );
}