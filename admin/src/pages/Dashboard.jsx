// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalFeedback: 0,
    totalPending: 0,
    totalComplete: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard/metrics`);
        setMetrics(response.data.data);
        setLoading(false);
      } catch (err) {
        // Log detailed error information to console
        console.error('Error fetching metrics:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
          } : null,
          request: err.request ? 'Request made but no response received' : null,
        });

        // Set a user-friendly error message
        let errorMessage = 'Failed to load dashboard data';
        if (err.response) {
          // Server responded with a status code (e.g., 404, 500)
          errorMessage += `: ${err.response.status} - ${err.response.data.message || 'Server error'}`;
        } else if (err.request) {
          // Request was made but no response (e.g., server down, CORS)
          errorMessage += ': Unable to connect to the server. Please check if the backend is running.';
        } else {
          // Other errors (e.g., network issues)
          errorMessage += `: ${err.message}`;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Optional: Function to calculate total cart items (if still needed)
  const getTotalCartItems = () => {
    return 0; // Replace with actual logic if needed
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="dashboard-section">
      <div className="container">
        <div className="row g-4">
          <div className="col-4">
            <div className="dashboard-box">
              <div className="icon">
                <i className="fa-solid fa-rupee-sign"></i>
              </div>
              <div className="content">
                <h3 className="title">Total Sales</h3>
                <span>Rs. {metrics.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="dashboard-box">
              <div className="icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="content">
                <h3 className="title">Total Users</h3>
                <span>{metrics.totalUsers}</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="dashboard-box">
              <div className="icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="content">
                <h3 className="title">Feedback</h3>
                <span>{metrics.totalFeedback}</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="dashboard-box">
              <div className="icon">
                <i className="fa-solid fa-hourglass-start"></i>
              </div>
              <div className="content">
                <h3 className="title">Pending Orders</h3>
                <span>{metrics.totalPending}</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="dashboard-box">
              <div className="icon">
                <i className="fa-regular fa-circle-check"></i>
              </div>
              <div className="content">
                <h3 className="title">Complete Orders</h3>
                <span>{metrics.totalComplete}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;