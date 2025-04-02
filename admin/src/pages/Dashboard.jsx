import React from 'react';

const Dashboard = () => {
  // Static values (replace with your actual data later)
  const totalSales = 125000.50;
  const totalUsers = 42;
  const totalFeedback = 15;
  const totalPending = 8;
  const totalComplete = 34;

  return (
    <section className="dashboard-section">
      <div className="container">
        <div className='row g-4'>
          <div className='col-4'>
            <div className='dashboard-box'>
              <div className="icon">
                <i className="fa-solid fa-rupee-sign"></i>
              </div>
              <div className="content">
                <h3 className='title'>Total Sales</h3>
                <span>Rs. {totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='dashboard-box'>
              <div className="icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="content">
                <h3 className='title'>Total Users</h3>
                <span>{totalUsers}</span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='dashboard-box'>
              <div className="icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="content">
                <h3 className='title'>Feedback</h3>
                <span>{totalFeedback}</span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='dashboard-box'>
              <div className="icon">
                <i className="fa-solid fa-hourglass-start"></i>
              </div>
              <div className="content">
                <h3 className='title'>Pending Orders</h3>
                <span>{totalPending}</span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='dashboard-box'>
              <div className="icon">
                <i className="fa-regular fa-circle-check"></i>
              </div>
              <div className="content">
                <h3 className='title'>Complete Orders</h3>
                <span>{totalComplete}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;