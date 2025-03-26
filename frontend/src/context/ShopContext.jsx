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
    const [cartItem, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    // Add product to the cart
    const addToCart = async (itemId, size) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error('Please log in to add items to your cart');
                navigate('/login');
                return;
            }

            if (!itemId || !size) {
                toast.error('Missing required fields');
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/cart/add`,
                { userId, itemId, size },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Added to cart');
                const updatedCart = { ...cartItem };
                if (!updatedCart[itemId]) {
                    updatedCart[itemId] = {};
                }
                if (!updatedCart[itemId][size]) {
                    updatedCart[itemId][size] = 0;
                }
                updatedCart[itemId][size] += 1;
                setCartItems(updatedCart);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    // Get the total item count in the cart
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

    // Update the quantity of an item in the cart
    const updateQuantity = async (itemId, size, quantity) => {
        const userId = localStorage.getItem('userId');
        if (!userId || !itemId || !size || quantity < 0) {
            toast.error('Invalid quantity or missing fields');
            return;
        }

        if (quantity === 0) {
            // Handle item removal
            let updatedCart = structuredClone(cartItem);
            delete updatedCart[itemId][size];
            if (Object.keys(updatedCart[itemId]).length === 0) {
                delete updatedCart[itemId];
            }
            setCartItems(updatedCart);
        } else {
            // Update quantity if it's greater than 0
            let cartData = structuredClone(cartItem);
            cartData[itemId][size] = quantity;
            setCartItems(cartData);
        }

        if (token) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { userId, itemId, size, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.data.success) {
                    toast.error('Failed to update cart');
                }
            } catch (error) {
                console.error('Error updating cart:', error);
                toast.error('Failed to update cart');
            }
        }
    };

    // Get the total amount of the items in the cart
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItem) {
            const product = products.find((p) => p._id === itemId);
            if (product) {
                for (const size in cartItem[itemId]) {
                    totalAmount += product.price * cartItem[itemId][size];
                }
            } else {
                console.warn(`⚠️ Product not found for ID: ${itemId}`);
                // Remove the product from the cart if it doesn't exist
                const updatedCart = { ...cartItem };
                delete updatedCart[itemId];
                setCartItems(updatedCart);
            }
        }
        return totalAmount;
    };

    // Fetch product data from the backend
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data?.products) {
                setProducts(response.data.products);
            } else {
                console.error("Unexpected API response structure:", response.data);
                toast.error("Failed to fetch products list");
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            toast.error("Error fetching product data");
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Fetch user's cart data
    const getUserCart = async (token) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Please log in to view your cart");
            navigate("/login");
            return;
        }
    
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                throw new Error("Failed to fetch cart data");
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
    
            // Handle 401 Unauthorized error
            if (error.response && error.response.status === 401) {
                toast.error("Your session has expired. Please log in again.");
                localStorage.removeItem("token"); // Clear invalid token
                localStorage.removeItem("userId"); // Clear user ID
                localStorage.removeItem("userName"); // Clear user name
                setToken(""); // Clear token in state
                setUserName(""); // Clear username in state
                navigate("/login"); // Redirect to login page
            } else {
                toast.error("Error fetching cart data");
            }
        }
    };

    // Fetch product data on component mount
    useEffect(() => {
        getProductData();
    }, []);

    // Initialize token and userName from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('userName');
    
        if (storedToken) {
            // Verify token validity before using it
            setToken(storedToken);
            getUserCart(storedToken).catch((error) => {
                if (error.response && error.response.status === 401) {
                    // Handle invalid token
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userName");
                    setToken("");
                    setUserName("");
                    navigate("/login");
                }
            });
        }
    
        if (storedUserName) {
            setUserName(storedUserName);
        }
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
        setToken,
        token,
        userName,
        setUserName,
        setCartItems,
        loading, // Expose loading state
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;