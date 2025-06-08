import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Verify = () => {
    const { setCartItems } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/order/verifyStripe`, {
                success,
                orderId,
            });

            if (response.data.success) {
                setCartItems({});
                toast.success('Payment verified successfully');
                navigate('/order');
            } else {
                toast.error(response.data.message || 'Payment verification failed');
                navigate('/cart');
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification error');
            navigate('/cart');
        }
    };

    useEffect(() => {
        if (orderId) {
            verifyPayment();
        } else {
            // If there's no orderId, redirect to homepage
            navigate('/');
        }
    }, [orderId]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
                <p>Please wait while we verify your payment</p>
            </div>
        </div>
    );
};

export default Verify;