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
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
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
                setCartItem(updatedCart);
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
        const userId = localStorage.getItem('userId');  // Declare and fetch userId here
        if (!userId || !itemId || !size || quantity < 0) {  // Allow 0 for removal
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
            setCartItem(updatedCart);
        } else {
            // Update quantity if it's greater than 0
            let cartData = structuredClone(cartItem);
            cartData[itemId][size] = quantity;
            setCartItem(cartData);
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
            const product = products.find((product) => product._id === itemId);

            if (product) {
                for (const size in cartItem[itemId]) {
                    const quantity = cartItem[itemId][size];
                    if (quantity > 0) {
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

    const getUserCart = async (token) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('Please log in to view your cart');
            navigate('/login');
            return;
        }
    
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                { userId }, // Passing userId here instead of itemId and size
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                setCartItem(response.data.cartData);
            } else {
                throw new Error('Failed to fetch cart data');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Error fetching cart data');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                toast.error('Session expired. Please log in again.');
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
            setToken(storedToken);
            getUserCart(storedToken);
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
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
