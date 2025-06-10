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
  const [user, setUser] = useState({
    userId: localStorage.getItem('userId') || '',
    name: localStorage.getItem('name') || '' // Changed to 'name'
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    try {
      const userId = user.userId;
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
    const userId = user.userId;
    if (!userId || !itemId || !size || quantity < 0) {
      toast.error('Invalid quantity or missing fields');
      return;
    }

    let updatedCart = structuredClone(cartItem);
    if (quantity === 0) {
      delete updatedCart[itemId]?.[size];
      if (updatedCart[itemId] && Object.keys(updatedCart[itemId]).length === 0) {
        delete updatedCart[itemId];
      }
    } else {
      if (!updatedCart[itemId]) updatedCart[itemId] = {};
      updatedCart[itemId][size] = quantity;
    }
    setCartItems(updatedCart);

    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { userId, itemId, size, quantity },
          {
            headers: { Authorization: `Bearer ${token}` }
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
        const updatedCart = { ...cartItem };
        delete updatedCart[itemId];
        setCartItems(updatedCart);
      }
    }
    return totalAmount;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data?.success) {
        setProducts(response.data.products);
      } else {
        console.error('Unexpected API response structure:', response.data);
        toast.error('Failed to fetch products list');
      }
    } catch (error) {
      console.error('Error fetching product data:', error.response || error.message);
      toast.error('Error fetching product data');
    } finally {
      setLoading(false);
    }
  };

  const getUserCart = async () => {
    const userId = user.userId;
    if (!userId) {
      toast.error('Please log in to view your cart');
      navigate('/login');
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
        throw new Error('Failed to fetch cart data');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        toast.error('Error fetching cart data');
      }
    }
  };

  const incrementViewCount = async (productId) => {
    try {
      console.log(`Sending view count increment for product ID: ${productId}`);
      const response = await axios.post(`${backendUrl}/api/product/view/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('View count incremented:', response.data);
    } catch (error) {
      console.error('Error incrementing view count:', error.message, error.response?.data);
    }
  };

  const addReview = async (productId, reviewData) => {
    try {
      console.log(`Submitting review for product ID: ${productId}`, reviewData);
      const response = await axios.post(
        `${backendUrl}/api/product/reviews/${productId}`,
        // { ...reviewData, username: user.name }, // Changed to user.name
        { ...reviewData, username: user.name, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        // toast.success('Review submitted successfully!');
        await getProductData();
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error.message, error.response?.data);
      toast.error('Failed to submit review.');
      throw error;
    }
  };

  const fetchTopProducts = async (sortBy) => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/top?by=${sortBy}`);
      if (response.data.success) {
        return response.data.data || [];
      } else {
        throw new Error('Failed to fetch top products');
      }
    } catch (error) {
      console.error('Error fetching top products:', error.message, error.response?.data);
      toast.error('Failed to fetch top products');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name'); // Changed to 'name'
    setToken('');
    setUser({ userId: '', name: '' });
    setCartItems({});
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('name'); // Changed to 'name'
    console.log('Initializing user:', { storedUserId, storedName });

    if (storedToken) {
      setToken(storedToken);
      setUser({ userId: storedUserId || '', name: storedName || '' });
      getUserCart().catch((error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
      });
    }
    getProductData();
  }, []);

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
    token,
    setToken,
    user,
    setUser,
    setCartItems,
    loading,
    incrementViewCount,
    addReview,
    fetchTopProducts
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;