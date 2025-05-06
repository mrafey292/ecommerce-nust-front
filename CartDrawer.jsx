import { useContext } from 'react';
import { CartContext } from './CartContext';

export default function CartDrawer({ open, onClose }) {
  const { cartProducts, setCartProducts } = useContext(CartContext);
  // You would typically have product details here
  
  const removeFromCart = (productId) => {
    setCartProducts(prev => prev.filter(id => id !== productId));
  };

  return (
    <div className={`cart-drawer ${open ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button className="close-cart" onClick={onClose}>
          &times;
        </button>
      </div>
      
      <div className="cart-items">
        {cartProducts.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartProducts.map(productId => (
            <div key={productId} className="cart-item">
              <img src={`/images/product-${productId}.jpg`} alt="Product" />
              <div className="item-details">
                <h4>Product {productId}</h4>
                <p>$29.99</p>
                <button 
                  onClick={() => removeFromCart(productId)}
                  className="remove-item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>${(cartProducts.length * 29.99).toFixed(2)}</span>
        </div>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}