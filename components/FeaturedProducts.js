import { useState } from 'react';
import styles from '../styles/FeaturedProducts.module.css';
import Link from 'next/link';

export default function FeaturedProducts({ products, onAddToCart, onRemoveFromCart, cartProducts }) {
	const [quickViewProduct, setQuickViewProduct] = useState(null);

	const [quantities, setQuantities] = useState({}); // Local state for quantities

	// Helper function to get the quantity of a product
	const getQuantity = (productId) => quantities[productId] || 0;

	// Increment quantity for a product
	const incrementQuantity = (productId) => {
		setQuantities((prev) => ({
			...prev,
			[productId]: (prev[productId] || 0) + 1,
		}));
	};

	// Decrement quantity for a product
	const decrementQuantity = (productId) => {
		setQuantities((prev) => ({
			...prev,
			[productId]: Math.max((prev[productId] || 0) - 1, 0),
		}));
	};

	// Add the specified quantity to the cart
	const handleAddToCart = (productId) => {
		const quantity = getQuantity(productId);
		for (let i = 0; i < quantity; i++) {
			onAddToCart(productId); // Add the product to the cart
		}
		setQuantities((prev) => ({
			...prev,
			[productId]: 0, // Reset the quantity after adding to the cart
		}));
	};

	return (
		<section className={styles.featuredProducts}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>Featured Products</h2>
				<Link href="/shop" className={styles.viewAllLink}>
					View All Products →
				</Link>
			</div>

			<div className={styles.productsGrid}>
        {products.map((product) => {
          const quantity = getQuantity(product._id); // Get current quantity

          return (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.productImage}
                  />
                )}
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decrementQuantity(product._id)} // Decrease quantity
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={quantity === 0} // Disable if quantity is 0
                    >
                      -
                    </button>
                    <span>{quantity}</span> {/* Display current quantity */}
                    <button
                      onClick={() => incrementQuantity(product._id)} // Increase quantity
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(product._id)} // Add to cart
                    disabled={quantity === 0} // Disable if quantity is 0
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

			{/* Quick View Modal */}
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
												{quickViewProduct.colors.map((color) => (
													<option key={color} value={color}>
														{color}
													</option>
												))}
											</select>
										</div>
									)}
									{quickViewProduct.sizes && (
										<div className={styles.option}>
											<label>Size:</label>
											<select>
												{quickViewProduct.sizes.map((size) => (
													<option key={size} value={size}>
														{size}
													</option>
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