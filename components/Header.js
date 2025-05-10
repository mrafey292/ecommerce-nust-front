// header.js (final version)
import Link from "next/link";
import { useCart } from "./CartContext";
import styles from "../styles/Header.module.css";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { cartProducts } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.shopName}>
          Khareedo.
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        
        <div className={styles.cartContainer} onClick={() => setCartOpen(true)}>
          <div className={styles.cartLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={styles.cartIcon}
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.cartCount}>{totalItems}</span>
            )}
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}