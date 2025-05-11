// components/Footer.js
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="./index" className={styles.footerLink}>Home</a>
          <a href="./product" className={styles.footerLink}>Products</a>
          <a href="./about" className={styles.footerLink}>About Us</a>
        </div>

<div className={styles.paymentSection}>
  <p className={styles.paymentText}>We accept the following payment methods</p>
  <div className={styles.paymentLogos}>
    {/* PayPal SVG Logo */}
    <div className={styles.paymentLogo}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 16.5H9.5C12.5 16.5 14 15 14 12C14 9 12.5 7.5 9.5 7.5H5.5L4.5 16.5H7.5Z" stroke="#253B80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 16.5H5L7 22.5C7 22.5 12.5 23.5 14.5 21.5C16.5 19.5 15.5 16.5 15.5 16.5" stroke="#253B80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 10.5C11.5 10.5 12.5 11.5 12.5 12.5C12.5 13.5 11.5 14.5 10.5 14.5" stroke="#179BD7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    
    {/* Visa SVG Logo */}
    <div className={styles.paymentLogo}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 4H3C2.4 4 2 4.4 2 5V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V5C22 4.4 21.6 4 21 4Z" fill="#1A1F71"/>
        <path d="M13.6 15.4H11.7L10.6 8.6H12.8C13.4 8.6 13.8 8.9 13.9 9.4L14.9 15.4H13.6Z" fill="#FFFFFF"/>
        <path d="M18.4 8.6L16.7 15.4H15.1L16.8 8.6H18.4Z" fill="#FFFFFF"/>
        <path d="M8.3 8.6L6.9 12.6L6.7 11.3C6.5 10.3 5.7 9.6 4.7 9.6H2.5L2.4 9.9C3.9 10.5 5.1 11.7 5.5 13.2L6.1 15.4H7.7L9.9 8.6H8.3Z" fill="#FFFFFF"/>
      </svg>
    </div>
    
    {/* Mastercard SVG Logo */}
    <div className={styles.paymentLogo}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 9H9V15H15V9Z" fill="#FF5F00"/>
        <path d="M12 18C8.7 18 6 15.3 6 12C6 8.7 8.7 6 12 6C13.4 6 14.7 6.6 15.7 7.5C14.6 6.6 13.1 6 11.5 6C8.5 6 6 8.5 6 11.5C6 14.5 8.5 17 11.5 17C13.1 17 14.5 16.4 15.6 15.4C14.7 16.4 13.4 17 12 17V18Z" fill="#EB001B"/>
        <path d="M18 12C18 14.8 15.8 17 13 17C11.4 17 10 16.4 9 15.4C10.1 16.4 11.5 17 13 17C16.3 17 19 14.3 19 11C19 7.7 16.3 5 13 5C11.5 5 10.1 5.6 9 6.6C10 5.6 11.4 5 13 5C15.8 5 18 7.2 18 10V12Z" fill="#F79E1B"/>
      </svg>
    </div>
    
    {/* American Express SVG Logo */}
    <div className={styles.paymentLogo}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6H22V18H2V6Z" fill="#016FD0"/>
        <path d="M5.7 15L7.5 9H9.1L10.9 15H9.5L9.1 13.6H7.5L7.1 15H5.7ZM8.3 11.2L7.9 12.6H8.7L8.3 11.2Z" fill="#FFFFFF"/>
        <path d="M11.6 15V9H14.5C15.1 9 15.6 9.1 16 9.3C16.4 9.5 16.7 9.8 16.9 10.2C17.1 10.6 17.2 11 17.2 11.5C17.2 12 17.1 12.4 16.9 12.8C16.7 13.2 16.4 13.5 16 13.7C15.6 13.9 15.1 14 14.5 14H13V15H11.6ZM13 12.6H14.3C14.6 12.6 14.8 12.5 14.9 12.4C15 12.3 15.1 12.1 15.1 11.8C15.1 11.5 15 11.3 14.9 11.2C14.8 11.1 14.6 11 14.3 11H13V12.6Z" fill="#FFFFFF"/>
        <path d="M17.8 15V9H19.2V15H17.8Z" fill="#FFFFFF"/>
      </svg>
    </div>
  </div>
</div>

        <div className={styles.copyright}>
          <span>Copyright by HRH, Powered and secured by SEECS.</span>
        </div>
      </div>
    </footer>
  );
}