import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
    const { products, token, currency, cartItem, updateQuantity, navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const tempData = [];
        for (const items in cartItem) {
            if (items === "undefined") continue; // Skip invalid entries
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItem[items][item],
                    });
                }
            }
        }
        setCartData(tempData);
    }, [cartItem, products]);

    // If token is not set, show a login prompt
    if (!token) {
        return (
            <section className="cart-section">
                <div className="container">
                    <div className="text-2xl mb-3">
                        <Title text1="Your" text2="Cart" />
                    </div>
                    <p className="text-center text-gray-500 mt-4">
                        Please log in to view your cart.
                    </p>
                    <div className="w-full text-center mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-black"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // If products are not loaded, show loading message
    if (!products || products.length === 0) {
        console.warn("⚠️ Products data is empty.");
        return (
            <section className="cart-section">
                <div className="container">
                    <div className="text-2xl mb-3">
                        <Title text1="Your" text2="Cart" />
                    </div>
                    <p className="text-center py-10 text-gray-500">Loading cart items...</p>
                </div>
            </section>
        );
    }

    // Render the cart if token and products are available
    return (
        <section className="cart-section">
            <div className="container">
                <div className="text-2xl mb-3">
                    <Title text1="Your" text2="Cart" />
                </div>

                <div>
                    {cartData.length > 0 ? (
                        cartData.map((item) => {
                            const productData = products.find(
                                (product) => product._id === item._id
                            );

                            if (!productData) {
                                console.warn(`⚠️ Product not found for ID: ${item._id}`);
                                return null;
                            }

                            return (
                                <div
                                    key={`${item._id}-${item.size}`}
                                    className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                                >
                                    <div className="flex items-center gap-6">
                                        <img
                                            src={productData.image?.[0] || assets.placeholderImage}
                                            className="w-16 sm:w-20"
                                            alt={productData.name}
                                        />
                                        <div>
                                            <p className="text-sm sm:text-lg font-medium">{productData.name}</p>
                                            <div className="flex items-center gap-5 mt-2">
                                                <p>
                                                    {currency}{productData.price}
                                                </p>
                                                <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                                                    {item.size}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            if (value && Number(value) > 0) {
                                                updateQuantity(item._id, item.size, Number(value));
                                            }
                                        }}
                                        type="number"
                                        className="border max-w-10 sm:max-w-20 p-1 sm:px-2"
                                        min={1}
                                        max={productData.stock}
                                        defaultValue={item.quantity}
                                    />

                                    <img
                                        onClick={() => updateQuantity(item._id, item.size, 0)}
                                        className="w-4 mr-4 sm:w-5 cursor-pointer"
                                        src={assets.removeIcon}
                                        alt="Remove Item"
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
                    )}

                    <div className="flex justify-end my-20">
                        <div className="w-full sm:w-[450px]">
                            <CartTotal />
                            <div className="w-full text-end">
                                <button onClick={() => navigate('/place-order')} className="btn-black">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;