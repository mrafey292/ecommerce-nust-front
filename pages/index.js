import { useState } from "react";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useCart } from "@/components/CartContext";
import Head from "next/head";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import styles from "@/styles/Home.module.css";
import TopAlertBar from "../components/TopAlertBar";
import BestDeals from "@/components/BestDeals";
import FeaturesBar from '@/components/FeaturesBar';

export default function HomePage({ newProducts }) {
  const { addProduct, cartProducts } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className={styles.siteWrapper}>
      <TopAlertBar />
      <Head>
        <title>Nust Eats</title>
        <meta
          name="description"
          content="Discover our fresh bakery products. Too hot for you >.<"
        />
      </Head>

      <Header onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <FeaturesBar />
      <BestDeals products={newProducts} onAddToCart={addProduct} />

      <main className={styles.mainContent}>
        <FeaturedProducts products={newProducts} onAddToCart={addProduct} />

        <Testimonials />

        <Newsletter />
      </main>

      <Footer />

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 8,
  });
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
