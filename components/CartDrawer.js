import { useCart } from './CartContext';
import styles from '../styles/CartDrawer.module.css';
import Link from 'next/link';

export default function CartDrawer({ open, onClose }) {
  const { 
    cartProducts, 
    removeProduct, 
    clearCart 
  } = useCart();

  // This would come from your products data
  const getProductDetails = (productId) => {
    // Replace with your actual product data fetching
    const mockProducts = {
      '1': { name: 'Classic White Tee', price: 29.99, image: '/images/white-tee.jpg' },
      '2': { name: 'Black Denim Jeans', price: 59.99, image: '/images/black-jeans.jpg' },
      // Add more products as needed
    };
    return mockProducts[productId] || { name: 'Product', price: 0, image: '' };
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, productId) => {
      const product = getProductDetails(productId);
      return total + product.price;
    }, 0).toFixed(2);
  };

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
      <div className={styles.header}>
        <h3>Your Shopping Bag ({cartProducts.length})</h3>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
      </div>
      
      <div className={styles.content}>
        {cartProducts.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <Link href="/shop" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {cartProducts.map((productId, index) => {
                const product = getProductDetails(productId);
                return (
                  <li key={`${productId}-${index}`} className={styles.item}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h4>{product.name}</h4>
                      <p>${product.price.toFixed(2)}</p>
                      <button
                        onClick={() => removeProduct(productId)}
                        className={styles.removeItem}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            <div className={styles.summary}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>${calculateTotal()}</span>
              </div>
              <p className={styles.shippingNote}>Shipping & taxes calculated at checkout</p>
            </div>
          </>
        )}
      </div>
      
      <div className={styles.footer}>
        <button 
          onClick={clearCart}
          className={styles.clearCart}
          disabled={cartProducts.length === 0}
        >
          Clear Cart
        </button>
        <Link 
          href="/checkout" 
          className={styles.checkoutButton}
          onClick={onClose}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}