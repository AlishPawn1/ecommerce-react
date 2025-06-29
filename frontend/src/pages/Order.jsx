import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { assets } from '../assets/assets';

const Order = () => {
    const { products, backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadOrderData = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${backendUrl}/api/order/userorders`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.forEach((order) => {
                    order.items.forEach((item) => {
                        allOrdersItem.push({
                            ...item,
                            status: order.status,
                            payment: order.payment,
                            paymentMethod: order.paymentMethod,
                            date: order.date,
                        });
                    });
                });
                setOrderData(allOrdersItem.reverse());
            } else {
                setError('Failed to fetch orders.');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('An error occurred while fetching your orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    return (
        <section className="order-section pt-16">
            <div className="container">
                <div className="text-2xl">
                    <Title text1={'My'} text2={'Orders'} />
                </div>
                {loading && <p>Loading orders...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && orderData.length === 0 && <p>No orders found.</p>}
                {!loading && !error && orderData.length > 0 && (
                    <div>
                        {orderData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);
                            return (
                                <div
                                    className="order-item py-4 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                    key={index}
                                >
                                    <div className="flex items-start gap-6 text-sm">
                                        <img
                                            src={productData?.image?.[0]}
                                            className="w-16 sm:w-20"
                                            alt={productData?.name || 'Product'}
                                        />
                                        <div>
                                            <p className="sm:text-base font-medium">{item.name || 'Unknown Product'}</p>
                                            <div className="flex items-center gap-3 mt-1 text-base text-gray-600">
                                                <p>{currency}{item.price ?? 'N/A'}</p>
                                                <p>Quantity: {item.quantity ?? 1}</p>
                                                <p>Size: {item.size ?? 'N/A'}</p>
                                            </div>
                                            <p>
                                                Date:{' '}
                                                <span className="text-gray-400">
                                                    {item.date
                                                        ? new Intl.DateTimeFormat('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }).format(new Date(item.date))
                                                        : 'N/A'}
                                                </span>
                                            </p>
                                            <p>
                                                Payment:{' '}
                                                <span className="text-gray-400">{item.paymentMethod ?? 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 flex justify-end">
                                        <div className="flex items-center gap-2">
                                            <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                            <p className="text-sm md:text-base">{item.status ?? 'Unknown'}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Order;