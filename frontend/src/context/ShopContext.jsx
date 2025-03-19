import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs. ';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Add product to the cart
    const addToCart = async (itemId, size) => {
        if (!itemId || !size) {
            toast.error('Invalid product or size');
            return;
        }

        // Clone the cart item object to avoid direct mutation
        let cartData = structuredClone(cartItem);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1; // Increment quantity for the given size
            } else {
                cartData[itemId][size] = 1; // If size doesn't exist, initialize with 1
            }
        } else {
            cartData[itemId] = {}; // Initialize the item with the given size
            cartData[itemId][size] = 1;
        }

        setCartItem(cartData);
        toast.success('Product Added to Cart');
    };

    // Get the total item count in the cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    totalCount += cartItem[items][item]; // Sum up all quantities
                }
            }
        }
        return totalCount;
    };

    // Update the quantity of an item in the cart
    const updateQuantity = async (itemId, size, quantity) => {
        if (!itemId || !size) {
            toast.error('Invalid product or size');
            return;
        }

        // Clone the cart item object to avoid direct mutation
        let cartData = structuredClone(cartItem);

        if (!cartData[itemId]) {
            cartData[itemId] = {}; // Initialize the item if it doesn't exist
        }

        cartData[itemId][size] = quantity; // Update the quantity for the specific item and size
        setCartItem(cartData);
        toast.success('Cart updated successfully');
    };

    // Get the total amount of the items in the cart
    const getCartAmount = () => {
        let totalAmount = 0;
    
        // Iterate over cart items
        for (const itemId in cartItem) {
            // Find the product in the products array
            const product = products.find((product) => product._id === itemId);
    
            if (product) {
                // Iterate over sizes for the product
                for (const size in cartItem[itemId]) {
                    const quantity = cartItem[itemId][size];
                    if (quantity > 0) {
                        // Calculate the total amount for this item
                        totalAmount += product.price * quantity;
                    }
                }
            } else {
                console.warn(`⚠️ Product not found for ID: ${itemId}`);
            }
        }
    
        return totalAmount;
    };

    // Fetch product data from the backend
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data && response.data.products) {
                setProducts(response.data.products);
            } else {
                console.error("Unexpected API response structure:", response.data);
                toast.error("Failed to fetch products list");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Error fetching product data");
        }
    };

    // Fetch product data on component mount
    useEffect(() => {
        getProductData();
    }, []);

    // Provide context values to children
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;