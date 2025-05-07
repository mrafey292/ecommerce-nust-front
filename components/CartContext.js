import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [products, setProducts] = useState([]); // Your full products list

  const addProduct = (productId, quantity = 1) => {
    setCartProducts(prev => {
      const existingItem = prev.find(item => item.id === productId);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { id: productId, quantity }];
    });
    return true;
  };

  const removeProduct = (productId, quantity = 1) => {
    setCartProducts(prev => {
      const existingItem = prev.find(item => item.id === productId);
      
      if (!existingItem) return prev;
      
      if (existingItem.quantity <= quantity) {
        return prev.filter(item => item.id !== productId);
      }
      
      return prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartProducts([]);
  };

  return (
    <CartContext.Provider 
    value={{
      products,
      cartProducts,
      addProduct,
      removeProduct,
      clearCart
    }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartProvider;