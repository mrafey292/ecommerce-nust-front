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

  const [quantities, setQuantities] = useState({});

  const getQuantity = (productId) => quantities[productId] || 1;

  const increaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const addToCart = (productId, quantity) => {
    addProduct(productId, quantity);
    // Optional: Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [productId]: 1 }));
  };

  useEffect(() => {
    const { category, onlyDeals: queryOnlyDeals } = router.query;

    let updatedProducts = [...products];

    // Handle category filtering
    if (category) {
      const formattedCategory = category.replace(/-/g, " ");
      const categoryDoc = categories.find(
        (cat) => cat.name.toLowerCase() === formattedCategory.toLowerCase()
      );
      if (categoryDoc) {
        setSelectedCategory(categoryDoc._id);
        updatedProducts = updatedProducts.filter(
          (product) => product.category === categoryDoc._id
        );
      }
    }

    // Handle deal filtering based on query param or state
    const shouldFilterDeals = queryOnlyDeals === "true" || onlyDeals;
    setOnlyDeals(shouldFilterDeals);

    if (shouldFilterDeals) {
      updatedProducts = updatedProducts.filter(
        (product) => product.deals && product.deals.length > 0
      );
    }

    setFilteredProducts(updatedProducts);
  }, [router.query, categories, products]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    let updatedProducts = [...products];

    if (categoryId !== "") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === categoryId
      );
    }

    if (onlyDeals) {
      updatedProducts = updatedProducts.filter(
        (product) => product.deals && product.deals.length > 0
      );
    }

    setFilteredProducts(updatedProducts);

    // Update URL
    if (categoryId === "") {
      const { category, ...restQuery } = router.query;
      router.push({ pathname: router.pathname, query: restQuery });
    } else {
      const categoryDoc = categories.find((cat) => cat._id === categoryId);
      if (categoryDoc) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            category: categoryDoc.name
              .toLowerCase()
              .replace(/ & /g, "-")
              .replace(/ /g, "-"),
          },
        });
      }
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];
    if (onlyDeals) {
      sortedProducts = sortedProducts.filter(
        (product) => product.deals && product.deals.length > 0
      );
    }

    switch (option) {
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
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
          sortedProducts = products.filter(
            (product) => product.category === selectedCategory
          );
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
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (checked) {
      updatedProducts = updatedProducts.filter(
        (product) => product.deals && product.deals.length > 0
      );
    }

    setFilteredProducts(updatedProducts);
  };

  // return (
  //   <>
  //     <Header onCartClick={() => setIsCartOpen(true)} />

  //     <div className={styles.productsPage}>
  //       <h1 className={styles.pageTitle}>All Products</h1>

  //       <div className={styles.filterControls}>
  //         {/* Category Filter */}
  //         <div className={styles.filterContainer}>
  //           <label htmlFor="categoryFilter" className={styles.filterLabel}>
  //             Filter by Category:
  //           </label>
  //           <select
  //             id="categoryFilter"
  //             value={selectedCategory}
  //             onChange={(e) => handleCategoryChange(e.target.value)}
  //             className={styles.filterSelect}
  //           >
  //             <option value="">All Categories</option>
  //             {categories.map((category) => (
  //               <option key={category._id} value={category._id}>
  //                 {category.name}
  //               </option>
  //             ))}
  //           </select>
  //         </div>

  //         {/* Sorting Dropdown */}
  //         <div className={styles.filterContainer}>
  //           <label htmlFor="sortFilter" className={styles.filterLabel}>
  //             Sort by:
  //           </label>
  //           <select
  //             id="sortFilter"
  //             value={sortOption}
  //             onChange={(e) => handleSortChange(e.target.value)}
  //             className={styles.filterSelect}
  //           >
  //             <option value="default">Default</option>
  //             <option value="price-low-high">Price: Low to High</option>
  //             <option value="price-high-low">Price: High to Low</option>
  //             <option value="newest">Newest</option>
  //             <option value="oldest">Oldest</option>
  //             <option value="name-asc">Name: A to Z</option>
  //             <option value="name-desc">Name: Z to A</option>
  //           </select>
  //         </div>

  //         <label htmlFor="dealFilter" className={styles.filterLabel}>
  //           <input
  //             type="checkbox"
  //             id="dealFilter"
  //             checked={onlyDeals}
  //             onChange={(e) => {
  //               handleDealsChange(e.target.checked);
  //               const query = { ...router.query };
  //               if (e.target.checked) {
  //                 query.onlyDeals = 'true';
  //               } else {
  //                 delete query.onlyDeals;
  //               }
  //               router.push({ pathname: router.pathname, query });
  //             }}
  //           />

  //           Only show products with deals
  //         </label>
  //       </div>

  //       <div className={styles.productsGrid}>
  //         {filteredProducts.map((product) => (
  //           <ProductCard
  //             key={product._id}
  //             product={product}
  //           />
  //         ))}
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <>
      <Header />

      <div className={styles.productsPage}>
        <h1 className={styles.pageTitle}>All Products</h1>

        {/* Left Sidebar Filters */}
        <aside className={styles.filterSidebar}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterHeader}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </h3>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Categories</label>
              <select
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

            {/* Sorting Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort By</label>
              <select
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

            {/* Deals Filter */}
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="dealFilter"
                checked={onlyDeals}
                onChange={(e) => {
                  handleDealsChange(e.target.checked);
                  const query = { ...router.query };
                  if (e.target.checked) {
                    query.onlyDeals = "true";
                  } else {
                    delete query.onlyDeals;
                  }
                  router.push({ pathname: router.pathname, query });
                }}
                className={styles.checkboxInput}
              />
              <label htmlFor="dealFilter" className={styles.checkboxLabel}>
                Only Deals
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            // <div key={product._id} className={styles.productCard}>
            //   {product.deals?.length > 0 && (
            //     <span className={styles.dealBadge}>Deal</span>
            //   )}
            //   <img
            //     src={product.images?.[0]}
            //     alt={product.title}
            //     className={styles.productImage}
            //   />
            //   <div className={styles.productInfo}>
            //     <h3 className={styles.productTitle}>{product.title}</h3>
            //     <p className={styles.productPrice}>
            //       ${product.deal?.finalPrice?.toFixed(2) || product.price.toFixed(2)}
            //       {product.deal && (
            //         <span style={{
            //           textDecoration: 'line-through',
            //           color: '#a0aec0',
            //           fontSize: '0.875rem',
            //           marginLeft: '0.5rem'
            //         }}>
            //           ${product.price.toFixed(2)}
            //         </span>
            //       )}
            //     </p>
            //     <button
            //       className={styles.addToCartButton}
            //       onClick={() => addProduct(product._id)}
            //     >
            //       Add to Cart
            //     </button>
            //   </div>
            // </div>
            <div key={product._id} className={styles.productCard}>
              {product.deals?.length > 0 && (
                <span className={styles.dealBadge}>Deal</span>
              )}
              <img
                src={product.images?.[0]}
                alt={product.title}
                className={styles.productImage}
              />

              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>

                {/* desc of prod */}
                {/* <p className={styles.productPrice}>
                    $
                    {product.deal?.finalPrice?.toFixed(2) ||
                      product.price.toFixed(2)}
                    {product.deal && (
                      <span className={styles.originalPrice}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </p> */}

                {/* Add the description line */}
                <p className={styles.productDescription}>
                  {product.description?.split(" ").slice(0, 8).join(" ") ||
                    "No description available"}
                  ...
                </p>

                <div className={styles.priceAndControls}>
                  <p className={styles.productPrice}>
                    {/* Safely handle deal price display */}
                    {product.deals?.[0]?.finalPrice ? (
                      <>
                        <span className={styles.dealPrice}>
                          ${product.deals[0].finalPrice.toFixed(2)}
                        </span>
                        <span className={styles.originalPrice}>
                          ${product.price?.toFixed(2) || "0.00"}
                        </span>
                      </>
                    ) : (
                      // Regular price if no deal
                      `$${product.price?.toFixed(2) || "0.00"}`
                    )}
                  </p>

                  <div className={styles.quantityActionsRow}>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => decreaseQuantity(product._id)}
                      >
                        -
                      </button>
                      <span className={styles.quantityDisplay}>
                        {getQuantity(product._id)}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => increaseQuantity(product._id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={styles.cartIconButton}
                      onClick={() =>
                        addToCart(product._id, getQuantity(product._id))
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  const now = new Date();

  // Aggregation to fetch products and only include active deals
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "deals",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$isActive", true] },
                  { $lte: ["$startDate", now] },
                  { $gte: ["$endDate", now] },
                ],
              },
            },
          },
        ],
        as: "deals",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const categories = await Category.find({});

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
