import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "@/styles/Checkout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function CheckoutPage() {
  const { cartProducts, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [products, setProducts] = useState([]); // Added products state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch product details like in cart.js
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts.map((item) => item.id) })
        .then((response) => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error("Error fetching product details:", error);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  // Calculate total based on fetched products
  useEffect(() => {
    if (products.length > 0) {
      const total = products.reduce((sum, product) => {
        const cartItem = cartProducts.find((item) => item.id === product._id);
        const quantity = cartItem ? cartItem.quantity : 0;
        const price = product.deal ? product.deal.finalPrice : product.price;
        return sum + price * quantity;
      }, 0);
      setCartTotal(total);
    } else {
      setCartTotal(0);
    }
  }, [products, cartProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        ...formData,
        cartProducts,
        paymentMethod,
        deliveryMethod,
        total: deliveryMethod === "standard" ? cartTotal : cartTotal + 9.99
      };

      console.log("Order Data Sent to API:", orderData);

      const response = await axios.post("/api/checkout", orderData);

      if (response.status === 200) {
        setSuccessMessage("Order placed successfully!");
        clearCart();
        setActiveStep(4);

        setTimeout(() => {
          router.push("/");
        }, 5000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setSuccessMessage("Failed to place the order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDeliveryDate = () => {
    const days = deliveryMethod === "express" ? 2 : 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddressChange = (e) => {
    handleChange(e);
    setMapCenter((prev) => ({
      lat: prev.lat + (Math.random() * 0.01 - 0.005),
      lng: prev.lng + (Math.random() * 0.01 - 0.005),
    }));
  };

  // Helper function to get product details
  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId) || {};
  };

  return (
    <>
      <Header/>
      
      <div className={styles.checkoutContainer}>
        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`${styles.step} ${activeStep >= step ? styles.active : ""}`}
              onClick={() => step < 4 && setActiveStep(step)}
            >
              <div className={styles.stepNumber}>{step}</div>
              <div className={styles.stepLabel}>
                {step === 1 && "Shipping"}
                {step === 2 && "Payment"}
                {step === 3 && "Review"}
                {step === 4 && "Complete"}
              </div>
            </div>
          ))}
        </div>

      {activeStep === 1 && (
        <div className={`${styles.checkoutSection} ${styles.animateFadeIn}`}>
          <h2>Shipping Information</h2>

          <div className={styles.mapContainer}>
            <MapWithNoSSR center={mapCenter} />
            <div className={styles.mapOverlay}>Your delivery area</div>
          </div>

          <form>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.deliveryOptions}>
              <h3>Delivery Method</h3>
              <div className={styles.optionGroup}>
                <label
                  className={`${styles.optionCard} ${
                    deliveryMethod === "standard" ? styles.active : ""
                  }`}
                  onClick={() => setDeliveryMethod("standard")}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "standard"}
                    readOnly
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Standard Delivery</span>
                    <span className={styles.optionDetails}>3-5 business days</span>
                    <span className={styles.optionPrice}>FREE</span>
                  </div>
                </label>

                <label
                  className={`${styles.optionCard} ${
                    deliveryMethod === "express" ? styles.active : ""
                  }`}
                  onClick={() => setDeliveryMethod("express")}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "express"}
                    readOnly
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Express Delivery</span>
                    <span className={styles.optionDetails}>1-2 business days</span>
                    <span className={styles.optionPrice}>$9.99</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="button"
              className={styles.continueButton}
              onClick={() => setActiveStep(2)}
            >
              Continue to Payment
            </button>
          </form>
        </div>
      )}

      {activeStep === 2 && (
        <div className={`${styles.checkoutSection} ${styles.animateSlideIn}`}>
          <h2>Payment Method</h2>

          <div className={styles.paymentOptions}>
            <div className={styles.optionGroup}>
              <label
                className={`${styles.optionCard} ${
                  paymentMethod === "credit" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("credit")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "credit"}
                  readOnly
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Credit/Debit Card</span>
                  <div className={styles.cardIcons}>
                    <img src="/icons/visa.svg" alt="Visa" />
                    <img src="/icons/mastercard.svg" alt="Mastercard" />
                    <img src="/icons/amex.svg" alt="American Express" />
                  </div>
                </div>
              </label>

              <label
                className={`${styles.optionCard} ${
                  paymentMethod === "paypal" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "paypal"}
                  readOnly
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>PayPal</span>
                  <img
                    src="/icons/paypal.svg"
                    alt="PayPal"
                    className={styles.paypalLogo}
                  />
                </div>
              </label>

              <label
                className={`${styles.optionCard} ${
                  paymentMethod === "applepay" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("applepay")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "applepay"}
                  readOnly
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Union Pay</span>
                  <img
                    src="/icons/applepay.svg"
                    alt="Apple Pay"
                    className={styles.applePayLogo}
                  />
                </div>
              </label>
            </div>
          </div>

          {paymentMethod === "credit" && (
            <div className={`${styles.creditCardForm} ${styles.animateFadeIn}`}>
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className={styles.cardInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={styles.cardInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Security Code</label>
                  <input type="text" placeholder="CVC" className={styles.cardInput} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Name on Card</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={styles.cardInput}
                />
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setActiveStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              className={styles.continueButton}
              onClick={() => setActiveStep(3)}
            >
              Review Order
            </button>
          </div>
        </div>
      )}


{activeStep === 3 && (
          <div className={`${styles.checkoutSection} ${styles.animateSlideIn}`}>
            <h2>Review Your Order</h2>

            <div className={styles.orderSummary}>
              {/* Shipping and Payment sections remain the same */}

              <div className={styles.summarySection}>
                <h3>Order Items</h3>
                <div className={styles.orderItems}>
                  {cartProducts.map((item) => {
                    const product = getProductDetails(item.id);
                    const price = product.deal ? product.deal.finalPrice : product.price;
                    const quantity = item.quantity || 1;
                    
                    return (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img 
                            src={product.images?.[0] || "/placeholder-product.png"} 
                            alt={product.title || "Product"} 
                          />
                          <span className={styles.itemQuantity}>
                            {quantity}
                          </span>
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{product.title || "Product"}</h4>
                          <p className={styles.itemPrice}>
                            ${price?.toFixed(2) || "0.00"}
                            {product.deal && (
                              <span className={styles.originalPrice}>
                                ${product.price?.toFixed(2) || "0.00"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.orderTotal}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>{deliveryMethod === "standard" ? "FREE" : "$9.99"}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>
                    ${(deliveryMethod === "standard" ? cartTotal : cartTotal + 9.99).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>


      
          <form onSubmit={handleSubmit}>
            <div className={`${styles.formGroup} ${styles.termsCheckbox}`}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setActiveStep(2)}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.spinner}></span> : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeStep === 4 && (
        <div className={`${styles.successSection} ${styles.animateFadeIn}`}>
          <div className={styles.successAnimation}>
            <svg className={styles.checkmark} viewBox="0 0 52 52">
              <circle
                className={styles.checkmarkCircle}
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className={styles.checkmarkCheck}
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h2>Order Confirmed!</h2>
          <p className={styles.successMessage}>
            Thank you for your purchase. Your order has been confirmed and will
            be shipped by {calculateDeliveryDate()}.
          </p>
          <p className={styles.confirmationEmail}>
            A confirmation email has been sent to {formData.email}
          </p>
          <button
            className={styles.continueShoppingButton}
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </button>
        </div>
      )}

              {/* Order Summary Sidebar */}
              <div className={styles.orderSummarySidebar}>
          <h3>Order Summary</h3>

          <div className={styles.orderItemsPreview}>
            {cartProducts.slice(0, 3).map((item) => {
              const product = getProductDetails(item.id);
              const price = product.deal ? product.deal.finalPrice : product.price;
              const quantity = item.quantity || 1;
              
              return (
                <div key={item.id} className={styles.previewItem}>
                  <img 
                    src={product.images?.[0] || "/placeholder-product.png"} 
                    alt={product.title || "Product"} 
                  />
                  <div className={styles.previewDetails}>
                    <span>{product.title || "Product"}</span>
                    <span>
                      {quantity} × ${price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              );
            })}
            {cartProducts.length > 3 && (
              <div className={styles.moreItems}>
                +{cartProducts.length - 3} more items
              </div>
            )}
          </div>

          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{deliveryMethod === "standard" ? "FREE" : "$9.99"}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>
                ${(deliveryMethod === "standard" ? cartTotal : cartTotal + 9.99).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}