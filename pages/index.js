import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import React, { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import Link from "next/link";


export default function HomePage({ newProducts }) {
  const { addProduct, cartProducts } = useContext(CartContext);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to the Home Page</h1>
        <Link href="/cart" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Cart ({cartProducts?.length})
        </Link>
      </div>
      <p className="text-lg text-gray-700 mb-6">This is a simple Next.js application.</p>
      <h2 className="text-2xl font-semibold text-green-600 mb-4">New Products</h2>
      <ul className="space-y-4">
        {newProducts.map((product) => (
          <li key={product._id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-800 font-medium">Price: ${product.price}</p>
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
            <button
              onClick={() => addProduct(product._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// export async function getServerSideProps() {
//   await mongooseConnect();
//   const newProducts = await Product.find({}, null, { sort: { _id: -1 }, limit: 10 });
//   return {
//     props: {
//       newProducts: JSON.parse(JSON.stringify(newProducts)),
//     },
//   };
// }

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find(
    {}, 
    null, 
    { sort: { _id: -1 }, limit: 10 }
  );
  console.log("💾 fetched products:", newProducts);
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
