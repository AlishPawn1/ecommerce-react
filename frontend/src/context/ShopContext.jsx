import { createContext, useEffect, useState } from 'react';
import React from 'react';
import { products } from '../assets/assets'; // Ensure this import is correct
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const navigate = useNavigate();  // Correct usage of useNavigate

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItem);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);
        toast.success('Product Added to Cart');
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    totalCount += cartItem[items][item];
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem);
        cartData[itemId][size] = quantity;
        setCartItem(cartData);
        toast.success('Cart update successfully');
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        // Iterate over cart items
        for (const itemId in cartItem) {
            let itemInfo = products.find((product) => product.id === Number(itemId)); // Use itemId, converted to a number

            // Iterate over different sizes for each product in the cart
            for (const size in cartItem[itemId]) {
                const quantity = cartItem[itemId][size];
                if (quantity > 0 && itemInfo) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }

        return totalAmount;
    };

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItem, addToCart, getCartCount, updateQuantity, getCartAmount,
        navigate,  // Make navigate available through context
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
