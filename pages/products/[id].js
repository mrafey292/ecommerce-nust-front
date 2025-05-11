import React, { useState } from "react";
import { useRouter } from "next/router";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useCart } from "@/components/CartContext";
import styles from "@/styles/ProductDetails.module.css";
import Header from "@/components/Header";
import { useEffect } from "react";
import axios from "axios";

export default function ProductDetailsPage({ product }) {
    const router = useRouter();
    const { addProduct } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeDeal, setActiveDeal] = useState(null);


    if (!product) {
        return <p>Product not found.</p>;
    }

    const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
    const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

    const handleAddToCart = () => {
        addProduct(product._id, quantity);
        setQuantity(1);
    };

    useEffect(() => {
        const fetchActiveDeal = async () => {
            if (product.deals && product.deals.length > 0) {
                try {
                    // Convert array of deal IDs to comma-separated string
                    const dealIds = product.deals.map(d => d._id || d).join(',');
                    const response = await axios.get(`/api/deals?dealIds=${dealIds}`);
                    const deals = response.data;
                    const now = new Date();

                    // Find the most recent active deal
                    const active = deals.find(deal =>
                        deal.isActive &&
                        new Date(deal.startDate) <= now &&
                        new Date(deal.endDate) >= now
                    );

                    if (active) {
                        setActiveDeal(active);
                    }
                } catch (error) {
                    console.error('Error fetching deal:', error);
                }
            }
        };

        fetchActiveDeal();
    }, [product.deals]);


    const hasDeal = activeDeal !== null;
    const discountAmount = hasDeal
        ? activeDeal.discountType === 'percentage'
            ? (product.price * activeDeal.discountAmount / 100)
            : activeDeal.discountAmount
        : 0;
    const displayPrice = hasDeal ? product.price - discountAmount : product.price;
    const discountPercentage = hasDeal
        ? activeDeal.discountType === 'percentage'
            ? activeDeal.discountAmount
            : ((discountAmount / product.price) * 100).toFixed(0)
        : null;
    return (
        <>
            <Header />
            <div className={styles.productDetails}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    &larr; Back
                </button>
                <div className={styles.productContainer}>
                    <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                        <h1 className={styles.productTitle}>{product.title}</h1>
                        <p className={styles.productDescription}>{product.description}</p>
                        <div className={styles.priceSection}>
                            {hasDeal ? (
                                <>
                                    <span className={styles.oldPrice}>${product.price.toFixed(2)}</span>
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
                            className={styles.addToCartBtn}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.params;

    const product = await Product.findById(id).lean();

    return {
        props: {
            product: product ? JSON.parse(JSON.stringify(product)) : null,
        },
    };
}