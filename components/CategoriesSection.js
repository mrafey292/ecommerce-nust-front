import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Categories.module.css';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Vegetables', image: '/imagesPull/veggies.png' },
  { name: 'Bakery', image: '/imagesPull/breac.png' },
  { name: 'Hygiene', image: '/imagesPull/hygiene.png' },
  { name: 'Dairy and Eggs', image: '/imagesPull/poultry.png' },
  { name: 'Meat and Poultry', image: '/imagesPull/meat.png' },
  { name: 'Soft Drinks', image: '/imagesPull/cola.png' },
  { name: 'Cleaning Supplies', image: '/imagesPull/detergents.png' },
  { name: 'Cereal and Snacks', image: '/imagesPull/snacks.png' },
];

export default function CategoriesSection() {
  const router = useRouter();

  const handleCategoryClick = (categoryName) => {
    router.push({
      pathname: '/products',
      query: { category: categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') }
    });
  };

  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>Most Popular Categories</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <motion.div 
            key={category.name}
            whileHover="hover"
            className={styles.categoryWrapper}
          >
            <div 
              onClick={() => handleCategoryClick(category.name)}
              className={styles.categoryCard}
            >
              <div className={styles.imageContainer}>
                {/* Animated red circle background */}
                <motion.div
                  className={styles.circleBackground}
                  variants={{
                    hover: {
                      scale: 1,
                      opacity: 0.4,
                      transition: { duration: 0.3 }
                    }
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                />
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  width={120}
                  height={120}
                  className={styles.categoryImage}
                />
              </div>
              <h3 className={styles.categoryName}>{category.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}