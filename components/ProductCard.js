import { useState } from 'react';
import styles from '../styles/ProductCard.module.css';
import { useCart } from './CartContext';

export default function ProductCard({ product, showBadge = false }) {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    addProduct(product._id, quantity);
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={styles.card}>
      {showBadge && <div className={styles.badge}>Best Deal</div>}
      <img src={product.images?.[0]} alt={product.title} className={styles.image} />
      <h3 className={styles.title}>{product.title}</h3>
      <div className={styles.priceSection}>
        {product.discountPrice ? (
          <>
            <span className={styles.oldPrice}>${product.price.toFixed(2)}</span>
            <span className={styles.price}>${product.discountPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        )}
      </div>
      <div className={styles.cartControls}>
        <button 
          onClick={decrementQuantity}
          className={styles.quantityButton}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button 
          onClick={incrementQuantity}
          className={styles.quantityButton}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button 
        className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        {isAdded ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}