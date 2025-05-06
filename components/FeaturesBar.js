import styles from '../styles/FeaturesBar.module.css';
import { Truck, ShoppingBasket, Headphones, Smartphone } from 'lucide-react';

export default function FeaturesBar() {
  return (
    <section className={styles.featuresContainer}>
      <div className={styles.feature}>
        <Truck className={styles.icon} />
        <div>
          <h4>Free Delivery</h4>
          <p>To Your Door</p>
        </div>
      </div>

      <div className={styles.feature}>
        <ShoppingBasket className={styles.icon} />
        <div>
          <h4>Local Pickup</h4>
          <p>Check Out <a href="#">Locations</a></p>
        </div>
      </div>

      <div className={styles.feature}>
        <Headphones className={styles.icon} />
        <div>
          <h4>Available for You</h4>
          <p><a href="#">Online Support</a> 24/7</p>
        </div>
      </div>

      <div className={styles.feature}>
        <Smartphone className={styles.icon} />
        <div>
          <h4>Order on the Go</h4>
          <p><a href="#">Download</a> Our App</p>
        </div>
      </div>
    </section>
  );
}
