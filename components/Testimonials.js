import styles from '../styles/Testimonials.module.css';
import React, { useState } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "The quality of these products exceeded my expectations. Will definitely shop here again!",
      author: "Sarah Johnson",
      role: "Happy Customer",
      rating: 5
    },
    // Add more testimonials as needed
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.rating}>
                {'★'.repeat(testimonial.rating)}
              </div>
              <p className={styles.quote}>&quot;{testimonial.quote}&quot;</p>
              <div className={styles.authorInfo}>
                <p className={styles.author}>{testimonial.author}</p>
                <p className={styles.role}>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}