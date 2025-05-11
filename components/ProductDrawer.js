import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from '../styles/ProductDrawer.module.css';
import { useCart } from './CartContext';

export default function ProductDrawer({ product, open, onClose }) {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeDeal, setActiveDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && product) {
      setLoading(true);
      setError(null);
      const fetchProductDetails = async () => {
        try {
          // First try fetching the product with details included
          const response = await axios.post('/api/cart', { 
            ids: [product._id],
            includeDetails: true 
          });
          
          const productData = response.data[0]; // Get first (and only) product
          
          if (productData.deals && productData.deals.length > 0) {
            const dealIds = productData.deals.map(d => d._id || d).join(',');
            const dealsResponse = await axios.get(`/api/deals?dealIds=${dealIds}`);
            const deals = dealsResponse.data;
            const now = new Date();
            
            const active = deals.find(deal => 
              deal.isActive && 
              new Date(deal.startDate) <= now && 
              new Date(deal.endDate) >= now
            );
            
            if (active) setActiveDeal(active);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching product details:', err);
          setError('Failed to load product details');
          setLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [open, product]);


  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    addProduct(product._id, quantity);
    setIsAdded(true);
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
    <>
      {/* Animated Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Animated Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className={styles.closeButton}>
              &times;
            </button>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
              </div>
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
                <button 
                  onClick={onClose}
                  className={styles.retryButton}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className={styles.content}>
                <div className={styles.imageGallery}>
                  <div className={styles.mainImage}>
                    <img 
                      src={product.images?.[0]} 
                      alt={product.title} 
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.thumbnailContainer}>
                    {product.images?.slice(0, 4).map((img, index) => (
                      <div key={index} className={styles.thumbnail}>
                        <img src={img} alt={`${product.title} ${index}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.productDetails}>
                  <h2 className={styles.productTitle}>{product.title}</h2>
                  
                  <div className={styles.priceSection}>
                    {hasDeal ? (
                      <>
                        <span className={styles.oldPrice}>${product.price.toFixed(2)}</span>
                        <span className={styles.price}>${displayPrice.toFixed(2)}</span>
                        <span className={styles.discountBadge}>
                          {discountPercentage}% OFF
                        </span>
                      </>
                    ) : (
                      <span className={styles.price}>${displayPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{product.description || 'No description available.'}</p>
                  </div>

                  <div className={styles.quantityControls}>
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
                    {isAdded ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}