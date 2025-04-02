import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
// import LoadingSpinner from '../components/LoadingSpinner';

const EditStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Use the correct endpoint from your backend routes
      const response = await axios.get(`${backendUrl}/api/product/stock/${id}`);
      if (response.data.product) {
        setProduct(response.data.product);
        setStock(response.data.product.stock);
      } else {
        toast.error("Product not found");
        navigate("/addstock");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(error.response?.data?.message || "Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    if (stock === "" || isNaN(stock)) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    try {
      setUpdating(true);
      // Calculate the new stock by adding the input value to the current stock
      const stockToAdd = parseInt(stock);
      const newStock = product.stock + stockToAdd;

      const response = await axios.put(
        `${backendUrl}/api/product/stock/${id}`,
        { stock: newStock } // Send the total stock, not just the increment
      );

      if (response.data.success) {
        toast.success(
          `Added ${stockToAdd} items to stock. New stock: ${newStock}`
        );
        navigate("/addstock");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.response?.data?.message || "Error updating stock");
    } finally {
      setUpdating(false);
    }
  };

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  if (!product) {
    return (
      <section className="section-gaps">
        <div className="container text-center">
          <p>Product not found</p>
          <button
            onClick={() => navigate("/addstock")}
            className="btn btn-blue"
          >
            Back to Stock Management
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-stock section-gaps">
      <div className="container">
        <div className="title text-center mb-5">
          <h1 className="heading">Update Stock</h1>
          <p className="text-muted">Manage inventory for {product.name}</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="product-info mb-4">
                  <div className="d-flex align-items-center mb-3">
                    {product.image?.[0] && (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="img-thumbnail me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div>
                      <h5 className="mb-1">{product.name}</h5>
                      <p className="text-muted mb-1">SKU: {product._id}</p>
                      <p className="mb-0">
                        <strong>Category:</strong> {product.category} /{" "}
                        {product.subCategory}
                      </p>
                    </div>
                  </div>

                  <div className="stock-details p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Current Stock:</strong> {product.stock}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Price:</strong> ${product.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateStock}>
                  <div className="mb-3">
                    <label htmlFor="stockQuantity" className="form-label">
                      New Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stockQuantity"
                      className="form-control form-control-lg"
                      onChange={(e) => setStock(e.target.value)}
                      min="0"
                      step="1"
                      required
                    />
                    <div className="form-text">
                      Enter the updated quantity available in inventory
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      onClick={() => navigate("/addstock")}
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
                      {updating ? "Updating..." : "Update Stock"}
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

export default EditStock;
