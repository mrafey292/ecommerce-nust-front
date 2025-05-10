import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import styles from '../../styles/CategoryPage.module.css';
import axios from 'axios';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { addProduct } = useCart();
  const [products, setProducts] = useState([]);

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
                <ProductCard 
                  key={product._id} 
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}