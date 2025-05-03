import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default function HomePage({newProducts}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to the Home Page</h1>
      <p className="text-lg text-gray-700 mb-6">This is a simple Next.js application.</p>
      <h2 className="text-2xl font-semibold text-green-600 mb-4">New Products</h2>
      <ul className="space-y-4">
        {newProducts.map(product => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit: 10});
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  }
}