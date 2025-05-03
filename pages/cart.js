import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useRouter } from "next/router";

export default function CartPage() {
    const { cartProducts, removeProduct, clearCart, addProduct } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(response => {
                    setProducts(response.data);
                })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);


    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    const handleClearCart = () => {
        clearCart();
        router.push("/");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Your Cart</h1>
            {!cartProducts?.length && (
                <div>Your cart is empty</div>
            )}

            {cartProducts?.length > 0 &&
                <div>
                    <ul className="space-y-4">
                        {products.map((product) => {
                            const quantity = cartProducts.filter(id => id === product._id).length;
                            const totalPrice = product.price * quantity;

                            return (
                                <li
                                    key={product._id}
                                    className="border border-gray-300 rounded-lg p-4 shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        {product.images?.[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {product.title}
                                            </h3>
                                            <p className="text-gray-600">{product.description}</p>
                                            <p className="text-gray-800 font-medium">
                                                Price: ${product.price}
                                            </p>
                                            <p className="text-gray-800 font-medium">
                                                Quantity: {quantity}
                                            </p>
                                            <p className="text-gray-800 font-medium">
                                                Total: ${totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => moreOfThisProduct(product._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => lessOfThisProduct(product._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            -
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <button
                        onClick={handleClearCart}
                        className="mt-6 bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900"
                    >
                        Clear Cart
                    </button>

                    {/* Calculate total bill */}
                    <div className="mt-6 text-right">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Total Bill: ${products.reduce((sum, product) => {
                                const quantity = cartProducts.filter(id => id === product._id).length;
                                return sum + product.price * quantity;
                            }, 0).toFixed(2)}
                        </h2>
                    </div>
                </div>
            }
        </div>
    );
}
