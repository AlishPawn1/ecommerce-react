import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDate] = useState(new Date().toLocaleString());

  useEffect(() => {
    const fetchProductReport = async () => {
      try {
        const response = await axios.get('/api/products/report');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product report');
        setLoading(false);
        console.error('Error fetching product report:', err);
      }
    };

    fetchProductReport();
  }, []);

  if (loading) {
    return (
      <div className="report-container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading product report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Product Report</h1>
        <p>Generated on: {reportDate}</p>
      </div>

      {products.length > 0 ? (
        <div className="table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>In Store</th>
                <th>Date Added</th>
                <th>Stock Update Date</th>
                <th>Quantity Added</th>
                <th>Items Sold</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>${product.product_price.toFixed(2)}</td>
                  <td>{product.product_in_store}</td>
                  <td>{new Date(product.date).toLocaleDateString()}</td>
                  <td>
                    {product.stock_update_date 
                      ? new Date(product.stock_update_date).toLocaleDateString() 
                      : 'N/A'}
                  </td>
                  <td>{product.quantity_added || 0}</td>
                  <td>{product.items_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-products">No products found.</p>
      )}

      <div className="report-actions">
        <button 
          onClick={() => window.print()}
          className="print-button"
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ListReport;