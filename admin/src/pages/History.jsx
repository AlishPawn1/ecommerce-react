import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const History = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDays, setSelectedDays] = useState(7);
    const [filterApplied, setFilterApplied] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const fetchOrders = async (days) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authorization token found. Please login as admin.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${backendUrl}/api/order?days=${days}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(response.data.orders);
            setLoading(false);
            setError(null);
            setCurrentPage(1); // Reset to first page on new fetch
        } catch (err) {
            console.error("Error fetching orders:", err);

            let errorMessage = "Failed to fetch order history";

            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = "Unauthorized: Admin access required. Please login.";
                } else {
                    errorMessage += `: ${err.response.status} - ${err.response.data.message || "Server error"
                        }`;
                }
            } else if (err.request) {
                errorMessage +=
                    ": Unable to connect to the server. Please check if the backend is running.";
            } else {
                errorMessage += `: ${err.message}`;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(selectedDays);
    }, [filterApplied, selectedDays]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setFilterApplied(!filterApplied);
    };

    // Pagination calculations
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

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

    if (loading) {
        return (
            <section>
                <div className="container">
                    <div className="text-center py-5">Loading order history...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="container">
                    <div className="text-center py-5 text-danger">{error}</div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section>
                <div className="container">
                    <div className="main-title">
                        <h1 className="title">Order History</h1>
                    </div>
                </div>
            </section>

            <section className="filter-form py-3">
                <div className="container">
                    <form
                        onSubmit={handleFilterSubmit}
                        className="d-flex gap-2 w-150 align-items-center"
                    >
                        <label htmlFor="days" className="w-50 flex-[50%]">
                            Select Date Range:
                        </label>
                        <select
                            name="days"
                            id="days"
                            className="form-control"
                            value={selectedDays}
                            onChange={(e) => setSelectedDays(Number(e.target.value))}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 1 Month</option>
                            <option value="90">Last 3 Months</option>
                            <option value="365">Last 1 Year</option>
                        </select>
                        <button type="submit" className="btn btn-blue">
                            Filter
                        </button>
                    </form>
                </div>
            </section>

            <section className="history-table">
                <div className="container">
                    <h2 className="title text-center mb-4">
                        Order History for the Last {selectedDays} Days
                    </h2>

                    {currentOrders.length > 0 ? (
                        <>
                            {/* Scrollable wrapper */}
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table table-bordered" style={{ minWidth: '900px', width: '100%', textWrap: "nowrap",  }}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>User Name</th>
                                            <th>Product Name</th>
                                            <th>Amount Due</th>
                                            <th>Invoice Number</th>
                                            <th>Total Products</th>
                                            <th>Order Date</th>
                                            <th>Order Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders.map((order, index) => (
                                            <tr key={order.order_id}>
                                                <td>{indexOfFirstOrder + index + 1}</td> {/* Serial number */}
                                                <td>{order.user_name}</td>
                                                <td>{order.product_name}</td>
                                                <td>Rs. {order.amount_due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                                <td>{order.invoice_number}</td>
                                                <td>{order.total_products}</td>
                                                <td>{new Date(order.order_date).toLocaleString()}</td>
                                                <td>{order.order_status}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

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
                    ) : (
                        <div className="text-center py-5">
                            No orders found for the selected period
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default History;
