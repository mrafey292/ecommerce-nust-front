import styles from '../styles/BestDeals.module.css';

export default function BestDeals({ products, onAddToCart }) {
  return (
    <section className={styles.dealsSection}>
      <h2>Best Deals</h2>
      <div className={styles.productsGrid}>
        {products.map(product => (
          <div key={product._id} className={styles.card}>
            <div className={styles.badge}>Best Deal</div>
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
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
            <button 
              className={styles.addToCartBtn}
              onClick={() => onAddToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className={styles.ctaWrap}>
        <button className={styles.ctaBtn}>Shop Best Deals</button>
      </div>
    </section>
  );
}
