import { useState, useEffect } from 'react';
import styles from '../styles/ProductCard.module.css';
import { useCart } from './CartContext';
import axios from 'axios';

export default function ProductCard({ product, showBadge = false }) {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeDeal, setActiveDeal] = useState(null);

  useEffect(() => {
    const fetchActiveDeal = async () => {
      if (product.deals && product.deals.length > 0) {
        try {
          // Convert array of deal IDs to comma-separated string
          const dealIds = product.deals.join(',');
          const response = await axios.get(`/api/deals?dealIds=${dealIds}`);
          const deals = response.data;
          const now = new Date();
          
          // Find the most recent active deal
          const active = deals.find(deal => 
            deal.isActive && 
            new Date(deal.startDate) <= now && 
            new Date(deal.endDate) >= now
          );
          
          if (active) {
            setActiveDeal(active);
          }
        } catch (error) {
          console.error('Error fetching deal:', error);
        }
      }
    };

    fetchActiveDeal();
  }, [product.deals]);

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

  // Calculate prices and discount
  const hasDeal = activeDeal !== null;
  const discountAmount = hasDeal 
    ? activeDeal.discountType === 'percentage'
      ? (product.price * activeDeal.discountAmount / 100)
      : activeDeal.discountAmount
    : 0;
  const displayPrice = hasDeal ? product.price - discountAmount : product.price;
  const discountPercentage = hasDeal 
    ? activeDeal.discountType === 'percentage'
      ? activeDeal.discountAmount
      : ((discountAmount / product.price) * 100).toFixed(0)
    : null;

  return (
    <div className={styles.card}>
      {showBadge && <div className={styles.badge}>Best Deal</div>}
      {hasDeal && (
        <div className={styles.discountBadge}>
          {discountPercentage}% OFF
        </div>
      )}
      <img src={product.images?.[0]} alt={product.title} className={styles.image} />
      <h3 className={styles.title}>{product.title}</h3>
      <div className={styles.priceSection}>
        {hasDeal ? (
          <>
            <span className={styles.oldPrice}>${product.price.toFixed(2)}</span>
            <span className={styles.price}>${displayPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className={styles.price}>${displayPrice.toFixed(2)}</span>
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