import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { assets } from '../assets/assets';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const paginationBtnStyle = {
    height: '25px',
    width: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    transition: 'background-color 0.3s',
    borderRadius: '5px',
};

const Order = () => {
    const { products, backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

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
                            _orderId: order._id, // optional: keep order id for key if needed
                        });
                    });
                });
                setOrderData(allOrdersItem.reverse());
                setCurrentPage(1); // Reset page on new fetch
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

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orderData.length / ordersPerPage);

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
                    <>
                        <div>
                            {currentOrders.map((item, index) => {
                                const productData = products.find((product) => product._id === item._id);
                                return (
                                    <div
                                        className="order-item py-4 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                        key={item._orderId ? `${item._orderId}-${index}` : index}
                                    >
                                        <div className="flex items-start gap-6 text-sm">
                                            <img
                                                src={productData?.image?.[0]}
                                                className="w-16 h-22 object-cover object-top sm:w-20"
                                                alt={productData?.name || 'Product'}
                                            />
                                            <div>
                                                <p className="sm:text-base font-medium">{item.name || 'Unknown Product'}</p>
                                                <div className="flex items-center gap-3 mt-1 text-base text-gray-600">
                                                    <p>
                                                        {currency}
                                                        {item.price ?? 'N/A'}
                                                    </p>
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

                        {/* Pagination Controls */}
                        <nav className="flex justify-center mt-8 gap-2" aria-label="Order history pagination">
                            <button
                                style={{
                                    ...paginationBtnStyle,
                                    backgroundColor: currentPage === 1 ? '#e0e0e0' : '#000',
                                    color: currentPage === 1 ? '#888' : '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                }}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
                                }}
                            >
                                <AiOutlineLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    style={{
                                        ...paginationBtnStyle,
                                        backgroundColor: currentPage === page ? '#000' : '#fff',
                                        color: currentPage === page ? '#fff' : '#000',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setCurrentPage(page)}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== page) e.currentTarget.style.backgroundColor = '#ddd';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== page) e.currentTarget.style.backgroundColor = '#fff';
                                    }}
                                    aria-label={`Go to page ${page}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                style={{
                                    ...paginationBtnStyle,
                                    backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#000',
                                    color: currentPage === totalPages ? '#888' : '#fff',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                }}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
                                }}
                            >
                                <AiOutlineRight />
                            </button>
                        </nav>
                    </>
                )}
            </div>
        </section>
    );
};

export default Order;
