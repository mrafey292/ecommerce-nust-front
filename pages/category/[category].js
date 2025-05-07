import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCart } from '../../components/CartContext';
import styles from '../../styles/CategoryPage.module.css';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { addProduct } = useCart();
  const [quantities, setQuantities] = useState({});

  // Sample bakery products - replace with your actual data fetching
  const bakeryProducts = [
    { id: '1', name: 'veggies.png', price: 5.99 },
    { id: '2', name: 'Hash Pupiler', price: 5.99 },
    { id: '3', name: 'Sun\'s for Cut', price: 5.99 },
    { id: '4', name: 'Farm Boilers Band 1 ft', price: 5.99 },
    { id: '5', name: 'Farm Rits/Bigprint Tick', price: 3.99 },
  ];

  const incrementQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    addProduct(productId, quantity);
    setQuantities(prev => ({ ...prev, [productId]: 0 }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.categoryTitle}>{category}</h1>
      
      <div className={styles.content}>
        <div className={styles.filters}>
          <h2 className={styles.filterTitle}>Filter by</h2>
          
          <div className={styles.filterGroup}>
            <h3 className={styles.filterSubtitle}>Category</h3>
            <ul className={styles.filterList}>
              <li>Dash</li>
              <li>Hash Pupiler</li>
              <li>Suns for Cut</li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterSubtitle}>Size</h3>
            <ul className={styles.filterList}>
              <li>Sys/Index</li>
            </ul>
          </div>
        </div>

        <div className={styles.products}>
          {bakeryProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              
              <div className={styles.quantityControls}>
                <button 
                  onClick={() => decrementQuantity(product.id)}
                  className={styles.quantityButton}
                  disabled={!quantities[product.id]}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantities[product.id] || 0}</span>
                <button 
                  onClick={() => incrementQuantity(product.id)}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => handleAddToCart(product.id)}
                className={styles.addToCartButton}
                disabled={!quantities[product.id]}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}