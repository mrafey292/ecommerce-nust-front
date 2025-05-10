import { useCart } from './CartContext';
import styles from '../styles/CartDrawer.module.css';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({ open, onClose }) {
  const { cartProducts, addProduct, removeProduct } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts.map(item => item.id) })
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  const subtotal = products.reduce((sum, product) => {
    const cartItem = cartProducts.find(item => item.id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const price = product.deal ? product.deal.finalPrice : product.price;
    return sum + price * quantity;
  }, 0).toFixed(2);

  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0);

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className={styles.drawer}
          >
            <div className={styles.header}>
              <h3>Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h3>
              <button onClick={onClose} className={styles.closeButton}>
                &times;
              </button>
            </div>
            
            <div className={styles.content}>
              {cartProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.emptyCart}
                >
                  <p>Your cart is empty</p>
                  <Link href="/products" className={styles.continueShopping}>
                    Continue Shopping
                  </Link>
                </motion.div>
              ) : (
                <>
                  <ul className={styles.productList}>
                    <AnimatePresence>
                      {products.map((product) => {
                        const cartItem = cartProducts.find(item => item.id === product._id);
                        const quantity = cartItem ? cartItem.quantity : 0;
                        const price = product.deal ? product.deal.finalPrice : product.price;
                        const totalPrice = (price * quantity).toFixed(2);
                        
                        return (
                          <motion.li
                            key={product._id}
                            className={styles.productItem}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={styles.productImageContainer}>
                              {product.images?.[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className={styles.productImage}
                                />
                              )}
                            </div>
                            <div className={styles.productDetails}>
                              <h3 className={styles.productTitle}>{product.title}</h3>
                              <div className={styles.priceRow}>
                                {product.deal ? (
                                  <>
                                    <div className={styles.priceInfo}>
                                      <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                                      <span className={styles.unitPrice}>${price.toFixed(2)}</span>
                                      <span className={styles.discountBadge}>
                                        {product.deal.discountType === 'percentage' 
                                          ? `${product.deal.discountAmount}% OFF`
                                          : `$${product.deal.discountAmount} OFF`}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <span className={styles.unitPrice}>${price.toFixed(2)}</span>
                                )}
                                <div className={styles.quantityControls}>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeProduct(product._id, 1);
                                    }}
                                    className={styles.quantityButton}
                                    disabled={quantity <= 1}
                                  >
                                    —
                                  </button>
                                  <span className={styles.quantity}>{quantity}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addProduct(product._id, 1);
                                    }}
                                    className={styles.quantityButton}
                                  >
                                    +
                                  </button>
                                </div>
                                <span className={styles.totalPrice}>${totalPrice}</span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                  
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                      <Link 
                        href="/checkout" 
                        className={styles.checkoutButton}
                        onClick={onClose}
                      >
                        Checkout
                      </Link>
                      <Link 
                        href="/cart" 
                        className={styles.viewCartButton}
                        onClick={onClose}
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}