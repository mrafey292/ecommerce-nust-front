import { useState } from 'react';
import styles from '../styles/FeaturedProducts.module.css';
import Link from 'next/link';

export default function FeaturedProducts({ products, onAddToCart }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <Link href="/shop" className={styles.viewAllLink}>
          View All Products →
        </Link>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={styles.productImage}
                  onClick={() => setQuickViewProduct(product)}
                />
              )}
              <button
                className={styles.quickAddButton}
                onClick={() => onAddToCart(product._id)}
              >
                + Quick Add
              </button>
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.productFooter}>
                <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                <button
                  onClick={() => onAddToCart(product._id)}
                  className={styles.addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quickViewProduct && (
        <div className={styles.quickViewModal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeModal}
              onClick={() => setQuickViewProduct(null)}
            >
              &times;
            </button>
            <div className={styles.modalProduct}>
              <div className={styles.modalProductImage}>
                <img 
                  src={quickViewProduct.images[0]} 
                  alt={quickViewProduct.title} 
                />
              </div>
              <div className={styles.modalProductInfo}>
                <h3>{quickViewProduct.title}</h3>
                <p className={styles.price}>${quickViewProduct.price.toFixed(2)}</p>
                <p className={styles.description}>{quickViewProduct.description}</p>
                <div className={styles.productOptions}>
                  {quickViewProduct.colors && (
                    <div className={styles.option}>
                      <label>Color:</label>
                      <select>
                        {quickViewProduct.colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {quickViewProduct.sizes && (
                    <div className={styles.option}>
                      <label>Size:</label>
                      <select>
                        {quickViewProduct.sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <button
                  className={styles.addToCart}
                  onClick={() => {
                    onAddToCart(quickViewProduct._id);
                    setQuickViewProduct(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}