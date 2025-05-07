import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useRouter } from "next/router";
import styles from '@/styles/Cart.module.css';

export default function CartPage() {
    const { cartProducts, removeProduct, clearCart, addProduct } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(response => {
                    setProducts(response.data);
                })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }
    
    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    const subtotal = products.reduce((sum, product) => {
        const quantity = cartProducts.filter(id => id === product._id).length;
        return sum + product.price * quantity;
    }, 0);

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.cartHeader}>My cart</h1>
            
            {!cartProducts?.length ? (
                <div className={styles.emptyCart}>Your cart is empty</div>
            ) : (
                <>
                    <ul className={styles.productList}>
                        {products.map((product) => {
                            const quantity = cartProducts.filter(id => id === product._id).length;
                            const totalPrice = product.price * quantity;

                            return (
                                <li key={product._id} className={styles.productItem}>
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
                                        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                                        <div className={styles.quantityRow}>
                                            <div className={styles.quantityControls}>
                                                <button 
                                                    onClick={() => lessOfThisProduct(product._id)}
                                                    className={styles.quantityButton}
                                                >
                                                    —
                                                </button>
                                                <span className={styles.quantity}>{quantity}</span>
                                                <button 
                                                    onClick={() => moreOfThisProduct(product._id)}
                                                    className={styles.quantityButton}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className={styles.productTotal}>
                                                ${totalPrice.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className={styles.orderSummary}>
                        <h2 className={styles.summaryTitle}>Order summary</h2>
                        
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span>Delivery</span>
                            <span>FREE</span>
                        </div>
                        
                        <div className={styles.location}>
                            <span>Islamabad, Pakistan</span>
                        </div>
                        
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className={styles.promoCode}>
                            <span>Enter a promo code</span>
                        </div>
                        
                        <button 
                            onClick={() => router.push('/checkout')}
                            className={styles.checkoutButton}
                        >
                            Checkout
                        </button>
                        
                        <div className={styles.noteSection}>
                            <span>Add a note</span>
                        </div>
                        
                        <div className={styles.secureCheckout}>
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}