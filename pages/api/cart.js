import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Deal } from "@/models/Deal";


export default async function handle(req, res) {
  await mongooseConnect();

  const ids = req.body.ids;

  // Fetch products
  const products = await Product.find({ _id: ids });

  // Get active deals for these products
  const now = new Date();
  const deals = await Deal.find({
    productId: { $in: ids },
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });

  // Add deal information to products
  const productsWithDeals = products.map(product => {
    const productDeal = deals.find(
      deal => deal.productId.toString() === product._id.toString()
    );

    if (productDeal) {
      const discountAmount = productDeal.discountType === 'percentage'
        ? (product.price * productDeal.discountAmount / 100)
        : productDeal.discountAmount;
      const finalPrice = product.price - discountAmount;

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
  console.log(productsWithDeals);
  res.json(productsWithDeals);
}
