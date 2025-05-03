// filepath: c:\code\sem4\proj\ecommerce-nust-front\pages\_app.js
import "@/styles/globals.css";
import { CartContextProvider } from "@/components/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <CartContextProvider>
      <Component {...pageProps} />
    </CartContextProvider>
  );
}