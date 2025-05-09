import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  const { category } = req.query;

  try {
    await mongooseConnect();

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
      const products = await Product.find({ category: categoryDoc._id });

      return res.status(200).json(products);
    }

    // If no category is specified, return all products
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}