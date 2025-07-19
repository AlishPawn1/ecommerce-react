// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const orderStatuses = [
  { key: 'Pending', label: 'Pending', icon: 'fa-regular fa-clock' },
  { key: 'Packing', label: 'Packing', icon: 'fa-solid fa-box-open' },
  { key: 'Shipping', label: 'Shipping', icon: 'fa-solid fa-truck' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: 'fa-solid fa-motorcycle' },
  { key: 'Completed', label: 'Completed', icon: 'fa-regular fa-circle-check' },
];

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalFeedback: 0,
    totalPending: 0,
    totalPacking: 0,
    totalShipping: 0,
    totalOutForDelivery: 0,
    totalCompleted: 0,
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricsRes, statusCountsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/dashboard/metrics`),
          axios.get(`${backendUrl}/api/order/status-counts`),
        ]);
        setMetrics(metricsRes.data.data);
        setStatusCounts(statusCountsRes.data.counts || {});
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
          {/* Order status counts with icons and correct counts */}
          {orderStatuses.map(({ key, label, icon }) => (
            <div className="col-4" key={key}>
              <div className="dashboard-box">
                <div className="icon">
                  <i className={icon}></i>
                </div>
                <div className="content">
                  <h3 className="title">{label}</h3>
                  <span>{statusCounts[key] || metrics[`total${key.replace(' ', '')}`] || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
