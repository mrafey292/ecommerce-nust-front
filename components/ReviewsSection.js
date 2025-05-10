import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import styles from '../styles/ReviewsSection.module.css';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        } else {
          setError(data.error || 'Failed to load reviews');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const handleNewReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading reviews...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <section className={styles.reviewsSection}>
      <ReviewList reviews={reviews} />
      <ReviewForm onNewReview={handleNewReview} />
    </section>
  );
}