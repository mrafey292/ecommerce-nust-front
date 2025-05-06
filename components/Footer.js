import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import React, { useState } from 'react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <h3>Join Our Newsletter</h3>
          <p>Subscribe for updates and special offers</p>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className={styles.emailInput}
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Links Sections */}
        <div className={styles.footerLinks}>
          <div className={styles.linksColumn}>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop/all">All Products</Link></li>
              <li><Link href="/shop/new">New Arrivals</Link></li>
              <li><Link href="/shop/bestsellers">Bestsellers</Link></li>
              <li><Link href="/shop/sale">Sale</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h4>About</h4>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/press">Press</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h4>Help</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/shipping">Shipping & Returns</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Social and Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.socialLinks}>
            <Link href="https://facebook.com" aria-label="Facebook">
              <span className={styles.socialIcon}>FB</span>
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram">
              <span className={styles.socialIcon}>IG</span>
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
              <span className={styles.socialIcon}>TW</span>
            </Link>
            <Link href="https://pinterest.com" aria-label="Pinterest">
              <span className={styles.socialIcon}>PIN</span>
            </Link>
          </div>
          
          <div className={styles.legal}>
            <p>&copy; {new Date().getFullYear()} Fashion Store. All rights reserved.</p>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}