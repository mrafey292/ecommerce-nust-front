import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Deal } from "@/models/Deal";

export default async function handler(req, res) {
  const { category } = req.query;

  try {
    await mongooseConnect();

    // Helper function to get active deals for products
    const getActiveDeals = async (productIds) => {
      const now = new Date();
      const deals = await Deal.find({
        product: { $in: productIds },
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).populate('product');
      
      console.log('Active deals found:', deals.map(deal => ({
        productId: deal.product._id,
        discountType: deal.discountType,
        discountAmount: deal.discountAmount,
        startDate: deal.startDate,
        endDate: deal.endDate
      })));
      
      return deals;
    };

    if (category) {
      // Replace hyphens with spaces in the category name
      const formattedCategory = category.replace(/-/g, " ");

      // Perform a case-insensitive search for the category
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${formattedCategory}$`, "i") },
      });

      if (!categoryDoc) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Fetch products belonging to the category
      const products = await Product.find({ category: categoryDoc._id }).populate('deals');
      
      // Get active deals for these products
      const deals = await getActiveDeals(products.map(p => p._id));
      
      // Add deal information to products
      const productsWithDeals = products.map(product => {
        // Find the most recent active deal for this product
        const productDeal = deals.find(deal => deal.product._id.toString() === product._id.toString());
        if (productDeal) {
          const discountAmount = productDeal.discountType === 'percentage' 
            ? (product.price * productDeal.discountAmount / 100)
            : productDeal.discountAmount;
          const finalPrice = product.price - discountAmount;
          
          console.log('Product with deal:', {
            productId: product._id,
            title: product.title,
            originalPrice: product.price,
            discountType: productDeal.discountType,
            discountAmount: productDeal.discountAmount,
            finalPrice
          });
          
          return {
            ...product.toObject(),
            deal: {
              discountType: productDeal.discountType,
              discountAmount: productDeal.discountAmount,
              finalPrice
            }
          };
        }
        return product.toObject();
      });

      return res.status(200).json(productsWithDeals);
    }
    

    // If no category is specified, return all products
    const products = await Product.find({}).populate('deals');
    
    // Get active deals for all products
    const deals = await getActiveDeals(products.map(p => p._id));
    
    // Add deal information to products
    const productsWithDeals = products.map(product => {
      // Find the most recent active deal for this product
      const productDeal = deals.find(deal => deal.product._id.toString() === product._id.toString());
      if (productDeal) {
        const discountAmount = productDeal.discountType === 'percentage' 
          ? (product.price * productDeal.discountAmount / 100)
          : productDeal.discountAmount;
        const finalPrice = product.price - discountAmount;
        
        console.log('Product with deal:', {
          productId: product._id,
          title: product.title,
          originalPrice: product.price,
          discountType: productDeal.discountType,
          discountAmount: productDeal.discountAmount,
          finalPrice
        });
        
        return {
          ...product.toObject(),
          deal: {
            discountType: productDeal.discountType,
            discountAmount: productDeal.discountAmount,
            finalPrice
          }
        };
      }
      return product.toObject();
    });

    res.status(200).json(productsWithDeals);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}