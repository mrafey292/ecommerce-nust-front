import styles from '../styles/ReviewList.module.css';

export default function ReviewList({ reviews = [] }) {
  // Ensure reviews is always an array, even if undefined/null
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  return (
    <div className={styles.reviewList}>
      <h2 className={styles.title}>What Our Customers Say</h2>
      
      {safeReviews.length > 0 ? (
        <div className={styles.grid}>
          {safeReviews.map(review => (
            <div key={review._id} className={styles.card}>
              <div className={styles.header}>
                {review.profilePic && (
                  <img 
                    src={review.profilePic} 
                    alt={review.name} 
                    className={styles.avatar}
                  />
                )}
                <div>
                  <h3 className={styles.name}>{review.name}</h3>
                  <div className={styles.rating}>
                    {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                  </div>
                </div>
              </div>
              <p className={styles.comment}>&quot;{review.notes}&quot;</p>
              <div className={styles.date}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
}