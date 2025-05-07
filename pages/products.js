import React, { useState } from "react";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category"; // Import the Category model
import styles from "@/styles/Products.module.css";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";

export default function ProductsPage({ products, categories }) {
  const { addProduct } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products); // State for filtered products
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "") {
      setFilteredProducts(products); // Show all products if no category is selected
    } else {
      setFilteredProducts(products.filter((product) => product.category === categoryId));
    }
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />

      <div className={styles.productsPage}>
        <h1 className={styles.pageTitle}>All Products</h1>

        {/* Category Filter */}
        <div className={styles.filterContainer}>
          <label htmlFor="categoryFilter" className={styles.filterLabel}>
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.title}
                className={styles.productImage}
              />
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              <button
                onClick={() => addProduct(product._id)}
                className={styles.addToCartButton}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Fetch products and categories from the database
  const products = await Product.find({});
  const categories = await Category.find({}); // Fetch categories

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}