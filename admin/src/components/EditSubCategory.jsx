import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubCategoryDetails();
  }, [id]);

  const fetchSubCategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/subcategories/${id}`);
      if (response.data.success && response.data.data) {
        setSubCategory(response.data.data);
        setSubCategoryName(response.data.data.name);
        setOriginalName(response.data.data.name);
      } else {
        toast.error(response.data.message || "Subcategory not found");
        navigate("/insertSubCategory");
      }
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      toast.error(error.response?.data?.message || "Error fetching subcategory");
      navigate("/insertSubCategory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();

    if (!subCategoryName.trim()) {
      toast.error("Subcategory name cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/api/product/subcategories/${id}`,
        { name: subCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Subcategory updated successfully");
        navigate("/insertSubCategory");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error(error.response?.data?.message || "Error updating subcategory");
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

  if (!subCategory) {
    return (
      <section className="section-gaps">
        <div className="container text-center">
          <p>Subcategory not found</p>
          <button
            onClick={() => navigate("/insertSubCategory")}
            className="btn btn-blue"
          >
            Back to Subcategory Management
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-subcategory section-gaps">
      <div className="container">
        <div className="title text-center mb-5">
          <h1 className="heading">Edit Subcategory</h1>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleUpdateSubCategory}>
                  <div className="mb-3">
                    <label htmlFor="subCategoryName" className="form-label">
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      id="subCategoryName"
                      className="form-control form-control-lg"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      required
                      disabled={updating}
                    />
                    <div className="form-text">
                      Enter the updated name for this subcategory
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
                      onClick={() => navigate("/insertSubCategory")}
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
                      {updating ? "Updating..." : "Update Subcategory"}
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

export default EditSubCategory;