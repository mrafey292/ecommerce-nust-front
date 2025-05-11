import { useState, useEffect } from "react";
import styles from "../styles/ProductCard.module.css";
import { useCart } from "./CartContext";
import axios from "axios";
import { useRouter } from "next/router";
import ProductDrawer from "./ProductDrawer";

export default function ProductCard({ product, showBadge = false }) {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeDeal, setActiveDeal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchActiveDeal = async () => {
      if (product.deals && product.deals.length > 0) {
        try {
          // Convert array of deal IDs to comma-separated string
          const dealIds = product.deals.map((d) => d._id || d).join(",");
          const response = await axios.get(`/api/deals?dealIds=${dealIds}`);
          const deals = response.data;
          const now = new Date();

          // Find the most recent active deal
          const active = deals.find(
            (deal) =>
              deal.isActive &&
              new Date(deal.startDate) <= now &&
              new Date(deal.endDate) >= now
          );

          if (active) {
            setActiveDeal(active);
          }
        } catch (error) {
          console.error("Error fetching deal:", error);
        }
      }
    };

    fetchActiveDeal();
  }, [product.deals]);

  const incrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addProduct(product._id, quantity);
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // const handleProductClick = () => {
  //   router.push(`/products/${product._id}`);
  // };
  const handleProductClick = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Calculate prices and discount
  const hasDeal = activeDeal !== null;
  const discountAmount = hasDeal
    ? activeDeal.discountType === "percentage"
      ? (product.price * activeDeal.discountAmount) / 100
      : activeDeal.discountAmount
    : 0;
  const displayPrice = hasDeal ? product.price - discountAmount : product.price;
  const discountPercentage = hasDeal
    ? activeDeal.discountType === "percentage"
      ? activeDeal.discountAmount
      : ((discountAmount / product.price) * 100).toFixed(0)
    : null;

  return (
    <>
      <div className={styles.card}>
        {showBadge && <div className={styles.badge}>Best Deal</div>}
        {hasDeal && (
          <div className={styles.discountBadge}>
            {discountPercentage}% <br />
            Off
          </div>
        )}

        {/* Clickable product image */}
        <div className={styles.imageContainer} onClick={handleProductClick}>
          <img
            src={product.images?.[0]}
            alt={product.title}
            className={styles.image}
          />
        </div>

        {/* Clickable product title */}
        <h3 className={styles.title} onClick={handleProductClick}>
          {product.title}
        </h3>

        <div className={styles.priceSection}>
          {hasDeal ? (
            <>
              <span className={styles.oldPrice}>
                ${product.price.toFixed(2)}
              </span>
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
          className={`${styles.addToCartBtn} ${isAdded ? styles.added : ""}`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>

      <ProductDrawer
        product={product}
        open={drawerOpen}
        onClose={closeDrawer}
      />
    </>
  );
}
