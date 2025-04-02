import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const List = () => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/product/list');

      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = list.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    fetchList();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setList((prevList) => prevList.filter((product) => product._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Error occurred while deleting the product'
      );
    }
  };

  return (
    <section className="py-4">
      <div className="container">
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

        <h2 className="h4 mb-4">All Product List</h2>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner size="lg" color="primary" className="my-5" />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Sizes</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          {product.image?.[0] ? (
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              className="img-thumbnail"
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: '200px' }}
                          title={product.description}
                        >
                          {product.description}
                        </td>
                        <td>
                          {currency}
                          {product.price}
                        </td>
                        <td>{product.category || '-'}</td>
                        <td>{product.subCategory || '-'}</td>
                        <td>
                          {product.size?.length > 0
                            ? product.size.join(', ')
                            : '-'}
                        </td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-blue">Edit</button>
                            <button
                              onClick={() => removeProduct(product._id)}
                              className="btn btn-red"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        {list.length === 0
                          ? 'No products available.'
                          : 'No products match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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

export default List;