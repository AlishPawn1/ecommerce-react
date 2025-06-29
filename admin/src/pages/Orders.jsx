import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

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


    const fetchAllOrders = async () => {
        if (!token) {
            console.log("No token provided");
            toast.error("Please log in to view orders");
            return;
        }

        try {
            console.log("Fetching orders from:", `${backendUrl}/api/order/list`);
            console.log("Token:", token);

            const response = await axios.post(
                `${backendUrl}/api/order/list`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setOrders(response.data.orders);
                setCurrentPage(1); // Reset page on new fetch
                console.log("Orders fetched:", response.data.orders);
            } else {
                console.log("Server error:", response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            toast.error(error.response?.data?.message || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Authentication failed. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            setIsUpdatingStatus(orderId);
            const newStatus = event.target.value;
            console.log(`Updating order ${orderId} to status: ${newStatus}`);

            const response = await axios.post(
                `${backendUrl}/api/order/status`,
                { orderId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                toast.success("Order status updated successfully");
            } else {
                console.log("Server error:", response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Update Status Error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            toast.error(error.response?.data?.message || "Failed to update status");
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Admin access required or session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    const paymentStatusHandler = async (event, orderId) => {
        try {
            setIsUpdatingPayment(orderId);
            const newPaymentStatus = event.target.value === "Done";
            console.log(`Updating order ${orderId} payment status to: ${newPaymentStatus ? "Done" : "Pending"}`);

            const response = await axios.post(
                `${backendUrl}/api/order/payment-status`,
                { orderId, payment: newPaymentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, payment: newPaymentStatus } : order
                    )
                );
                toast.success("Payment status updated successfully");
            } else {
                console.log("Server error:", response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Update Payment Status Error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            toast.error(error.response?.data?.message || "Failed to update payment status");
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Admin access required or session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } finally {
            setIsUpdatingPayment(null);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4">Order Page</h3>
            {orders.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
            ) : (
                <>
                    {currentOrders.map((order, index) => (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 rounded-lg"
                            key={order._id || index}
                        >
                            <img className="w-12" src={assets.parcel_icon} alt="parcel icon" />
                            <div>
                                <div>
                                    {order.items.map((item, itemIndex) => (
                                        <p className="py-0.5" key={itemIndex}>
                                            {item.name} x {item.quantity} <span>({item.size})</span>
                                            {itemIndex !== order.items.length - 1 ? "," : ""}
                                        </p>
                                    ))}
                                </div>
                                <p className="mt-3 mb-2 font-medium">
                                    {order.address.firstName + " " + order.address.lastName}
                                </p>
                                <div>
                                    <p>{order.address.street + ","}</p>
                                    <p>
                                        {order.address.city +
                                            ", " +
                                            order.address.state +
                                            ", " +
                                            order.address.country +
                                            ", " +
                                            order.address.zipcode}
                                    </p>
                                </div>
                                <p>{order.address.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                                <p className="mt-3">Method: {order.paymentMethod}</p>
                                <p>
                                    Payment: {order.payment ? "Done" : "Pending"}
                                    {order.paymentMethod === "COD" && (
                                        <select
                                            onChange={(event) => paymentStatusHandler(event, order._id)}
                                            value={order.payment ? "Done" : "Pending"}
                                            className="ml-2 p-1 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            disabled={isUpdatingPayment === order._id}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    )}
                                </p>
                                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm sm:text-[15px]">
                                {currency}
                                {order.amount}
                            </p>
                            <select
                                onChange={(event) => statusHandler(event, order._id)}
                                value={order.status}
                                className="p-2 font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={isUpdatingStatus === order._id}
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {/* Pagination Controls */}
                    <nav className="pagination justify-content-center gap-2" aria-label="Order history pagination">
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
                            onMouseEnter={e => {
                                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                            }}
                            onMouseLeave={e => {
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
                                onMouseEnter={e => {
                                    if (currentPage !== page) e.currentTarget.style.backgroundColor = '#ddd';
                                }}
                                onMouseLeave={e => {
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
                            onMouseEnter={e => {
                                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#333';
                            }}
                            onMouseLeave={e => {
                                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000';
                            }}
                        >
                            <AiOutlineRight />
                        </button>
                    </nav>
                </>
            )}
        </div>
    );
};

export default Orders;
