import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState(7);
  const [filterApplied, setFilterApplied] = useState(false);

  const fetchOrders = async (days) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order?days=${days}`);
      setOrders(response.data.orders);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
        } : null,
        request: err.request ? 'Request made but no response received' : null,
      });
      let errorMessage = 'Failed to fetch order history';
      if (err.response) {
        errorMessage += `: ${err.response.status} - ${err.response.data.message || 'Server error'}`;
      } else if (err.request) {
        errorMessage += ': Unable to connect to the server. Please check if the backend is running.';
      } else {
        errorMessage += `: ${err.message}`;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDays);
  }, [filterApplied, selectedDays]); // Added selectedDays to dependencies

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFilterApplied(!filterApplied); // Toggle to trigger useEffect
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
          <form onSubmit={handleFilterSubmit} className="d-flex gap-2 w-150 align-items-center">
            <label htmlFor="days" className='w-50 flex-[50%]'>Select Date Range:</label>
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
          {orders.length > 0 ? (
            <table className="table table-bordered">
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
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.user_name}</td>
                    <td>{order.product_name}</td>
                    <td>Rs. {order.amount_due.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>{order.invoice_number}</td>
                    <td>{order.total_products}</td>
                    <td>{new Date(order.order_date).toLocaleString()}</td>
                    <td>{order.order_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5">No orders found for the selected period</div>
          )}
        </div>
      </section>
    </>
  );
};

export default History;