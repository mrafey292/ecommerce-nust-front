import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  } = req.body;

  try {
    await mongooseConnect();

    // Extract only the `id` values from the cartProducts array
    const productIds = cartProducts.map((item) => item.id);

    // Ensure unique IDs
    const uniqueIds = [...new Set(productIds)];

    // Fetch product information from the database
    const productsInfos = await Product.find({ _id: { $in: uniqueIds } });

    console.log("cartProducts:", cartProducts);
    console.log("uniqueIds:", uniqueIds);
    console.log("productsInfos:", productsInfos);

    let line_items = [];
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(
        (p) => p._id.toString() === productId
      );
      const quantity =
        cartProducts.find((item) => item.id === productId)?.quantity || 0;
      if (quantity > 0 && productInfo) {
        line_items.push({
          productId,
          title: productInfo.title,
          price: productInfo.price,
          quantity,
        });
      }
    }

    // Create the order document in the database
    const orderDoc = await Order.create({
      line_items,
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false, // Mark as unpaid for now
    });

    res.status(200).json({
      message: "Order placed successfully",
      order: orderDoc,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
}