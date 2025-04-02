import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [originalName, setOriginalName] = useState(""); // Store the old name
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/categories/${id}`);
      if (response.data.success && response.data.data) {
        setCategory(response.data.data);
        setCategoryName(response.data.data.name); // Set the current name for editing
        setOriginalName(response.data.data.name); // Store the original name
      } else {
        toast.error(response.data.message || "Category not found");
        navigate("/insertCategory");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error(error.response?.data?.message || "Error fetching category");
      navigate("/insertCategory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/api/product/categories/${id}`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Category updated successfully");
        navigate("/insertCategory");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Error updating category");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="section-gaps">
        <div className="container text-center">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="section-gaps">
        <div className="container text-center">
          <p>Category not found</p>
          <button
            onClick={() => navigate("/insertCategory")}
            className="btn btn-blue"
          >
            Back to Category Management
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-category section-gaps">
      <div className="container">
        <div className="title text-center mb-5">
          <h1 className="heading">Edit Category</h1>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleUpdateCategory}>
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      className="form-control form-control-lg"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      disabled={updating}
                    />
                    <div className="form-text">
                      Enter the updated name for this category
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">
                        Original Name: {originalName}
                      </small>
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      onClick={() => navigate("/insertCategory")}
                      className="btn btn-red"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-blue"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Update Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditCategory;