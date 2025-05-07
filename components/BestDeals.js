import ProductCard from './ProductCard';
import styles from '../styles/BestDeals.module.css';

export default function BestDeals({ products }) {
  return (
    <section className={styles.dealsSection}>
      <h2>Best Deals</h2>
      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            showBadge={true}
          />
        ))}
      </div>
      <div className={styles.ctaWrap}>
        <button className={styles.ctaBtn}>Shop Best Deals</button>
      </div>
    </section>
  );
}