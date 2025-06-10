import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null); // Track updating state for order status
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(null); // Track updating state for payment status

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
      setIsUpdatingStatus(orderId); // Disable select for this order's status
      const newStatus = event.target.value;
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          );
          console.log("Updated orders:", updatedOrders);
          return updatedOrders;
        });
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
      setIsUpdatingStatus(null); // Re-enable select
    }
  };

  const paymentStatusHandler = async (event, orderId) => {
    try {
      setIsUpdatingPayment(orderId); // Disable select for this order's payment status
      const newPaymentStatus = event.target.value === "Done";
      console.log(`Updating order ${orderId} payment status to: ${newPaymentStatus ? "Done" : "Pending"}`);

      const response = await axios.post(
        `${backendUrl}/api/order/payment-status`,
        { orderId, payment: newPaymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === orderId ? { ...order, payment: newPaymentStatus } : order
          );
          console.log("Updated orders:", updatedOrders);
          return updatedOrders;
        });
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
      setIsUpdatingPayment(null); // Re-enable select
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Order Page</h3>
      <div>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 rounded-lg"
              key={order._id || index} // Use order._id for key
            >
              <img
                className="w-12"
                src={assets.parcel_icon}
                alt="parcel icon"
              />
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
                <p className="text-sm sm:text-[15px]">
                  Items: {order.items.length}
                </p>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;