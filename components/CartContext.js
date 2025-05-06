import { createContext, useContext, useEffect, useState } from "react";

// Create context with proper initialization
export const CartContext = createContext({
  cartProducts: [],
  addProduct: () => {},
  removeProduct: () => {},
  clearCart: () => {},
  setCartProducts: () => {}
});

// Custom hook with error handling
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Provider component
export default function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, [ls]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts, ls]);

  const addProduct = (productId) => {
    setCartProducts(prev => [...prev, productId]);
  };

  const removeProduct = (productId) => {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((_, index) => index !== pos);
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCartProducts([]);
    ls?.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartProducts,
      setCartProducts,
      addProduct,
      removeProduct,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}