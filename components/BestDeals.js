import { useRouter } from 'next/router';
import ProductCard from './ProductCard';
import styles from '../styles/BestDeals.module.css';

export default function BestDeals({ products }) {
  const router = useRouter();

  const handleShopDealsClick = () => {
    router.push('/products?onlyDeals=true');
  };

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
        <button 
          className={styles.ctaBtn} 
          onClick={handleShopDealsClick}
        >
          Shop Best Deals
        </button>
      </div>
    </section>
  );
}
