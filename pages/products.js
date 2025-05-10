import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styles from "@/styles/Products.module.css";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage({ products, categories }) {
  const router = useRouter();
  const { addProduct } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [onlyDeals, setOnlyDeals] = useState(false);


  useEffect(() => {
    const { category } = router.query;
    let updatedProducts = [...products];

    if (category) {
      const formattedCategory = category.replace(/-/g, " ");
      const categoryDoc = categories.find(
        (cat) => cat.name.toLowerCase() === formattedCategory.toLowerCase()
      );
      if (categoryDoc) {
        setSelectedCategory(categoryDoc._id);
        updatedProducts = updatedProducts.filter((product) => product.category === categoryDoc._id);
      }
    }

    if (onlyDeals) {
      updatedProducts = updatedProducts.filter(product => product.deals && product.deals.length > 0);
    }

    setFilteredProducts(updatedProducts);
  }, [router.query, categories, products, onlyDeals]);


  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    let updatedProducts = [...products];

    if (categoryId !== "") {
      updatedProducts = updatedProducts.filter(product => product.category === categoryId);
    }

    if (onlyDeals) {
      updatedProducts = updatedProducts.filter(product => product.deals && product.deals.length > 0);
    }

    setFilteredProducts(updatedProducts);

    // Update URL
    if (categoryId === "") {
      const { category, ...restQuery } = router.query;
      router.push({ pathname: router.pathname, query: restQuery });
    } else {
      const categoryDoc = categories.find(cat => cat._id === categoryId);
      if (categoryDoc) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            category: categoryDoc.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
          },
        });
      }
    }
  };


  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];
    if (onlyDeals) {
      sortedProducts = sortedProducts.filter(product => product.deals && product.deals.length > 0);
    }

    switch (option) {
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sorting (original order)
        if (selectedCategory) {
          sortedProducts = products.filter((product) => product.category === selectedCategory);
        } else {
          sortedProducts = [...products];
        }
        break;

    }



    setFilteredProducts(sortedProducts);
  };

  const handleDealsChange = (checked) => {
    setOnlyDeals(checked);
    let updatedProducts = [...products];

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
    }

    if (checked) {
      updatedProducts = updatedProducts.filter(product => product.deals && product.deals.length > 0);
    }

    setFilteredProducts(updatedProducts);
  };


  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />

      <div className={styles.productsPage}>
        <h1 className={styles.pageTitle}>All Products</h1>

        <div className={styles.filterControls}>
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

          {/* Sorting Dropdown */}
          <div className={styles.filterContainer}>
            <label htmlFor="sortFilter" className={styles.filterLabel}>
              Sort by:
            </label>
            <select
              id="sortFilter"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          <label htmlFor="dealFilter" className={styles.filterLabel}>
            <input
              type="checkbox"
              id="dealFilter"
              checked={onlyDeals}
              onChange={(e) => handleDealsChange(e.target.checked)}
            />
            Only show products with deals
          </label>
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Fetch products and categories from the database
  const products = await Product.find({}, null, { sort: { createdAt: -1 } }); // Default sort by newest first
  const categories = await Category.find({});

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}