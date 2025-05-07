import ProductCard from './ProductCard';
import styles from '../styles/FeaturedProducts.module.css';
import Link from 'next/link';

export default function FeaturedProducts({ products }) {
  return (
    <section className={styles.featuredProducts}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <Link href="/shop" className={styles.viewAllLink}>
          View All Products →
        </Link>
      </div>

      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product}
          />
        ))}
      </div>
    </section>
  );
}