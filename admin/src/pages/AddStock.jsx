import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const AddStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <section className="add-stock section-gaps">
        <div className="container">
          <LoadingSpinner size="lg" className="my-5" />
        </div>
      </section>
    );
  }

  return (
    <section className="add-stock section-gaps">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="heading mb-0">Stock Management</h1>
            <p className="text-muted mb-0">Manage your product inventory</p>
          </div>
          <button 
            onClick={handleRefresh} 
            className="btn btn-blue"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <LoadingSpinner size="sm" color="light" className="me-2" />
                Refreshing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-clock-rotate-left me-2"></i> 
                Refresh
              </>
            )}
          </button>
        </div>

        {refreshing ? (
          <LoadingSpinner size="lg" className="my-5" />
        ) : (
          <>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="row justify-content-between align-items-center">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <span className="text-muted">
                      Showing {filteredProducts.length} products
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.image?.[0] && (
                              <img
                                src={product.image[0]}
                                alt={product.name}
                                className="rounded me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <strong>{product.name}</strong>
                              <div className="text-muted small">SKU: {product._id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {product.category}
                          {product.subCategory && ` / ${product.subCategory}`}
                        </td>
                        <td>
                          <span className={product.stock <= 10 ? 'text-danger fw-bold' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          {product.stock === 0 ? (
                            <span className="badge bg-danger">Out of Stock</span>
                          ) : product.stock <= 10 ? (
                            <span className="badge bg-warning text-dark">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/stock/${product._id}`)}
                            className="btn btn-blue"
                          >
                            <i className="fa-solid fa-pencil me-2"></i> Update
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        {searchTerm ? (
                          <>No products found matching "<strong>{searchTerm}</strong>"</>
                        ) : (
                          'No products available'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AddStock;