import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const List = () => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/categories`);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCategories(data);
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/product/subcategories`,
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setSubCategories(data);
    } catch (err) {
      toast.error("Failed to fetch subcategories");
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (product) => {
    if (!product.category) return "uncategorized";
    if (typeof product.category === "object" && product.category.name) {
      return product.category.name;
    }
    const foundCategory = categories.find(
      (cat) => cat._id === product.category,
    );
    return foundCategory ? foundCategory.name : "uncategorized";
  };

  const getSubCategoryName = (product) => {
    if (!product.subCategory) return "uncategorized";
    if (typeof product.subCategory === "object" && product.subCategory.name) {
      return product.subCategory.name;
    }
    const foundSubCategory = subCategories.find(
      (cat) => cat._id === product.subCategory,
    );
    return foundSubCategory ? foundSubCategory.name : "uncategorized";
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.message || "Error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = list.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        (typeof product.category === "string"
          ? product.category.toLowerCase()
          : product.category.name?.toLowerCase()
        ).includes(searchTerm.toLowerCase())) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    fetchList();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } },
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
        error.response?.data?.message ||
          "Error occurred while deleting the product",
      );
    }
  };

  // Shared style for all pagination buttons
  const paginationBtnStyle = {
    height: "25px",
    width: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    transition: "background-color 0.3s",
    borderRadius: "5px",
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
              <table className="table table-bordered">
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
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                          title={product.description}
                        >
                          {product.description}
                        </td>
                        <td>
                          {currency}
                          {product.price}
                        </td>
                        <td>
                          {getCategoryName(product)
                            .toLowerCase()
                            .replace(/\s+/g, "-") || "-"}
                        </td>
                        <td>
                          {getSubCategoryName(product)
                            .toLowerCase()
                            .replace(/\s+/g, "-") || "-"}
                        </td>
                        <td>
                          {product.size?.length > 0
                            ? product.size.join(", ")
                            : "-"}
                        </td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-blue"
                              onClick={() =>
                                navigate(`/edit-product/${product._id}`)
                              }
                            >
                              Edit
                            </button>
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
                          ? "No products available."
                          : "No products match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {/* Previous Button */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      style={{
                        ...paginationBtnStyle,
                        backgroundColor: currentPage === 1 ? "#e0e0e0" : "#000",
                        color: currentPage === 1 ? "#888" : "#fff",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled)
                          e.currentTarget.style.backgroundColor = "#333";
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled)
                          e.currentTarget.style.backgroundColor = "#000";
                      }}
                    >
                      <AiOutlineLeft />
                    </button>
                  </li>

                  {/* Numbered Pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          style={{
                            ...paginationBtnStyle,
                            backgroundColor:
                              currentPage === page ? "#000" : "#fff",
                            color: currentPage === page ? "#fff" : "#000",
                            cursor: "pointer",
                          }}
                          onClick={() => setCurrentPage(page)}
                          onMouseEnter={(e) => {
                            if (currentPage !== page)
                              e.currentTarget.style.backgroundColor = "#ddd";
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page)
                              e.currentTarget.style.backgroundColor = "#fff";
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    ),
                  )}

                  {/* Next Button */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      style={{
                        ...paginationBtnStyle,
                        backgroundColor:
                          currentPage === totalPages ? "#e0e0e0" : "#000",
                        color: currentPage === totalPages ? "#888" : "#fff",
                        cursor:
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled)
                          e.currentTarget.style.backgroundColor = "#333";
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled)
                          e.currentTarget.style.backgroundColor = "#000";
                      }}
                    >
                      <AiOutlineRight />
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
