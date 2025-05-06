import styles from '../styles/Newsletter.module.css';
import React, { useState } from 'react';

export default function Newsletter() {
  return (
    <section className={styles.newsletterSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Stay Updated</h2>
          <p className={styles.subtitle}>Subscribe to our newsletter for the latest updates and offers</p>
          <form className={styles.form}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className={styles.input}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Subscribe
            </button>
          </form>
          <p className={styles.privacyNote}>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}