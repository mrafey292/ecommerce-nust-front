import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import styles from '../../styles/CategoryPage.module.css';
import axios from 'axios';
import Header from '../../components/Header';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { addProduct } = useCart();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (category) {
      // Fetch products from the database for the specific category
      axios
        .get(`/api/products?category=${category}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [category]);

  const incrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    addProduct(productId, quantity);
    setQuantities((prev) => ({ ...prev, [productId]: 0 }));
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <div className={styles.container}>
        <h1 className={styles.categoryTitle}>{category.replace(/-/g, ' ')}</h1>

        <div className={styles.content}>
          {products.length === 0 ? (
            <p className={styles.noProducts}>No products found in this category.</p>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.title}
                    className={styles.productImage}
                  />
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>

                  <div className={styles.quantityControls}>
                    <button
                      onClick={() => decrementQuantity(product._id)}
                      className={styles.quantityButton}
                      disabled={!quantities[product._id]}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>
                      {quantities[product._id] || 0}
                    </span>
                    <button
                      onClick={() => incrementQuantity(product._id)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className={styles.addToCartButton}
                    disabled={!quantities[product._id]}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}