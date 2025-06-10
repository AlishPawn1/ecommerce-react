import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom'; // Added for redirection

const InsertSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const token = localStorage.getItem('token'); // Get token

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const response = await axios.get(`${backendUrl}/api/product/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setSubCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subcategories');
      toast.error(err.response?.data?.message || 'Failed to load subcategories');
      console.error('Error fetching subcategories:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to login on 401
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to access this page');
      navigate('/login');
      return;
    }
    fetchSubCategories();
  }, [token, navigate]);

  const handleInsertSubCategory = async (e) => {
    e.preventDefault();
    const trimmedName = subCategoryName.trim();

    if (!trimmedName) {
      toast.warning('Subcategory name cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.get(`${backendUrl}/api/product/subcategories/check`, {
        params: { name: trimmedName },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.exists) {
        toast.warning('Subcategory already exists');
        return;
      }

      await axios.post(
        `${backendUrl}/api/product/subcategories`,
        { name: trimmedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${trimmedName} added successfully`);
      setSubCategoryName('');
      await fetchSubCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subcategory');
      console.error('Error adding subcategory:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;

    try {
      const response = await axios.delete(`${backendUrl}/api/product/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setSubCategories((prevSubCategories) =>
          prevSubCategories.filter((subcategory) => subcategory._id !== id)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error(error.response?.data?.message || 'Error occurred while deleting the subcategory');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">
        {error}
        <button onClick={fetchSubCategories} className="btn btn-link">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card shadow-sm">
            <div className="card-header bg-white p-3 pb-0">
              <h3 className="mb-0">Existing Subcategories</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Subcategory Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(subCategories) && subCategories.length > 0 ? (
                      subCategories.map((subcategory, index) => (
                        <tr key={subcategory._id || '-'}>
                          <td>{index + 1}</td>
                          <td>{subcategory.name || '-'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleDeleteSubCategory(subcategory._id, subcategory.name)}
                                className="btn btn-red"
                                disabled={isSubmitting}
                              >
                                Delete
                              </button>
                              <a
                                href={`/edit-sub-category/${subcategory._id || subcategory.id}`}
                                className="btn btn-blue"
                              >
                                Edit
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No subcategories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white p-3 pb-0">
              <h3 className="mb-0">Add New Subcategory</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleInsertSubCategory}>
                <div className="mb-3">
                  <label htmlFor="subCategoryName" className="form-label">
                    Subcategory Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="subCategoryName"
                    className="form-control"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-blue"
                  disabled={isSubmitting || !subCategoryName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    'Add Subcategory'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertSubCategory;