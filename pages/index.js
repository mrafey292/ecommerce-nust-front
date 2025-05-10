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
import CategoriesSection from '../components/CategoriesSection';
import { Deal } from "@/models/Deal";

export default function HomePage({ featuredProducts, productsWithDeals }) {
  const { addProduct, removeProduct, cartProducts } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className={styles.siteWrapper}>
      <TopAlertBar />
      <Head>
        <title>Khareedo</title>
        <meta
          name="description"
          content="Discover our fresh bakery products. Too hot for you >.<"
        />
      </Head>

      <Header onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <FeaturesBar />
      <BestDeals products={productsWithDeals} onAddToCart={addProduct} />
      <CategoriesSection />

      <main className={styles.mainContent}>
        <FeaturedProducts
          products={featuredProducts}
          onAddToCart={addProduct}
          onRemoveFromCart={removeProduct}
          cartProducts={cartProducts}
        />
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

  // 1. Get latest 5 products for FeaturedProducts
  const featuredProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 5,
  });

  // 2. Get active deals (within date range and isActive)
  const now = new Date();
  const activeDeals = await Deal.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ createdAt: -1 }).limit(5);

  // 3. Get the products linked to those deals
  const productIdsWithDeals = activeDeals.map((deal) => deal.productId);
  const productsWithDeals = await Product.find({
    _id: { $in: productIdsWithDeals },
  });

  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      productsWithDeals: JSON.parse(JSON.stringify(productsWithDeals)),
    },
  };
}


